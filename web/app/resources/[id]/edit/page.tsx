"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getResourceByIdAction, updateResourceAction } from "./actions";

interface EditResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Resource {
  id: string;
  name: string;
  description: string;
  intro: string;
  short_description: string;
  cover: string;
  tint: number;
  created_at: Date;
  updated_at: Date;
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [resourceId, setResourceId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadResource = async () => {
      try {
        const { id } = await params;
        setResourceId(id);

        const resourceData = await getResourceByIdAction(id);
        if (!resourceData.success) {
          setError("Resource not found: " + resourceData.error);
          return;
        }

        setResource(resourceData.resource);
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

    const result = await updateResourceAction(resourceId, resource);

    if (result.success) {
      router.push(`/resources/${resourceId}`);
    } else {
      setError(result.error || "Failed to save resource");
    }

    setIsSaving(false);
  };

  const updateResourceField = (field: string, value: string | number) => {
    if (!resource) return;
    setResource({
      ...resource,
      [field]: value,
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
        <Link href="/resources">
          <Button variant="ghost" size="sm">
            Resources
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/resources/${resourceId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {resource?.name}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-sm font-semibold">Edit</h1>
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
                type="submit"
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Resource Information */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={resource.name}
                    onChange={(e) =>
                      updateResourceField("name", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    name="short_description"
                    value={resource.short_description}
                    onChange={(e) =>
                      updateResourceField("short_description", e.target.value)
                    }
                    className="mt-1"
                    placeholder="A concise one-sentence hook for lists and previews"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="intro">Introduction</Label>
                  <Textarea
                    id="intro"
                    name="intro"
                    value={resource.intro}
                    onChange={(e) =>
                      updateResourceField("intro", e.target.value)
                    }
                    rows={3}
                    className="mt-1"
                    placeholder="Prepare the reader for the content structure and approach"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={resource.description}
                    onChange={(e) =>
                      updateResourceField("description", e.target.value)
                    }
                    rows={4}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cover">Cover Image URL (Optional)</Label>
                  <Input
                    id="cover"
                    name="cover"
                    type="url"
                    value={resource.cover}
                    onChange={(e) =>
                      updateResourceField("cover", e.target.value)
                    }
                    className="mt-1"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="tint">Color Tint (1-10)</Label>
                  <Input
                    id="tint"
                    name="tint"
                    type="number"
                    min="1"
                    max="10"
                    value={resource.tint}
                    onChange={(e) =>
                      updateResourceField("tint", parseInt(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
