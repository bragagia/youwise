import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getResourceSectionById } from "@/lib/db/resources";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

// Types for card variants
type CardVariant = ClassicCardVariant | TextCardVariant;

type ClassicCardVariant = {
  type: "classic";
  question: string;
  answer: string;
  fakeAnswers?: string[];
};

type TextCardVariant = {
  type: "text";
  title: string;
  text: Array<{
    id: string;
    part: string;
  }>;
};

interface SectionPageProps {
  params: Promise<{
    id: string;
    sectionId: string;
  }>;
}

function ClassicCardDisplay({ variant }: { variant: ClassicCardVariant }) {
  return (
    <div className="space-y-3">
      <div>
        <h5 className="font-medium text-sm text-blue-600">Question:</h5>
        <p className="text-sm">{variant.question}</p>
      </div>
      <div>
        <h5 className="font-medium text-sm text-green-600">Answer:</h5>
        <p className="text-sm">{variant.answer}</p>
      </div>
      {variant.fakeAnswers && variant.fakeAnswers.length > 0 && (
        <div>
          <h5 className="font-medium text-sm text-orange-600">Fake Answers:</h5>
          <div className="flex flex-wrap gap-1 mt-1">
            {variant.fakeAnswers.map((fake, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {fake}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TextCardDisplay({ variant }: { variant: TextCardVariant }) {
  return (
    <div className="space-y-3">
      <div>
        <h5 className="font-medium text-sm text-purple-600">Title:</h5>
        <p className="text-sm">{variant.title}</p>
      </div>
      <div>
        <h5 className="font-medium text-sm text-purple-600">Text Parts:</h5>
        <div className="space-y-2 mt-1">
          {variant.text.map((part, index) => (
            <div key={index} className="flex items-start gap-2">
              <Badge variant="secondary" className="text-xs min-w-fit">
                {index + 1}
              </Badge>
              <p className="text-sm">{part.part}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { id, sectionId } = await params;
  const section = await getResourceSectionById(sectionId);

  if (!section) {
    notFound();
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
        <Link href={`/resources/${id}`}>
          <Button variant="ghost" size="sm">
            {section.resource?.name}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-sm font-semibold">{section.title}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Section Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">Position {section.position}</Badge>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className=" text-muted-foreground prose">
                <Markdown>{section.content}</Markdown>
              </div>
            </div>
            {section.more_content && (
              <div>
                <h4 className="font-medium text-xl mb-2">
                  Additional Content:
                </h4>
                <div className="text-muted-foreground prose">
                  <Markdown>{section.more_content}</Markdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards ({section.cards?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {section.cards && section.cards.length > 0 ? (
              <div className="space-y-6">
                {section.cards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Card #{card.id}</h4>
                      <p className="text-xs text-muted-foreground">
                        Created: {card.created_at.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {(card.variants as CardVariant[]).map(
                        (variant, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  variant.type === "classic"
                                    ? "default"
                                    : "secondary"
                                }
                                className="capitalize"
                              >
                                {variant.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Variant {index + 1}
                              </span>
                            </div>
                            {variant.type === "classic" ? (
                              <ClassicCardDisplay variant={variant} />
                            ) : (
                              <TextCardDisplay variant={variant} />
                            )}
                            {index <
                              (card.variants as CardVariant[]).length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No cards found for this section
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
