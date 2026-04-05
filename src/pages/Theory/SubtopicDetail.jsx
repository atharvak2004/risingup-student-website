// src/pages/Theory/SubtopicDetail.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { getTopicDetail } from "../../utils/api";

export default function SubtopicDetail() {
  const location = useLocation();
  const { subtopic_id } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubtopic();
  }, []);

  const loadSubtopic = async () => {
    try {
      const res = await getTopicDetail(subtopic_id);
      setData(res);
    } catch (err) {
      console.log("❌ Subtopic Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* Header */}
      <div className="bg-blue-600 text-white py-6 rounded-b-3xl shadow-md text-center">
        <h1 className="text-xl font-bold">{data?.title}</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <Card className="rounded-2xl border border-blue-100 shadow-sm">
          <CardContent className="p-6 space-y-4">

            {data?.image && (
              <img
                src={data.image}
                alt="subtopic"
                className="w-full h-56 object-cover rounded-xl"
              />
            )}

            <p className="text-gray-700 leading-relaxed">
              {data?.description}
            </p>

          </CardContent>
        </Card>
      </div>

    </div>
  );
}