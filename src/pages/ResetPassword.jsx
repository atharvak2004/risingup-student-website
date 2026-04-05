import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// ✅ IMPORT API
import { changePassword, logout } from "../utils/api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔥 CALL API
      await changePassword(form.newPassword);

      // ✅ Update local user (optional)
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.is_first_login = false;
        localStorage.setItem("user", JSON.stringify(user));
      }

      // ✅ Logout after password change (best practice)
      logout();

    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to update password. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <Card className="w-full max-w-md border border-gray-200 dark:border-white/10 shadow-md rounded-2xl">
        <CardContent className="p-8 space-y-6">

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              Set New Password
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create a strong password to secure your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
                >
                  {showPassword.new ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-900 transition-all h-10"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>

          {/* Back */}
          <p className="text-sm text-center text-gray-500">
            Back to{" "}
            <span
              className="text-black dark:text-white font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}