import { CardsPreviewClient } from "@/app/resources/[id]/sections/[sectionId]/cards/preview/CardsPreviewClient";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getServices } from "@/lib/database";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CardsPreviewPageProps {
  params: Promise<{
    id: string;
    sectionId: string;
  }>;
}

export default async function CardsPreviewPage({
  params,
}: CardsPreviewPageProps) {
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
        <Link href={`/resources/${id}/sections/${sectionId}`}>
          <Button variant="ghost" size="sm">
            {section.title}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-sm font-semibold">Cards Preview</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <CardsPreviewClient resourceId={id} sectionId={sectionId} />
      </div>
    </SidebarInset>
  );
}
