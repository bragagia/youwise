import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getResourceById } from "@/lib/db/resources";
import { ArrowLeft, ChevronRight, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { id } = await params;
  const resource = await getResourceById(id);

  if (!resource) {
    notFound();
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Link href="/resources">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Resources
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-xl font-semibold">{resource.name}</h1>
        </div>
        <Link href={`/resources/${id}/edit`}>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Resource
          </Button>
        </Link>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Resource Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Image
                src={resource.cover || "/placeholder.svg"}
                alt={resource.name}
                width={150}
                height={200}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {resource.name}
                  <Badge variant="secondary">Tint {resource.tint}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Created: {resource.created_at.toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Sections List */}
        <Card>
          <CardHeader>
            <CardTitle>Sections ({resource.sections?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resource.sections?.map((section) => (
                <Link
                  key={section.id}
                  href={`/resources/${id}/sections/${section.id}`}
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{section.position}</Badge>
                      <div>
                        <h4 className="font-medium">{section.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {section.content.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No sections found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
