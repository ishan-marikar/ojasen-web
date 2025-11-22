"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit, Eye, Trash2, Key } from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Yatesh",
    email: "yatesh@ojasenhealingarts.com",
    role: "admin",
    status: "active",
    lastLogin: new Date("2025-11-22"),
    permissions: {
      bookings: true,
      facilitators: true,
      customers: true,
      financial: true,
      campaigns: true,
      permissions: true,
    },
  },
  {
    id: "2",
    name: "Oshadi",
    email: "oshadi@ojasenhealingarts.com",
    role: "facilitator",
    status: "active",
    lastLogin: new Date("2025-11-21"),
    permissions: {
      bookings: true,
      facilitators: false,
      customers: true,
      financial: false,
      campaigns: false,
      permissions: false,
    },
  },
  {
    id: "3",
    name: "Alice",
    email: "alice@ojasenhealingarts.com",
    role: "facilitator",
    status: "active",
    lastLogin: new Date("2025-11-20"),
    permissions: {
      bookings: true,
      facilitators: false,
      customers: true,
      financial: false,
      campaigns: false,
      permissions: false,
    },
  },
  {
    id: "4",
    name: "Deborah",
    email: "deborah@ojasenhealingarts.com",
    role: "facilitator",
    status: "inactive",
    lastLogin: new Date("2025-11-15"),
    permissions: {
      bookings: false,
      facilitators: false,
      customers: false,
      financial: false,
      campaigns: false,
      permissions: false,
    },
  },
];

// Permission categories
const permissionCategories = [
  { id: "bookings", name: "Bookings Management" },
  { id: "facilitators", name: "Facilitators Management" },
  { id: "customers", name: "Customer Management" },
  { id: "financial", name: "Financial Reports" },
  { id: "campaigns", name: "Campaign Management" },
  { id: "permissions", name: "User Permissions" },
];

export default function UserPermissionsPage() {
  const [users, setUsers] = useState(mockUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handle adding a new user
  const handleAddUser = (newUser: any) => {
    const user = {
      ...newUser,
      id: (users.length + 1).toString(),
      lastLogin: new Date(),
      permissions: {
        bookings: false,
        facilitators: false,
        customers: false,
        financial: false,
        campaigns: false,
        permissions: false,
      },
    };
    setUsers([user, ...users]);
    setIsAddModalOpen(false);
  };

  // Handle editing a user
  const handleEditUser = (updatedUser: any) => {
    setUsers(
      users.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Handle deleting a user
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Toggle user status
  const toggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  // Update user permissions
  const updateUserPermissions = (
    userId: string,
    permissionId: string,
    value: boolean
  ) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [permissionId]: value,
            },
          };
        }
        return user;
      })
    );
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Permissions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage user roles and access permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {users.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {users.filter((u) => u.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {users.filter((u) => u.role === "admin").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="facilitator">Facilitator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <CredenzaTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <AddUserForm
                  onSubmit={handleAddUser}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </CredenzaContent>
            </Credenza>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.permissions)
                        .filter(([key, value]) => value)
                        .map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="outline"
                            className="text-xs"
                          >
                            {key}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, user.status)}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Permissions Modal */}
      <Credenza open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <CredenzaContent>
          {editingUser && (
            <EditPermissionsForm
              user={editingUser}
              onUpdate={handleEditUser}
              onCancel={() => setIsEditModalOpen(false)}
              onUpdatePermissions={updateUserPermissions}
            />
          )}
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

// Add User Form Component
function AddUserForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "facilitator",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      email: "",
      role: "facilitator",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New User</CredenzaTitle>
        <CredenzaDescription>Create a new user account</CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="facilitator">Facilitator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CredenzaBody>
      <CredenzaFooter>
        <CredenzaClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CredenzaClose>
        <Button type="submit" onClick={handleSubmit}>
          Add User
        </Button>
      </CredenzaFooter>
    </>
  );
}

// Edit Permissions Form Component
function EditPermissionsForm({
  user,
  onUpdate,
  onCancel,
  onUpdatePermissions,
}: {
  user: any;
  onUpdate: (data: any) => void;
  onCancel: () => void;
  onUpdatePermissions: (
    userId: string,
    permissionId: string,
    value: boolean
  ) => void;
}) {
  const [editedUser, setEditedUser] = useState(user);

  const handlePermissionChange = (permissionId: string, value: boolean) => {
    onUpdatePermissions(user.id, permissionId, value);
    setEditedUser({
      ...editedUser,
      permissions: {
        ...editedUser.permissions,
        [permissionId]: value,
      },
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Edit Permissions</CredenzaTitle>
        <CredenzaDescription>
          Manage permissions for {user.name}
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
            <Badge className="mt-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Permissions
            </h4>
            {permissionCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <Label
                  htmlFor={`permission-${category.id}`}
                  className="font-normal"
                >
                  {category.name}
                </Label>
                <Switch
                  id={`permission-${category.id}`}
                  checked={
                    editedUser.permissions[
                      category.id as keyof typeof editedUser.permissions
                    ]
                  }
                  onCheckedChange={(value) =>
                    handlePermissionChange(category.id, value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </CredenzaBody>
      <CredenzaFooter>
        <CredenzaClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </CredenzaClose>
      </CredenzaFooter>
    </>
  );
}
