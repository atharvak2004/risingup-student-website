import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getServices, getUser } from "../utils/api";

export default function Home() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // ✅ Use helper (cleaner)
            const user = getUser();

            if (!user) {
                navigate("/");
                return;
            }

            setProfile(user);

            // ✅ NO NEED to pass school_id anymore
            const serviceList = await getServices();
            setServices(serviceList);

        } catch (err) {
            console.log("Home Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !profile) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
                <p className="text-gray-500 animate-pulse">Loading...</p>
            </div>
        );
    }

    const gradeId = profile?.grade_id;

    return (
        <div className="min-h-screen bg-white dark:bg-black px-6 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-black dark:text-white">
                    Welcome, {profile.full_name}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Here are your details and available services
                </p>
            </div>

            {/* Student Info */}
            <Card className="border border-gray-3   00 dark:border-white/10 shadow-sm rounded-2xl mb-8">
                <CardContent className="p-6 space-y-2 text-sm">
                    <p>
                        <span className="font-medium text-black dark:text-white">
                            Roll No:
                        </span>{" "}
                        {profile.admission_no}
                    </p>

                    <p>
                        <span className="font-medium text-black dark:text-white">
                            Grade:
                        </span>{" "}
                        {profile.grade_name} ({profile.section_name})
                    </p>
                    <p>
                        <span className="font-medium text-black dark:text-white">
                            School:
                        </span>{" "}
                        {profile.school_name}
                    </p>
                    <p>
                        <span className="font-medium text-black dark:text-white">
                            Email:
                        </span>{" "}
                        {profile.email}
                    </p>
                </CardContent>
            </Card>

            {/* Services */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((svc) => (
                    <Card
                        key={svc.id}
                        className="border border-gray-300 dark:border-white/10 rounded-2xl hover:shadow-md transition cursor-pointer h-full flex flex-col"
                        onClick={() =>
                            navigate("/service", {
                                state: {
                                    id: svc.id,
                                    name: svc.name,
                                    grade_id: gradeId,
                                },
                            })
                        }
                    >
                        <CardContent className="p-5 flex flex-col h-full justify-between">

                            {/* Top Content */}
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-black dark:text-white">
                                    {svc.name}
                                </h2>

                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {svc.description}
                                </p>
                            </div>

                            {/* Bottom Button */}
                            <Button variant="outline" className="mt-4 w-full">
                                View Details
                            </Button>

                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
}