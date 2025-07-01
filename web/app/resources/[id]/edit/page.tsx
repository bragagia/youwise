"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { getResourceById, updateResource } from "@/lib/db/resources";
import type { GeneratedResource } from "@/lib/schemas";
import { ResourceSection, ResourceWithSections } from "@/types/resources";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const router = useRouter();
  const [resource, setResource] = useState<ResourceWithSections | null>(null);
  const [resourceId, setResourceId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResource = async () => {
      try {
        const { id } = await params;

        setResourceId(id);

        const resource = await getResourceById(id);
        if (!resource) {
          setError("Resource not found");
          return;
        }

        setResource(resource);
      } catch (err) {
        console.error("Failed to load resource:", err);
        setError("Failed to load resource");
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [params]);

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

      const updatedResource = await updateResource(resourceId, resourceToSave);

      if (!updatedResource) {
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
