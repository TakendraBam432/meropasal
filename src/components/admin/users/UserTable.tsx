
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { UserData } from "./types";

interface UserTableProps {
  users: UserData[];
  loadingUsers: boolean;
  processingUserId: string | null;
  onMakeAdmin: (userId: string) => Promise<void>;
  onMakeSuperAdmin: (userId: string) => Promise<void>;
}

export const UserTable = ({
  users,
  loadingUsers,
  processingUserId,
  onMakeAdmin,
  onMakeSuperAdmin,
}: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">User ID</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Admin</th>
            <th className="text-left py-2">Super Admin</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingUsers ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <div className="flex justify-center">
                  <Loading size="sm" />
                </div>
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-2 truncate max-w-[150px]">{user.id}</td>
                <td className="py-2">{user.full_name || 'N/A'}</td>
                <td className="py-2">{user.is_admin ? 'Yes' : 'No'}</td>
                <td className="py-2">{user.is_super_admin ? 'Yes' : 'No'}</td>
                <td className="py-2 text-right">
                  <div className="flex justify-end gap-2">
                    {!user.is_admin && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onMakeAdmin(user.id)}
                        disabled={processingUserId === user.id}
                      >
                        {processingUserId === user.id ? (
                          <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        ) : null}
                        Make Admin
                      </Button>
                    )}
                    {user.is_admin && !user.is_super_admin && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onMakeSuperAdmin(user.id)}
                        disabled={processingUserId === user.id}
                      >
                        {processingUserId === user.id ? (
                          <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        ) : null}
                        Make Super Admin
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
