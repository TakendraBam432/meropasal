
import { memo } from 'react';
import { UserManagementCard } from "./users";

const UserManagement = memo(() => {
  return <UserManagementCard />;
});

UserManagement.displayName = "UserManagement";

export default UserManagement;
