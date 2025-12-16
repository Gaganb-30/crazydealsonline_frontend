// components/BulkBookEditor.jsx
import { useState } from "react";

const BulkBookEditor = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const downloadTemplate = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/template/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "books_template.xlsx"; // Changed from .csv to .xlsx
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage("Excel template downloaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportBooks = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/export/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to export books");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `books_export_${
        new Date().toISOString().split("T")[0]
      }.xlsx`; // Changed to .xlsx
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage("Books exported to Excel successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      event.target.value = "";
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setResults(null);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/import/excel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, let browser set it with boundary
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Upload failed: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setResults(data.data);
      setMessage(
        `Successfully processed ${data.data.processed} books. ` +
          `Created: ${data.data.summary?.created || 0}, ` +
          `Updated: ${data.data.summary?.updated || 0}, ` +
          `Failed: ${data.data.summary?.failed || 0}`
      );

      if (data.data.errors && data.data.errors.length > 0) {
        setError(`Some errors occurred (${data.data.errors.length} total)`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
      event.target.value = ""; // Reset file input
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Bulk Book Editor
      </h2>

      {/* Download Template */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          1. Download Excel Template
        </h3>
        <p className="text-gray-600 mb-4">
          Download the Excel template to see the required format for bulk
          editing. The template includes example data and column headers.
        </p>
        <button
          onClick={downloadTemplate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {loading ? "Downloading..." : "Download Excel Template"}
        </button>
      </div>

      {/* Export Books */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">2. Export Current Books</h3>
        <p className="text-gray-600 mb-4">
          Export all current books to Excel for editing. This will include all
          book details.
        </p>
        <button
          onClick={exportBooks}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {loading ? "Exporting..." : "Export Books to Excel"}
        </button>
      </div>

      {/* Import Books */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">3. Import Updated Books</h3>
        <p className="text-gray-600 mb-4">
          Upload your edited Excel file to create or update books in bulk.
          <br />
          <span className="text-sm">
            • Leave <code className="bg-gray-100 px-1 rounded">_id</code> empty
            to create new books
            <br />• Include{" "}
            <code className="bg-gray-100 px-1 rounded">_id</code> to update
            existing books
            <br />• File must be in .xlsx or .xls format
          </span>
        </p>

        <div className="mt-2">
          <label className="block">
            <span className="sr-only">Choose Excel file</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Excel file (.xlsx, .xls) up to 10MB
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 mb-4 text-blue-700 bg-blue-50 rounded-lg flex items-center gap-3">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing, please wait...</span>
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg flex items-start gap-2">
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg flex items-start gap-2">
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Import Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-500">Total Processed</div>
              <div className="text-2xl font-bold text-gray-900">
                {results.processed}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-500">Created</div>
              <div className="text-2xl font-bold text-green-600">
                {results.summary?.created ||
                  results.results?.filter((r) => r.action === "created")
                    .length ||
                  0}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-500">Updated</div>
              <div className="text-2xl font-bold text-blue-600">
                {results.summary?.updated ||
                  results.results?.filter((r) => r.action === "updated")
                    .length ||
                  0}
              </div>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">
                  Errors ({results.errors.length})
                </h4>
                <span className="text-sm text-red-600">
                  Some rows failed to process
                </span>
              </div>
              <div className="bg-white border rounded max-h-60 overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {results.errors.slice(0, 10).map((error, index) => (
                    <li key={index} className="p-3 text-sm hover:bg-gray-50">
                      <div className="font-medium text-red-600">
                        Error on row {index + 1}
                      </div>
                      <div className="text-gray-600 mt-1">{error}</div>
                    </li>
                  ))}
                  {results.errors.length > 10 && (
                    <li className="p-3 text-sm text-center text-gray-500">
                      ... and {results.errors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {results.results && results.results.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Recent Changes</h4>
              <div className="bg-white border rounded max-h-60 overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {results.results.slice(0, 5).map((result, index) => (
                    <li key={index} className="p-3 text-sm hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {result.book?.title}
                          </div>
                          <div className="text-gray-600 text-xs mt-1">
                            {result.book?.author} • {result.book?.category}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            result.action === "created"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {result.action === "created" ? "New" : "Updated"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkBookEditor;
