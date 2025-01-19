"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Submission } from "@/types/submission";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArrowLeft,
  ClipboardList
} from "lucide-react";


const SubmissionList = () => {
  const router = useRouter();
  const { assessmentId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) return; // If no assessmentId in query, skip fetching

    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);

      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        setError("User data not found. Please log in.");
        setLoading(false);
        return;
      }

      const { token, roles } = JSON.parse(storedUserData);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/assessments/${assessmentId}/submissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.submissions) {
          setSubmissions(data.submissions);
        } 
      } catch (error) {
        setError("An error occurred while fetching the submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assessmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!submissions) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="teacher" />
        <div className="p-8 flex-1">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold">There is no submissions submitted</h3>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="teacher" />
      <div className="p-8 flex-1">
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Module Details
          </Button>
        </header>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Submissions (Assessment #{assessmentId})</h2>
            </div>
            {submissions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No submissions available for this module.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div className="p-4 rounded-lg border">
                    <div
                      key={submission.submission_id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg">
                            {submission.user_name}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            <p>
                              Submission #{submission.submission_id}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Submitted at: {new Date(submission.submitted_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-lg">Score: {submission.score || "Not graded"}</p>
                        {/* <Button variant="outline" size="sm">
                          View Details
                        </Button> */}
                      </div>
                    </div>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                        <AccordionTrigger>See Answer</AccordionTrigger>
                          <AccordionContent>
                            {submission.file && <p>File: <a href={submission.file} target="_blank" rel="noopener noreferrer">View Submission</a></p>}
                            {submission.answer && (
                              <div className="rounded-md bg-muted p-4 font-mono text-sm">
                                {Object.entries(submission.answer).map(([question, answer], index) => (
                                  <div key={index} className="mb-2">
                                    <span className="font-semibold">{question}: </span>
                                    <span className="pl-4 text-gray-700">
                                      {answer}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmissionList;
