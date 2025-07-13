"use client";

import { UnifiedCardList } from "@/components/cards/unified-card-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { CardModelUnsaved, CardVariant } from "@youwise/shared";
import { Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createCardAction,
  getResourceSectionByIdAction,
  redirectToSection,
  updateCardAction,
  updateSectionAction,
} from "./actions";

interface SectionEditPageProps {
  params: Promise<{
    id: string;
    sectionId: string;
  }>;
}

interface SectionWithDetails {
  id: string;
  resource_id: string;
  title: string;
  content: string;
  more_content: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
  resource?: {
    id: string;
    name: string;
    description: string;
    cover: string;
    tint: number;
  } | null;
  cards?: Array<{
    id: string;
    resource_section_id: string;
    variants: unknown;
    created_at: Date;
    updated_at: Date;
  }> | null;
}

export default function SectionEditPage({ params }: SectionEditPageProps) {
  const [section, setSection] = useState<SectionWithDetails | null>(null);
  const [resourceId, setResourceId] = useState<string>("");
  const [sectionId, setSectionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<
    Array<{
      id: string;
      variants: CardVariant[];
      level: "core_concept" | "knowledge" | "example";
    }>
  >([]);

  useEffect(() => {
    const loadSection = async () => {
      try {
        const { id, sectionId: sId } = await params;
        setResourceId(id);
        setSectionId(sId);

        const sectionData = await getResourceSectionByIdAction(sId);
        if (!sectionData.success) {
          setError("Section not found");
          return;
        }

        setSection(sectionData.section);

        setCards(sectionData.section.cards);
      } catch (err) {
        console.error("Failed to load section:", err);
        setError("Failed to load section");
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [params]);

  const handleSave = async (formData: FormData) => {
    if (!section) return;

    setIsSaving(true);
    setError(null);

    try {
      // Save section data
      const result = await updateSectionAction(resourceId, sectionId, formData);

      if (!result.success) {
        setError(result.error || "Failed to save section");
        return;
      }

      // Save all card changes
      await saveAllCardChanges();

      // Redirect on success
      await redirectToSection(resourceId, sectionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionField = (field: string, value: string | number) => {
    if (!section) return;
    setSection({
      ...section,
      [field]: value,
    });
  };

  // Card management functions - local state only, save on form submit
  const handleCardsUpdate = (
    updatedCards: Array<{
      id?: string;
      variants: CardVariant[];
      level: "core_concept" | "knowledge" | "example";
    }>
  ) => {
    // Just update local state - actual database updates happen on form save
    const newCards = updatedCards.map((updatedCard, index) => ({
      id: cards[index]?.id || `temp-${Date.now()}-${index}`, // Use existing ID or temp ID for new cards
      variants: updatedCard.variants,
      level: updatedCard.level,
    }));
    setCards(newCards);
  };

  // Save all card changes when form is saved
  const saveAllCardChanges = async () => {
    try {
      const processedCards = [];

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        if (card.id.startsWith("temp-")) {
          // New card - create it
          const newCardData: CardModelUnsaved = {
            variants: card.variants,
            level: card.level,
          };
          const result = await createCardAction(sectionId, newCardData);

          if (result.success && result.card) {
            processedCards.push({
              id: result.card.id,
              variants: card.variants,
              level: card.level,
            });
          } else {
            throw new Error(result.error || "Failed to create card");
          }
        } else {
          // Existing card - update it
          const updateCardData: CardModelUnsaved = {
            variants: card.variants,
            level: card.level,
          };
          const result = await updateCardAction(card.id, updateCardData);

          if (result.success) {
            processedCards.push(card);
          } else {
            throw new Error(result.error || "Failed to update card");
          }
        }
      }

      setCards(processedCards);
    } catch (error) {
      throw error; // Re-throw to be handled by form save
    }
  };

  if (isLoading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Loading...</h1>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p>Loading section...</p>
        </div>
      </SidebarInset>
    );
  }

  if (error && !section) {
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
          <Button variant="ghost" size="sm">
            {section?.resource?.name}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/resources/${resourceId}/sections/${sectionId}`}>
          <Button variant="ghost" size="sm">
            {section?.title}
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

        {/* Section Editor */}
        {section && (
          <form action={handleSave} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Section</h2>
              <Button type="submit" disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Section Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Position {section.position}</Badge>
                  Section Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={section.title}
                    onChange={(e) =>
                      updateSectionField("title", e.target.value)
                    }
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    min="1"
                    value={section.position}
                    onChange={(e) =>
                      updateSectionField("position", parseInt(e.target.value))
                    }
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={section.content}
                    onChange={(e) =>
                      updateSectionField("content", e.target.value)
                    }
                    rows={8}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="more_content">
                    Additional Content (Optional)
                  </Label>
                  <Textarea
                    id="more_content"
                    name="more_content"
                    value={section.more_content || ""}
                    onChange={(e) =>
                      updateSectionField("more_content", e.target.value)
                    }
                    rows={6}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cards Section */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Cards ({cards.length})</h2>
            </div>

            <UnifiedCardList
              cards={cards.map((card) => ({
                variants: card.variants,
                level: card.level,
              }))}
              mode="edit"
              onCardsUpdate={handleCardsUpdate}
              emptyMessage="No cards found for this section"
            />
          </form>
        )}
      </div>
    </SidebarInset>
  );
}
