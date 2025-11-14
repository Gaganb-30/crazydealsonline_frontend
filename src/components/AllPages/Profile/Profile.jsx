import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Lock,
  ShoppingBag,
  Calendar,
  Shield,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    optionalPhone: "",
  });

  // Address states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    hNo: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  // Password states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        setProfileForm({
          name: data.data.user.name || "",
          phone: data.data.user.phone || "",
          optionalPhone: data.data.user.optionalPhone || "",
        });

        if (data.data.user.address) {
          setAddressForm({
            hNo: data.data.user.address.hNo || "",
            street: data.data.user.address.street || "",
            city: data.data.user.address.city || "",
            state: data.data.user.address.state || "",
            zipCode: data.data.user.address.zipCode || "",
            country: data.data.user.address.country || "India",
          });
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile" });
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.data.orders || []);
        }
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setIsEditingProfile(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Validate address
    const missingFields = [];
    if (!addressForm.hNo?.trim()) missingFields.push("House Number");
    if (!addressForm.street?.trim()) missingFields.push("Street");
    if (!addressForm.city?.trim()) missingFields.push("City");
    if (!addressForm.state?.trim()) missingFields.push("State");
    if (!addressForm.zipCode?.trim()) missingFields.push("ZIP Code");

    if (missingFields.length > 0) {
      setMessage({
        type: "error",
        text: `Please fill in: ${missingFields.join(", ")}`,
      });
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/address`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        setUser((prev) => ({ ...prev, address: data.data.address }));
        setIsEditingAddress(false);
        setMessage({ type: "success", text: "Address updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update address",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update address" });
      console.error("Address update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setMessage({ type: "success", text: "Password changed successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.message + ". " + data.error || "Failed to change password",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to change password" });
      console.error("Password change error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const isAddressComplete = () => {
    if (!user?.address) return false;
    const addr = user.address;
    return addr.hNo && addr.street && addr.city && addr.state && addr.zipCode;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User not found
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: "profile", name: "Profile", icon: User },
                { id: "address", name: "Address", icon: MapPin },
                { id: "password", name: "Password", icon: Lock },
                { id: "orders", name: "My Orders", icon: ShoppingBag },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === "orders") fetchOrders();
                    }}
                    className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Personal Information
              </h2>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex items-center text-gray-600 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                {user.optionalPhone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Alternate Phone</p>
                      <p className="font-medium">{user.optionalPhone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">
                      {user.role?.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternate Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={profileForm.optionalPhone}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          optionalPhone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Address Tab */}
        {activeTab === "address" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Shipping Address
              </h2>
              {!isEditingAddress ? (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  {isAddressComplete() ? "Edit" : "Add Address"}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="flex items-center text-gray-600 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              )}
            </div>

            {!isEditingAddress ? (
              <div>
                {isAddressComplete() ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">House/Flat No.</p>
                        <p className="font-medium">{user.address.hNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Street</p>
                        <p className="font-medium">{user.address.street}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-medium">{user.address.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="font-medium">{user.address.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ZIP Code</p>
                        <p className="font-medium">{user.address.zipCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="font-medium">{user.address.country}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Address Saved
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add your shipping address to make checkout faster
                    </p>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleAddressUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House/Flat No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.hNo}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          hNo: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.zipCode}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Change Password
            </h2>

            <form
              onSubmit={handlePasswordChange}
              className="max-w-md space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">${order.totalAmount}</p>
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't placed any orders yet
                </p>
                <button
                  onClick={() => navigate("/categories")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
