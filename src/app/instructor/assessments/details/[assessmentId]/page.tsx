"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { AssessmentDetails } from "@/types/assessment";
import {
  createAssesmentDetails,
  updateAssesmentDetails,
  getAssessmentsDetails,
} from "@/services/assessmentService";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface QuestionWithOptions {
  question: string;
  options: Option[];
}

const AssessmentDetailsPage: React.FC = () => {
  const { toast } = useToast();
  const { assessmentId } = useParams();
  const [assessmentType, setAssessmentType] = useState<"choices" | "essay">(
    "choices"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDetails, setCurrentDetails] = useState<AssessmentDetails>({
    assessment_id: 1,
    title: "",
    question: {},
    answer: null,
    deadline: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message: "",
  });
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([
    {
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (typeof assessmentId === "string") {
          const response = await getAssessmentsDetails(assessmentId);
          setCurrentDetails(response);

          const formattedDeadline = response.deadline
            ? new Date(response.deadline).toISOString().slice(0, 16)
            : "";

          setCurrentDetails({
            ...response,
            deadline: formattedDeadline,
          });

          // Populate questions based on fetched data
          if (response.question) {
            const parsedQuestions: QuestionWithOptions[] = Object.entries(
              response.question
            ).map(([question, options]) => ({
              question,
              options: Object.entries(options).map(([key, text], index) => ({
                text: text as string,
                isCorrect: response.answer?.[question] === key,
              })),
            }));
            setQuestions(parsedQuestions);
          }

          // Set assessment type based on data
          setAssessmentType(response.answer ? "choices" : "essay");
        } else {
          throw new Error("Invalid assessment ID");
        }
      } catch (error) {
        console.log("Error fetching assessment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(newQuestions);
  };

  const toggleCorrectOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === optionIndex,
    }));
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    let payload: any = {
      title: currentDetails.title,
      deadline: currentDetails.deadline || new Date().toISOString(),
    };

    if (assessmentType === "choices") {
      const questionsObj: Record<string, Record<string, string>> = {};
      const answersObj: Record<string, string> = {};

      questions.forEach((q, index) => {
        // Create options object
        questionsObj[q.question] = q.options.reduce<Record<string, string>>(
          (acc, option, idx) => {
            acc[`option${idx + 1}`] = option.text;
            return acc;
          },
          {}
        );

        // Find correct answer
        const correctOptionIndex = q.options.findIndex((opt) => opt.isCorrect);
        if (correctOptionIndex !== -1) {
          answersObj[q.question] = `option${correctOptionIndex + 1}`;
        }
      });

      payload.question = questionsObj;
      payload.answer = answersObj;
    } else {
      const questionObj: Record<string, string> = {};
      questions.forEach((q, index) => {
        if (q.question) {
          questionObj[`question${index + 1}`] = q.question;
        }
      });

      payload.question = questionObj;
      payload.answer = null;
    }

    if (currentDetails.assessment_id) {
      updateAssessment(payload);
    } else {
      createAssessment(currentDetails.assessment_id, payload);
    }

    setIsDialogOpen(false);
  };

  // Placeholder functions for API calls
  const createAssessment = async (
    id: number,
    data: Partial<AssessmentDetails>
  ) => {
    try {
      const response = await createAssesmentDetails(id.toString(), data);
      if (response) {
        toast({
          title: "Success",
          description: "Assessment details created successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error creating assessment details:", error);
      toast({
        title: "Error",
        description: "Failed to create assessment details",
        variant: "destructive",
      });
    }
  };

  const updateAssessment = async (data: Partial<AssessmentDetails>) => {
    try {
      const response = await updateAssesmentDetails(
        currentDetails.assessment_id.toString(),
        data
      );
      if (response) {
        toast({
          title: "Success",
          description: "Assessment details updated successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error updating assessment details:", error);
      toast({
        title: "Error",
        description: "Failed to update assessment details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="teacher" />
      <div className="container mx-auto p-6 space-y-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-primary-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary-700">
                {currentDetails.title || "Assessment Details"}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {currentDetails.deadline
                  ? `Deadline: ${new Date(
                      currentDetails.deadline
                    ).toLocaleString()}`
                  : "No deadline set"}
              </p>
            </div>
            {currentDetails.title ? (
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="hover:bg-primary-100"
              >
                <Plus className="mr-2 h-4 w-4" /> Edit Assessment
              </Button>
            ) : null}
          </CardHeader>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <CardContent className="p-6">
              {currentDetails.title ? (
                <div className="space-y-4">
                  {Object.entries(currentDetails.question).map(
                    ([question, value]) => (
                      <div
                        key={question}
                        className="bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-lg mb-2">
                          {question}
                        </h3>
                        {typeof value === "object" ? (
                          <ul className="space-y-2">
                            {Object.entries(value).map(
                              ([option, optionText]) => (
                                <li
                                  key={option}
                                  className="flex items-center space-x-2"
                                >
                                  <span className="font-medium text-muted-foreground">
                                    {option}:
                                  </span>
                                  <span>{optionText as string}</span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>{value}</p>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    No assessment details found
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="mx-auto"
                  >
                    Create New Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create/Edit Assessment Details</DialogTitle>
            </DialogHeader>

            {/* Scrollable content area */}
            <div className="max-h-[500px] overflow-y-auto pr-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Assessment Type</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {assessmentType === "choices"
                          ? "Multiple Choice"
                          : "Essay"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          setAssessmentType("choices");
                          setQuestions([
                            {
                              question: "",
                              options: [
                                { text: "", isCorrect: false },
                                { text: "", isCorrect: false },
                                { text: "", isCorrect: false },
                                { text: "", isCorrect: false },
                              ],
                            },
                          ]);
                        }}
                      >
                        Multiple Choice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setAssessmentType("essay");
                          setQuestions([
                            {
                              question: "",
                              options: [
                                { text: "", isCorrect: false },
                                { text: "", isCorrect: false },
                                { text: "", isCorrect: false },
                                { text: "", isCorrect: false },
                              ],
                            },
                          ]);
                        }}
                      >
                        Essay
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Title</Label>
                  <Input
                    value={currentDetails.title}
                    onChange={(e) =>
                      setCurrentDetails({
                        ...currentDetails,
                        title: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={currentDetails.deadline}
                    onChange={(e) =>
                      setCurrentDetails({
                        ...currentDetails,
                        deadline: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                {questions.map((q, questionIndex) => (
                  <div key={questionIndex} className="mb-4">
                    <div className="flex items-center">
                      <Input
                        placeholder="Enter question"
                        value={q.question}
                        onChange={(e) =>
                          handleQuestionChange(questionIndex, e.target.value)
                        }
                      />
                      {questionIndex > 0 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveQuestion(questionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {assessmentType === "choices" && (
                      <div className="mt-2 space-y-2">
                        {q.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              variant={option.isCorrect ? "default" : "outline"}
                              onClick={() =>
                                toggleCorrectOption(questionIndex, optionIndex)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Correct
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleAddQuestion}>
                    <Plus className="mr-2 h-4 w-4" /> Add Question
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssessmentDetailsPage;
