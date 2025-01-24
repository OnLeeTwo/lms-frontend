"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { File, Pencil, Trash2 } from "lucide-react";

const AssessmentPage = () => {
  const submissionData = [
    {
      submission_id: 1,
      role_id: 101,
      user_name: "Alice Johnson",
      file_url: "https://example.com/files/alice_submission.pdf",
      score: 95,
      answer: "The answer to the problem is 42.",
      submitted_at: "2025-01-10T14:32:00",
    },
    {
      submission_id: 2,
      role_id: 102,
      user_name: "Bob Smith",
      file_url: "https://example.com/files/bob_submission.pdf",
      score: 88,
      answer: "The solution is calculated by integrating the given function.",
      submitted_at: "2025-01-12T16:15:00",
    },
    {
      submission_id: 3,
      role_id: 103,
      user_name: "Charlie Brown",
      file_url: "https://example.com/files/charlie_submission.pdf",
      score: 75,
      answer:
        "The hypothesis is supported by the data, with some margin of error.",
      submitted_at: "2025-01-14T11:45:00",
    },
    {
      submission_id: 4,
      role_id: 104,
      user_name: "Diana Lee",
      file_url: "https://example.com/files/diana_submission.pdf",
      score: 92,
      answer: "The final result is 9.8 meters per second squared.",
      submitted_at: "2025-01-15T18:30:00",
    },
    {
      submission_id: 5,
      role_id: 105,
      user_name: "Eve Davis",
      file_url: "https://example.com/files/eve_submission.pdf",
      score: 89,
      answer:
        "The answer follows from the properties of the quadratic equation.",
      submitted_at: "2025-01-20T09:00:00",
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar role="instructor" />

        {/* Main content area */}
        <div className="flex-1 p-8">
          <h1 className="font-bold mb-4">Assessment</h1>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Submitted Time</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionData.map((submission) => (
                <TableRow key={submission.submission_id}>
                  <TableCell>{submission.user_name}</TableCell>
                  <TableCell>
                    <a href={submission.file_url} target="_blank">
                      <File />
                    </a>
                  </TableCell>
                  <TableCell>{submission.submitted_at}</TableCell>
                  <TableCell>{submission.score}</TableCell>
                  <TableCell>{submission.answer}</TableCell>
                  <TableCell className="flex gap-2">
                    {/* Edit Button */}
                    <Dialog>
                      <DialogTrigger>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button className="bg-green-400 hover:bg-green-600">
                              <Pencil className="cursor-pointer" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Give Score</DialogTitle>
                          <DialogDescription>
                            Give your student a score based on their
                            performance. Click save when you&apos;re done
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="score" className="text-right">
                              Score
                            </Label>
                            <Input
                              id="name"
                              placeholder="Put a score between 0-100"
                              defaultValue=""
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Button */}
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          className="hover:bg-red-700"
                          variant="destructive"
                        >
                          <Trash2 className="" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AssessmentPage;
