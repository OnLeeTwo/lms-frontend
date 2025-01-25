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
} from "@/components/ui/accordion";
import { ArrowLeft, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const SubmissionList = () => {
  const router = useRouter();
  const { assessmentId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [score, setScore] = useState<number | "">("");
  const { toast } = useToast();

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

  const handleViewDetails = (submission: any) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  const handleSubmitScore = async () => {
    if (score === "") {
      toast({
        description: "Please enter a valid score.",
        variant: "destructive",
      });
      return;
    }

    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      setError("User data not found. Please log in.");
      setLoading(false);
      return;
    }
    const { token, roles } = JSON.parse(storedUserData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/submissions/${selectedSubmission.submission_id}/grade`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score }),
        }
      );

      if (response.ok) {
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((submission) =>
            submission.submission_id === selectedSubmission?.submission_id
              ? { ...submission, score: Number(score) }
              : submission
          )
        );
        toast({
          description: "Score submitted successfully.",
          variant: "default",
        });
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          description: errorData.message || "Failed to submit score.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "An error occurred while submitting the score.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="teacher" />
        <LoadingSpinner className="flex align-center justify-center min-h-screen bg-background" />
      </div>
    );
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
            <h3 className="text-lg font-semibold">
              There is no submissions submitted
            </h3>
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
              <h2 className="text-xl font-semibold">
                Submissions (Assessment #{assessmentId})
              </h2>
              <p className="text-muted-foreground">
                Total Submissions: {submissions.length}
              </p>
            </div>
            {submissions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No submissions available for this assessment yet.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.submission_id}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg">{submission.user_name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <p>
                              Submitted at:{" "}
                              {new Date(
                                submission.submitted_at
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-lg">
                          Score: {submission.score || "Not graded"}
                        </p>
                      </div>
                    </div>
                    {submission.file && (
                      <div>
                        <p>
                          File:{" "}
                          <a
                            href={submission.file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Submission
                          </a>
                        </p>
                      </div>
                    )}
                    {submission.answer && (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="justify-end gap-2 mb-0 pb-1">
                            See answers
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="rounded-md bg-muted p-4 font-mono text-sm">
                              {Object.entries(submission.answer).map(
                                ([question, answer], index) => (
                                  <div key={question} className="mb-2">
                                    <span className="font-semibold">
                                      {question}:{" "}
                                    </span>
                                    <span className="pl-4 text-gray-700">
                                      {answer}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      {/* Dialog Popup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <div>
              <DialogHeader>
                <DialogTitle>{selectedSubmission.assessment_title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <strong>Question:</strong>
                <p className="text-muted-foreground">
                  {selectedSubmission.question["question 1"] || "N/A"}
                </p>
              </div>
              <div className="mt-4">
                <strong>Submission Answer:</strong>
                <div className="mt-2">
                  {/* <img
                    src={selectedSubmission.file_url}
                    alt="Submission File"
                    className="w-full rounded-lg border shadow-md"
                  /> */}
                  {selectedSubmission.file_url ? (
                    selectedSubmission.file_url.endsWith(".pdf") ? (
                      <a
                        href={selectedSubmission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Check Submission Answer
                      </a>
                    ) : (
                      <img
                        src={selectedSubmission.file_url}
                        alt="Submission File"
                        className="w-full rounded-lg border shadow-md"
                      />
                    )
                  ) : (
                    <p className="text-gray-500">No file available</p>
                  )}
                </div>
              </div>
              {/* Input Score */}
              <div className="mt-4">
                <label htmlFor="score" className="block font-medium">
                  Enter Score:
                </label>
                <Input
                  id="score"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="mt-2"
                  placeholder="Enter a score (e.g., 85)"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button variant="default" onClick={handleSubmitScore}>
              Submit Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionList;
