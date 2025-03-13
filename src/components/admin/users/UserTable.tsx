
import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UserData } from "./types";
import { Trash2 } from "lucide-react";

interface UserTableProps {
  users: UserData[];
  onToggleAdmin: (userId: string, value: boolean) => void;
  onToggleSuperAdmin: (userId: string, value: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable = memo(({
  users,
  onToggleAdmin,
  onToggleSuperAdmin,
  onDeleteUser,
}: UserTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Super Admin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.full_name || "N/A"}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.is_admin}
                    onCheckedChange={(checked) => onToggleAdmin(user.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.is_super_admin}
                    onCheckedChange={(checked) => onToggleSuperAdmin(user.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

UserTable.displayName = "UserTable";
