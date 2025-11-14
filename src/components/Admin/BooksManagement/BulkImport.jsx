import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BulkImport = () => {
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setCheckingAuth(false);
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);

        // Verify user role with backend
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.user.role === "ADMIN") {
            setAuthorized(true);
          }
        }
      } catch (err) {
        console.error("Authorization check failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthorization();
  }, []);

  // Show loading while checking authorization
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if user is not admin
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is
            restricted to administrators only.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Go to Home
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setLoading(true);
    setError("");
    setImportResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bulk-import/books`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setImportResults(data.data);
      } else {
        setError(data.message || "Import failed");
      }
    } catch (err) {
      console.error("Import error:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bulk-import/template`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "book-import-template.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download template");
      }
    } catch (err) {
      console.error("Template download error:", err);
      setError("Failed to download template");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Bulk Import Books
        </h1>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📋 How to Use Bulk Import
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Download the Excel template using the button below</li>
            <li>Fill in your book data following the template format</li>
            <li>Upload the completed Excel file</li>
            <li>Review the import results</li>
          </ol>
          <p className="mt-3 text-blue-700 text-sm">
            <strong>Note:</strong> All fields are reuquired and compulsory to be
            included in the excel sheet.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Import Results */}
        {importResults && (
          <div
            className={`border rounded-lg p-6 mb-6 ${
              importResults.successful > 0
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">Import Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {importResults.successful}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {importResults.failed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {importResults.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Errors:</h4>
                <div className="max-h-40 overflow-y-auto text-sm">
                  {importResults.errors.map((error, index) => (
                    <div
                      key={index}
                      className="text-red-600 py-1 border-b border-red-100 last:border-0"
                    >
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadTemplate}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Download Excel Template
          </button>

          <div className="flex-1">
            <label className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-block text-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Importing...
                </>
              ) : (
                "📤 Upload Excel File"
              )}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Sample Data Preview */}
        {/* <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Sample Data Format</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Title*</th>
                  <th className="border px-4 py-2">Author*</th>
                  <th className="border px-4 py-2">Price*</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Stock</th>
                  <th className="border px-4 py-2">Format</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">The Great Gatsby</td>
                  <td className="border px-4 py-2">F. Scott Fitzgerald</td>
                  <td className="border px-4 py-2">12.99</td>
                  <td className="border px-4 py-2">Fiction</td>
                  <td className="border px-4 py-2">50</td>
                  <td className="border px-4 py-2">PAPERBACK</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-gray-600 text-sm">* Required fields</p>
        </div> */}
      </div>
    </div>
  );
};

export default BulkImport;
