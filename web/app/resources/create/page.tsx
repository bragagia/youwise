"use client";

import type React from "react";

import {
  generateResourceAction,
  saveResourceAction,
} from "@/app/resources/create/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import type { GeneratedResource } from "@/lib/schemas";
import { ArrowLeft, Save, Upload, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEFAULT_PROMPT = `Extract educational content from this EPUB book and structure it for learning purposes.

You must output each field in markdown format. With nicely formatted paragraphs. The only non-markdown fields are the title of the book, title of sections, and the short_description.

## Sections
Each output section content should be a lengthy summary of the book section it is based on. By reading that section content, the user should be able to learn everything there is to know about the original book section. Keep the original writing style if possible. Also try to bring the knowledge using the same method as the original author did.

Each section should be approximately 500-1000 words long, but you can absolutely adjust this based on the content of the book, do not shorten the content just to fit this range, and certainly don't make it longer than necessary.

You don't have to map each book section or chapter to a section here, especially if there is filler or empty sections.

The position field should start from 1 and increment for each new section.

## Additional fields
### Intro
Once you have extracted the content, write an intro for the book, which should prepare the reader for the content they are about to read. Explain the book structure, how they should approach it, and what they can expect to learn. Make the expectations clear and engaging.

### Description
After that, write a description of the book, this is what reader will see when they will have to decide whether to read the book or not. Make it engaging, concise, and informative. The expectations of what the book will change in the reader's life/knowledge should be clear.

### Short Description
Finally, write a short description of the book, which should be a one-sentence hook. This will be used in lists and previews, so it should be concise and to the point. Reading the sentence should make the reader desperately willing to read the book.`;

export default function CreateResourcePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [resource, setResource] = useState<GeneratedResource | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError(null);
    } else {
      setError("Please select a valid .epub file");
    }
  };

  const generate = async () => {
    if (!file) {
      setError("Upload an EPUB file first");
      return;
    }
    setIsGenerating(true);
    setError(null);

    const fd = new FormData();
    fd.append("epub", file);
    fd.append("prompt", prompt);

    try {
      const result = await generateResourceAction(fd);
      if (!result.success) {
        throw new Error(result.error || "LLM generation failed");
      }
      setResource(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const save = async () => {
    if (!resource) return;
    setIsSaving(true);
    try {
      const result = await saveResourceAction(resource);
      if (!result.success) {
        throw new Error(result.error || "Failed to save resource");
      }

      router.push(`/resources/${result.createdResource.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const editResField = (k: keyof GeneratedResource, v: string) =>
    resource && setResource({ ...resource, [k]: v });

  const editSectionField = (idx: number, k: string, v: string) =>
    resource &&
    setResource({
      ...resource,
      sections: resource.sections.map((s, i) =>
        i === idx ? { ...s, [k]: v } : s
      ),
    });

  /* UI ------------------------------------------------------------------- */
  return (
    <SidebarInset>
      {/* header */}
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Link href="/resources">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Resources
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Create Resource</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> EPUB Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>
              <Input type="file" onChange={handleFileChange} />
            </Label>
            {file && (
              <p className="text-sm text-muted-foreground mt-2">
                {file.name} – {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </CardContent>
        </Card>

        {/* prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={12}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* generate button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!file || isGenerating}
            onClick={generate}
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {isGenerating ? "Generating…" : "Generate Resource"}
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* preview */}
        {resource && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Preview</h2>
              <Button onClick={save} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>

            {/* resource meta */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={resource.name}
                    onChange={(e) => editResField("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Short Description</Label>
                  <Input
                    value={resource.short_description}
                    onChange={(e) => editResField("short_description", e.target.value)}
                    placeholder="A concise one-sentence hook for lists and previews"
                  />
                </div>
                <div>
                  <Label>Introduction</Label>
                  <Textarea
                    rows={3}
                    value={resource.intro}
                    onChange={(e) =>
                      editResField("intro", e.target.value)
                    }
                    placeholder="Prepare the reader for the content structure and approach"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={resource.description}
                    onChange={(e) =>
                      editResField("description", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* sections */}
            <Card>
              <CardHeader>
                <CardTitle>Sections ({resource.sections.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resource.sections.map((s, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={s.title}
                        onChange={(e) =>
                          editSectionField(i, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        rows={6}
                        value={s.content}
                        onChange={(e) =>
                          editSectionField(i, "content", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Additional Content (optional)</Label>
                      <Textarea
                        rows={4}
                        value={s.more_content || ""}
                        onChange={(e) =>
                          editSectionField(i, "more_content", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </SidebarInset>
  );
}
