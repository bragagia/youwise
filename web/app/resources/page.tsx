import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getServices } from "@/lib/database";
import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ResourcesPage() {
  const { db } = await getServices();
  const resources = await db.resources.getResources();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Resources</h1>
        </div>
        <Link href="/resources/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Resource
          </Button>
        </Link>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Link key={resource.id} href={`/resources/${resource.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <Image
                        src={resource.cover || "/placeholder.svg"}
                        alt={""}
                        width={150}
                        height={200}
                        className="w-16 h-20 object-cover rounded"
                      />

                      <div className="flex-1 space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {resource.name}
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                          {resource.short_description}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {resource.created_at.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SidebarInset>
  );
}
