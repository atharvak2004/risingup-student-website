// src/pages/Theory/TheoryPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { getTheoryTopics } from "../../utils/api";

export default function TheoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { service_id } = location.state || {};

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const res = await getTheoryTopics(service_id);
      setTopics(res);
    } catch (err) {
      console.log("❌ Theory Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8">

      <h1 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Chapters
      </h1>

      <div className="space-y-4">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className="cursor-pointer hover:shadow-md transition border border-gray-200 dark:border-white/10 rounded-2xl"
            onClick={() =>
              navigate("/topic", {
                state: { topic_id: topic.id },
              })
            }
          >
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                {topic.title}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}