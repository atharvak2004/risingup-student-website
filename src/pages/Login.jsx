import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// ✅ UPDATED IMPORT
import { studentLogin } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔥 CALL NEW API
      const res = await studentLogin(form.username, form.password);

      const user = res.user;

      console.log("Login success:", res);

      // ✅ Handle first login (force password change)
      if (user.is_first_login) {
        navigate("/new-password");
        return;
      }

      // ✅ Role-based routing (optional future-safe)
      if (user.role === "STUDENT") {
        navigate("/");
      } else {
        navigate("/"); // fallback
      }

    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        const msg =
          err.response.data.detail ||
          err.response.data.non_field_errors?.[0] ||
          "Invalid username or password";

        setError(msg);
      } else {
        setError("Something went wrong. Please try again.");
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
              Login
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <Input
                name="username"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
                >
                  {showPassword ? (
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
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}