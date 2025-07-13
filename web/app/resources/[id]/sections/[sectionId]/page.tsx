import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getServices } from "@/lib/database";
import { Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { SectionCardsClient } from "./SectionCardsClient";

interface SectionPageProps {
  params: Promise<{
    id: string;
    sectionId: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { id, sectionId } = await params;
  const { db } = await getServices();
  const section = await db.resources.getResourceSectionById(sectionId);

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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {section.position}. {section.title}
              </CardTitle>
              <Link href={`/resources/${id}/sections/${sectionId}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Section
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className=" text-muted-foreground prose">
                <Markdown>{section.content}</Markdown>
              </div>
            </div>

            {section.more_content && (
              <div>
                <h4 className="font-medium text-lg mb-2">
                  Additional Content:
                </h4>
                <div className="text-muted-foreground prose">
                  <Markdown>{section.more_content}</Markdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <SectionCardsClient
          initialCards={section.cards}
          sectionId={sectionId}
          resourceId={id}
        />
      </div>
    </SidebarInset>
  );
}
