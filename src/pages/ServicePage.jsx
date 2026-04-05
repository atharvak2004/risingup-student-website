import { useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ServicePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get params from navigation state
  const { id = null, name = "", grade_id = null } = location.state || {};

  const serviceName = name
    ? decodeURIComponent(name)
    : id
    ? `Service ${id}`
    : "Service";

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8">

      {/* Header Card */}
      <Card className="mb-8 border border-gray-200 dark:border-white/10 rounded-2xl">
        <CardContent className="p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
            {serviceName}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Choose what you want to learn
          </p>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">

        {/* THEORY */}
        <Card
          className="cursor-pointer hover:shadow-md transition border border-gray-200 dark:border-white/10 rounded-2xl"
          onClick={() =>
            navigate("/theory", {
              state: {
                service_id: id,
                grade_id,
                name: serviceName,
              },
            })
          }
        >
          <CardContent className="p-5 flex items-center justify-between">
            <span className="text-lg font-semibold text-black dark:text-white">
              Theory
            </span>
            <Button variant="outline">Open</Button>
          </CardContent>
        </Card>

        {/* TESTS / CASE STUDIES */}
        <Card
          className="cursor-pointer hover:shadow-md transition border border-gray-200 dark:border-white/10 rounded-2xl"
          onClick={() =>
            navigate("/case-studies", {
              state: {
                service_id: id,
                grade_id,
                name: serviceName,
              },
            })
          }
        >
          <CardContent className="p-5 flex items-center justify-between">
            <span className="text-lg font-semibold text-black dark:text-white">
               Case Studies and Tests
            </span>
            <Button variant="outline">Open</Button>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}