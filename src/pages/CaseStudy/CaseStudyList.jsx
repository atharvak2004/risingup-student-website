// src/pages/CaseStudy/CaseStudyList.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { getTests } from "../../utils/api";
import { Lock } from "lucide-react";
export default function CaseStudyList() {
  const navigate = useNavigate();
  const location = useLocation();

  const { service_id } = location.state || {};

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, [service_id]);

  const loadTests = async () => {
    try {
      const data = await getTests(service_id);
      setTests(data);
    } catch (err) {
      console.log("Error loading case studies:", err);
    } finally {
      setLoading(false);
    }
  };
  const processedTests = (() => {
    let foundLock = false;

    return tests.filter((item) => {
      // ignore null locks
      if (item.is_locked === null) return false;

      if (item.is_locked === true) {
        if (foundLock) return false;
        foundLock = true;
        return true;
      }

      // show unlocked only before first lock
      if (!foundLock) return true;

      return false;
    });
  })();
  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8">

      <h1 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Case Studies and Tests
      </h1>

      {loading && (
        <p className="text-center text-gray-500 animate-pulse">
          Loading...
        </p>
      )}

      {!loading && tests.length === 0 && (
        <p className="text-gray-500">No case studies found.</p>
      )}

      <div className="space-y-4">
        {processedTests.map((item) => {
          const score = item.best_score;

          const getScoreStyle = () => {
            if (score === null) return "bg-gray-100 text-gray-500";
            if (score >= 80) return "bg-green-100 text-green-700";
            if (score >= 50) return "bg-yellow-100 text-yellow-700";
            return "bg-red-100 text-red-700";
          };

          const getLabel = () => {
            if (score === null) return "Not Attempted";
            if (score >= 80) return "Excellent";
            if (score >= 50) return "Average";
            return "Needs Improvement";
          };

          return (
            <Card
              key={item.id}
              className={`border rounded-2xl transition ${item.is_locked
                  ? "opacity-80 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-lg"
                }`}
              onClick={() => {
                if (item.is_locked) return;

                navigate("/case-study-detail", {
                  state: {
                    id: item.id,
                    title: item.title,
                  },
                });
              }}
            >
              <CardContent className="p-5 space-y-3">

                {/* 🔒 LOCKED UI */}
                {item.is_locked ? (
                  <div className="flex items-center justify-between">

                    <h2 className="font-semibold text-lg text-gray-500">
                      {item.title}
                    </h2>

                    <Lock className="text-red-500 w-5 h-5" />

                  </div>
                ) : (
                  <>
                    {/* HEADER */}
                    <div className="flex justify-between items-start">

                      <h2 className="font-semibold text-lg">
                        {item.title}
                      </h2>

                      {/* SCORE */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.best_score === null
                          ? "bg-gray-100 text-gray-500"
                          : item.best_score >= 80
                            ? "bg-green-100 text-green-700"
                            : item.best_score >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}>
                        {item.best_score !== null
                          ? `${item.best_score}%`
                          : "Not Attempted"}
                      </div>

                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                  </>
                )}

              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}