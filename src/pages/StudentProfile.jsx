import { useEffect, useState } from "react";
import { getStudentProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const data = await getStudentProfile();
            setProfile(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 text-black">
                Loading profile...
            </div>
        );
    }

    return (
        <div className=" bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white border rounded-xl shadow-sm">

                {/* HEADER / HERO */}
                <div className="px-6 py-6 flex items-center justify-between border-b">
                    <div className="flex items-center gap-4">

                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-semibold">
                            {profile.full_name?.charAt(0)}
                        </div>

                        {/* Name + Email */}
                        <div>
                            <h1 className="text-xl font-semibold">
                                {profile.full_name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {profile.email}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => navigate("/profile/edit")}
                    >
                        Edit Profile
                    </Button>
                </div>

                {/* CONTENT */}
                <div className="px-6 py-6 space-y-8">

                    {/* PERSONAL INFO */}
                    <Section title="Personal Information">
                        <Item label="Full Name" value={profile.full_name} />
                        <Item label="Username" value={profile.username} />
                        <Item label="Email" value={profile.email} />
                        <Item label="Phone" value={profile.phone || "-"} />
                    </Section>

                    {/* SCHOOL */}
                    <Section title="School">
                        <Item label="School Name" value={profile.school_name} />
                    </Section>

                    {/* ACADEMIC */}
                    <Section title="Academic Details">
                        <Item label="Grade" value={profile.grade_name} />
                        <Item label="Section" value={profile.section_name} />
                        <Item label="Roll Number" value={profile.admission_no} />
                    </Section>

                </div>
            </div>
        </div>
    );
}

// ============================
// SECTION
// ============================
function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {title}
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {children}
            </div>
        </div>
    );
}

// ============================
// ITEM
// ============================
function Item({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}