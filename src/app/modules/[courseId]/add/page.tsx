"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tiptap from "@/components/Tiptap";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, FileText, X } from "lucide-react";

const AddModule = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a module title",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to the module",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would normally make an API call to create the module
      const moduleData = {
        title,
        content,
        module_file: file ? URL.createObjectURL(file) : null,
      };

      console.log("Creating new module:", moduleData);

      toast({
        title: "Success",
        description: "Module created successfully",
      });

      router.back();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create module",
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
          <Button
            variant="ghost"
            onClick={() => router.push(`/modules/${courseId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">Create New Module</h1>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Creating..." : "Create Module"}
            </Button>
          </div>
        </header>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="mb-6">
              <Label htmlFor="title">Module Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter module title"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Content</Label>
              <div className="mt-1">
                <Tiptap
                  content=""
                  editable={true}
                  onSave={handleSave}
                  onCancel={() => {}}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Materials</h2>
            <div className="space-y-4">
              {!file ? (
                <div className="border-2 border-dashed rounded-lg p-6">
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload module materials
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
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

export default AddModule;
