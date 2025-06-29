"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import type { GeneratedResource } from "@/lib/schemas";
import { ResourceSection, ResourceWithSections } from "@/types/resources";
import { ArrowLeft, Save, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_PROMPT = `Extract educational content from this EPUB book and structure it for learning purposes.

Please analyze the book and create:
1. A clear, descriptive name for the resource
2. A comprehensive description explaining what students will learn
3. Well-organized sections that break down the content into digestible chapters

For each section:
- Create a clear, engaging title
- Write substantial content that explains the key concepts (aim for 200-500 words)
- Include additional detailed content when relevant for deeper understanding
- Ensure sections are logically ordered

Focus on:
- Key concepts and principles
- Important facts and definitions
- Practical applications
- Examples and illustrations from the text

Structure the response as JSON with this exact format:
{
  "name": "Resource title",
  "description": "What students will learn from this resource",
  "sections": [
    {
      "title": "Section title",
      "content": "Main educational content",
      "more_content": "Additional detailed information (optional)",
      "position": 1
    }
  ]
}`;

interface EditResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const router = useRouter();
  const [resource, setResource] = useState<ResourceWithSections | null>(null);
  const [resourceId, setResourceId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResource = async () => {
      try {
        const { id } = await params;
        setResourceId(id);
        const response = await fetch(`/api/resources/${id}`);
        if (!response.ok) {
          setError("Resource not found");
          return;
        }
        const resourceData = await response.json();
        setResource(resourceData);
      } catch (err) {
        console.error("Failed to load resource:", err);
        setError("Failed to load resource");
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [params]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/epub+zip") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid EPUB file");
    }
  };

  const handleRegenerate = async () => {
    if (!file || !prompt.trim()) {
      setError("Please select an EPUB file and provide a prompt");
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("epub", file);
      formData.append("prompt", prompt);
      formData.append("resourceId", resourceId);

      const response = await fetch("/api/regenerate-resource", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate resource");
      }

      const regeneratedData = await response.json();

      // Update the resource with regenerated data
      setResource({
        ...resource,
        name: regeneratedData.name,
        description: regeneratedData.description,
        cover: "",
        sections: regeneratedData.sections.map(
          (section: ResourceSection, index: number) => ({
            ...section,
            id:
              resource?.sections[index]?.id ||
              (Math.random() * 1000).toString(),
            resource_id: resourceId,
            created_at: resource?.sections[index]?.created_at || new Date(),
            updated_at: new Date(),
          })
        ),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to regenerate resource"
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = async () => {
    if (!resource) return;

    setIsSaving(true);
    setError(null);

    try {
      const resourceToSave: GeneratedResource = {
        name: resource.name,
        description: resource.description,
        intro: "",
        short_description: "",
        sections: resource.sections.map((section: ResourceSection) => ({
          title: section.title,
          content: section.content,
          more_content: section.more_content,
          position: section.position,
        })),
      };

      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resourceToSave),
      });

      if (!response.ok) {
        throw new Error("Failed to save resource");
      }

      router.push(`/resources/${resourceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save resource");
    } finally {
      setIsSaving(false);
    }
  };

  const updateResourceField = (field: string, value: string) => {
    if (!resource) return;
    setResource({
      ...resource,
      [field]: value,
    });
  };

  const updateSectionField = (
    sectionIndex: number,
    field: string,
    value: string
  ) => {
    if (!resource) return;
    const updatedSections = [...resource.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value,
    };
    setResource({
      ...resource,
      sections: updatedSections,
    });
  };

  if (isLoading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Loading...</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p>Loading resource...</p>
        </div>
      </SidebarInset>
    );
  }

  if (error && !resource) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Error</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Link href={`/resources/${resourceId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {resource?.name}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Edit</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Regeneration Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Regenerate Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="epub-file">Upload New EPUB File</Label>
              <Input
                id="epub-file"
                type="file"
                accept=".epub"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
            <div>
              <Label htmlFor="prompt">Generation Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
                className="font-mono text-sm mt-1"
              />
            </div>
            <Button
              onClick={handleRegenerate}
              disabled={!file || !prompt.trim() || isRegenerating}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isRegenerating ? "Regenerating..." : "Regenerate Resource"}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Resource Editor */}
        {resource && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Resource</h2>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Resource Info */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="resource-name">Name</Label>
                  <Input
                    id="resource-name"
                    value={resource.name}
                    onChange={(e) =>
                      updateResourceField("name", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="resource-description">Description</Label>
                  <Textarea
                    id="resource-description"
                    value={resource.description}
                    onChange={(e) =>
                      updateResourceField("description", e.target.value)
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Sections ({resource.sections?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {resource.sections?.map(
                    (section: ResourceSection, index: number) => (
                      <div
                        key={section.id || index}
                        className="border rounded-lg p-4"
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`section-${index}-title`}>
                              Title
                            </Label>
                            <Input
                              id={`section-${index}-title`}
                              value={section.title}
                              onChange={(e) =>
                                updateSectionField(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`section-${index}-content`}>
                              Content
                            </Label>
                            <Textarea
                              id={`section-${index}-content`}
                              value={section.content}
                              onChange={(e) =>
                                updateSectionField(
                                  index,
                                  "content",
                                  e.target.value
                                )
                              }
                              rows={6}
                              className="mt-1"
                            />
                          </div>
                          {section.more_content && (
                            <div>
                              <Label htmlFor={`section-${index}-more-content`}>
                                Additional Content
                              </Label>
                              <Textarea
                                id={`section-${index}-more-content`}
                                value={section.more_content || ""}
                                onChange={(e) =>
                                  updateSectionField(
                                    index,
                                    "more_content",
                                    e.target.value
                                  )
                                }
                                rows={4}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) || (
                    <p className="text-muted-foreground text-center py-4">
                      No sections found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
