"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, FileText, X } from "lucide-react";

const AddCourse = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast({
                title: "Error",
                description: "Please enter a course title",
                variant: "destructive",
            });
            return;
        }
        if (!description.trim()) {
            toast({
                title: "Error",
                description: "Please enter a course description",
                variant: "destructive",
            });
            return;
        }

        if (!category.trim()) {
            toast({
                title: "Error",
                description: "Please enter a course category",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            // Here you would normally make an API call to create the course
            const courseData = {
                title,
                description,
                category,
                media: file ? URL.createObjectURL(file) : null,
            };

            console.log("Creating new course:", courseData);

            toast({
                title: "Success",
                description: "Course created successfully",
            });

            router.back();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create course",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar role="teacher" />
            <div className="p-8 flex-1">
                <header className="mb-8">
                    <Button variant="ghost" onClick={() => router.push("/courses-instructor")} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Button>
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold">Create New Course</h1>
                        <Button onClick={handleSubmit} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? "Creating..." : "Create Course"}
                        </Button>
                    </div>
                </header>

                <div className="grid gap-6">
                    <Card className="p-6">
                        <div className="mb-6">
                            <Label htmlFor="title">Course Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter course title" className="mt-1" />
                        </div>

                        <div className="mb-6">
                            <Label htmlFor="title">Course Description</Label>
                            <Input id="title" value={title} onChange={(e) => setDescription(e.target.value)} placeholder="Enter course description" className="mt-1" />
                        </div>

                        <div className="mb-6">
                            <Label htmlFor="title">Course Category</Label>
                            <Input id="title" value={title} onChange={(e) => setCategory(e.target.value)} placeholder="Enter course category" className="mt-1" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Media</h2>
                        <div className="space-y-4">
                            {!file ? (
                                <div className="border-2 border-dashed rounded-lg p-6">
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Click to upload course media</span>
                                        <input type="file" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={removeFile}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
