import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual database queries
const mockUsers = [
  {
    id: "1",
    given_name: "John",
    family_name: "Doe",
    email: "john.doe@example.com",
    google_uid: "google_123",
    apple_uid: null,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: "2",
    given_name: "Jane",
    family_name: "Smith",
    email: "jane.smith@example.com",
    google_uid: null,
    apple_uid: "apple_456",
    created_at: new Date("2024-02-10"),
    updated_at: new Date("2024-02-10"),
  },
]

export default function UsersPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Users</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Auth Provider</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.given_name} {user.family_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.google_uid && <Badge variant="outline">Google</Badge>}
                      {user.apple_uid && <Badge variant="outline">Apple</Badge>}
                    </TableCell>
                    <TableCell>{user.created_at.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
