import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getServices } from "@/lib/database";
import { ArrowLeft, ChevronRight, Edit, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { publishResource, unpublishResource } from "./actions";

interface ResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { id } = await params;
  const { db } = await getServices();
  const resource = await db.resources.getResourceById(id);

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
        <div className="flex gap-2">
          <Button
            onClick={
              resource.published_at
                ? unpublishResource.bind(null, id)
                : publishResource.bind(null, id)
            }
            type="submit"
            variant="outline"
            className="gap-2"
          >
            {resource.published_at ? (
              <>
                <EyeOff className="h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>Publish</>
            )}
          </Button>

          <Link href={`/resources/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Resource
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Resource Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Image
                src={resource.cover || "/placeholder.svg"}
                alt={""}
                width={150}
                height={200}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {resource.name}
                  <Badge
                    variant={resource.published_at ? "destructive" : "default"}
                  >
                    {resource.published_at ? "Published" : "Unpublished"}
                  </Badge>
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium text-gray-700">
                    Short description:{" "}
                  </span>
                  {resource.short_description}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium text-gray-700">
                    Full description:{" "}
                  </span>
                  {resource.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Created: {resource.created_at.toLocaleDateString()}
                  {resource.published_at && (
                    <span className="ml-4">
                      Published: {resource.published_at.toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm">
            <Markdown>{resource.intro}</Markdown>
          </CardContent>
        </Card>

        {/* Sections List */}
        <Card>
          <CardHeader>
            <CardTitle>Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {resource.sections.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No sections
                </p>
              )}

              {resource.sections.map((section) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
