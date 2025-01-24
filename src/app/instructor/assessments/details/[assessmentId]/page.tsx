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
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { AssessmentDetails } from "@/types/assessment";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface QuestionWithOptions {
  question: string;
  options: Option[];
}

const AssessmentDetailsPage: React.FC = () => {
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
      created_at: currentDetails.created_at,
      updated_at: new Date().toISOString(),
    };

    if (assessmentType === "choices") {
      const questionsObj: Record<string, Record<string, string>> = {};
      const answersObj: Record<string, string> = {};

      questions.forEach((q, index) => {
        // Create options object
        questionsObj[q.question] = q.options.reduce((acc, option, idx) => {
          acc[`option${idx + 1}`] = option.text;
          return acc;
        }, {});

        // Find correct answer
        const correctOptionIndex = q.options.findIndex((opt) => opt.isCorrect);
        if (correctOptionIndex !== -1) {
          answersObj[q.question] = `option${correctOptionIndex + 1}`;
        }
      });

      payload.questions = questionsObj;
      payload.answers = answersObj;
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

    // Conditionally add assessment_id if it's a new assessment
    if (currentDetails.assessment_id) {
      // Update existing assessment
      updateAssessment(currentDetails.assessment_id, payload);
    } else {
      // Create new assessment
      createAssessment(payload);
    }

    setIsDialogOpen(false);
  };

  // Placeholder functions for API calls
  const createAssessment = (data: any) => {
    console.log("Creating assessment:", data);
    // Implement actual API call
  };

  const updateAssessment = (id: number, data: any) => {
    console.log("Updating assessment:", id, data);
    // Implement actual API call
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="teacher" />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assessment Details</CardTitle>
            {currentDetails.title ? (
              <Button onClick={() => setIsDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Create/Edit Details
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            {currentDetails.title ? (
              <div>
                {/* Existing details rendering logic */}
                <h2 className="text-xl font-bold mb-4">
                  {currentDetails.title}
                </h2>
                <p>Deadline: {currentDetails.deadline}</p>
                {Object.entries(currentDetails.question).map(
                  ([question, value]) => (
                    <div key={question} className="mb-4">
                      <h3 className="font-semibold">{question}</h3>
                      {typeof value === "object" ? (
                        <ul>
                          {Object.entries(value).map(([option, optionText]) => (
                            <li key={option}>
                              {option}: {optionText}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{value}</p>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 p-6">
                No assessment details found.
                <Button onClick={() => setIsDialogOpen(true)} className="ml-2">
                  Create New Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create/Edit Assessment Details</DialogTitle>
            </DialogHeader>

            {/* Scrollable content area */}
            <div className="max-h-[500px] overflow-y-auto pr-4">
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Assessment Type</Label>
                  <select
                    value={assessmentType}
                    onChange={(e) => {
                      setAssessmentType(e.target.value as "choices" | "essay");
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
                    <option value="choices">Multiple Choice</option>
                    <option value="essay">Essay</option>
                  </select>
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
