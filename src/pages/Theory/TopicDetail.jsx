// src/pages/Theory/TopicDetail.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { getTopicDetail } from "../../utils/api";

export default function TopicDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { topic_id } = location.state || {};

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopic();
  }, []);

  const loadTopic = async () => {
    try {
      const data = await getTopicDetail(topic_id);
      setTopic(data);
    } catch (err) {
      console.log("❌ Topic Load Error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!topic) {
    return <div className="p-6">Topic not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8">

      <Card className="rounded-2xl border border-gray-200 dark:border-white/10">
        <CardContent className="p-6 space-y-4">

          {topic.image && (
            <img
              src={topic.image}
              alt="topic"
              className="w-full h-56 object-cover rounded-xl"
            />
          )}

          <h1 className="text-2xl font-bold text-center text-black dark:text-white">
            {topic.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {topic.description}
          </p>

          {/* Subtopics */}
          {topic.subtopics?.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6">Subtopics</h2>

              <div className="space-y-3">
                {topic.subtopics.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-md border rounded-xl"
                    onClick={() =>
                      navigate("/subtopic", {
                        state: { subtopic_id: item.id },
                      })
                    }
                  >
                    <CardContent className="p-4">
                      <p className="font-medium">{item.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

        </CardContent>
      </Card>

    </div>
  );
}