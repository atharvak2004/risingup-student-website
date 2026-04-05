import { useEffect, useState } from "react";
import { getStudentProfile, updateStudentProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdateProfile() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // ============================
  // FETCH DATA
  // ============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();

        const [first_name = "", ...rest] =
          data.full_name?.split(" ") || [];
        const last_name = rest.join(" ");

        setForm({
          first_name,
          last_name,
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ============================
  // HANDLE INPUT
  // ============================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateStudentProfile(form);
      navigate("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="mb-8">
          

          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <p className="text-sm text-gray-500">
            Update your personal information
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white border rounded-xl shadow-sm p-6">

          <form onSubmit={handleSubmit} className="space-y-6">

            <Field
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />

            <Field
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <Field
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 ">

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="bg-black text-white hover:bg-gray-800"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================
// FIELD
// ============================
function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        {...props}
        className="border-gray-300 focus:border-black focus:ring-0 transition"
      />
    </div>
  );
}