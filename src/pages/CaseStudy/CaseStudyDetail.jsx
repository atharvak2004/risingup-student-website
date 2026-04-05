// src/pages/CaseStudy/CaseStudyDetail.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  getCaseStudyDetail,
  submitCaseStudyAnswers,
} from "../../utils/api";

export default function CaseStudyDetail() {
  const location = useLocation();
  const { id, title } = location.state || {};

  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadCaseStudy();
  }, [id]);

  const loadCaseStudy = async () => {
    try {
      const data = await getCaseStudyDetail(id);
      setCaseStudy(data);
    } catch (err) {
      console.log("Error loading case detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId, optId) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = async () => {
    const payload = caseStudy.questions.map((q) => ({
      question_id: q.id,
      selected_option_id: answers[q.id],
    }));

    try {
      setSubmitting(true);
      const res = await submitCaseStudyAnswers(id, payload);
      setResult(res);
    } catch (err) {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const questions = caseStudy?.questions || [];
  const q = questions[current];

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8">

      {/* BEFORE START */}
      {!started ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">

            <h1 className="text-2xl font-bold text-center">
              {caseStudy?.title || title}
            </h1>

            {caseStudy?.image && (
              <img
                src={caseStudy.image}
                className="w-full h-48 object-cover rounded-xl"
              />
            )}

            <p className="text-gray-600">
              {caseStudy?.description}
            </p>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setStarted(true)}
            >
              Start Assessment
            </Button>

          </CardContent>
        </Card>
      ) : result ? (
        /* RESULT */
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
          <Button asChild variant="outline" >
            <Link to="/">
              ← Back to
            </Link>
          </Button>
          {/* HEADER */}
          <Card>
            <CardContent className="p-6 text-center space-y-4">

              <h1 className="text-3xl font-bold">Your Result</h1>

              <p className="text-xl font-semibold">
                Score: {result.score.toFixed(1)}%
              </p>

              {/* 🔥 PROGRESS BAR */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-500 ease-in-out
        bg-gradient-to-r from-green-400 to-green-600"
                  style={{ width: `${result.score}%` }}
                />
              </div>

              {/* optional label */}
              <p className="text-sm text-gray-500">
                Accuracy: {result.accuracy}%
              </p>

              <p>
                {result.correct_answers} / {result.total_questions} Correct
              </p>

              {/* PERFORMANCE BADGE */}
              <div className={`inline-block px-4 py-1 rounded-full text-white text-sm ${result.performance === "Excellent"
                ? "bg-green-500"
                : result.performance === "Average"
                  ? "bg-yellow-500"
                  : "bg-red-500"
                }`}>
                {result.performance}
              </div>

            </CardContent>
          </Card>

          {/* ANSWER REVIEW */}
          <div className="space-y-4">
            {result.answers.map((ans, index) => {

              const isCorrect = ans.is_correct;

              return (
                <Card key={index}>
                  <CardContent className="p-5 space-y-3">

                    <h2 className="font-semibold">
                      Q{index + 1}. {ans.question_text}
                    </h2>

                    {/* SELECTED ANSWER */}
                    <div className={`p-3 rounded-lg border ${isCorrect
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                      }`}>
                      <span className="font-medium">Your Answer: </span>
                      {ans.selected_answer || "Not Attempted"}
                    </div>

                    {/* CORRECT ANSWER (only show if wrong) */}
                    {!isCorrect && (
                      <div className="p-3 rounded-lg border bg-green-100 border-green-500">
                        <span className="font-medium">Correct Answer: </span>
                        {ans.correct_answer}
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      ) : (
        <>
          {/* QUESTION */}
          <div className="max-w-2xl mx-auto space-y-6">

            <p className="text-center font-semibold">
              Question {current + 1} / {questions.length}
            </p>

            <Card>
              <CardContent className="p-6 space-y-4">

                <h2 className="text-lg font-semibold text-center">
                  {q?.text}
                </h2>

                {q?.options.map((opt) => {
                  const selected = answers[q.id] === opt.id;

                  return (
                    <button
                      variant="outline"
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`w-full p-3 rounded-lg border text-center ${selected
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300"
                        }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}

              </CardContent>
            </Card>

            {/* NAVIGATION */}
            <div className="flex gap-3">

              {current > 0 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrent((p) => p - 1)}
                >
                  Previous
                </Button>
              )}

              {current < questions.length - 1 ? (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrent((p) => p + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Test"}
                </Button>
              )}

            </div>

          </div>
        </>
      )}

    </div>
  );
}