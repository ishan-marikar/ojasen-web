"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Eye, Trash2 } from "lucide-react";

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function FacilitatorsManagementPage() {
  const [facilitators, setFacilitators] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFacilitator, setEditingFacilitator] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch facilitators
        const facilitatorsResponse = await fetch("/api/admin/facilitators");
        const facilitatorsData = await facilitatorsResponse.json();

        if (facilitatorsData.success) {
          setFacilitators(facilitatorsData.facilitators);
        } else {
          throw new Error(
            facilitatorsData.error || "Failed to fetch facilitators"
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter facilitators based on search term and status
  const filteredFacilitators = facilitators.filter((facilitator) => {
    const matchesSearch =
      facilitator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilitator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilitator.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || facilitator.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle adding a new facilitator
  const handleAddFacilitator = async (newFacilitator: any) => {
    try {
      const response = await fetch("/api/admin/facilitators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newFacilitator,
          baseFee: parseFloat(newFacilitator.baseFee),
          commission: parseFloat(newFacilitator.commission),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refetch facilitators to get the updated list
        const facilitatorsResponse = await fetch("/api/admin/facilitators");
        const facilitatorsData = await facilitatorsResponse.json();

        if (facilitatorsData.success) {
          setFacilitators(facilitatorsData.facilitators);
        }

        setIsAddModalOpen(false);
      } else {
        console.error("Failed to create facilitator:", result.error);
      }
    } catch (error) {
      console.error("Error creating facilitator:", error);
    }
  };

  // Handle editing a facilitator
  const handleEditFacilitator = async (updatedFacilitator: any) => {
    try {
      const response = await fetch("/api/admin/facilitators", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFacilitator),
      });

      const result = await response.json();

      if (result.success) {
        // Refetch facilitators to get the updated list
        const facilitatorsResponse = await fetch("/api/admin/facilitators");
        const facilitatorsData = await facilitatorsResponse.json();

        if (facilitatorsData.success) {
          setFacilitators(facilitatorsData.facilitators);
        }

        setIsEditModalOpen(false);
        setEditingFacilitator(null);
      } else {
        console.error("Failed to update facilitator:", result.error);
      }
    } catch (error) {
      console.error("Error updating facilitator:", error);
    }
  };

  // Handle deleting a facilitator
  const handleDeleteFacilitator = async (id: string) => {
    try {
      const response = await fetch("/api/admin/facilitators", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        // Refetch facilitators to get the updated list
        const facilitatorsResponse = await fetch("/api/admin/facilitators");
        const facilitatorsData = await facilitatorsResponse.json();

        if (facilitatorsData.success) {
          setFacilitators(facilitatorsData.facilitators);
        }
      } else {
        console.error("Failed to delete facilitator:", result.error);
      }
    } catch (error) {
      console.error("Error deleting facilitator:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading facilitators...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Facilitators Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage facilitators and their details
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search facilitators..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <CredenzaTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Facilitator
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <AddFacilitatorForm
                  onSubmit={handleAddFacilitator}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </CredenzaContent>
            </Credenza>
            <Credenza open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <CredenzaContent>
                {editingFacilitator && (
                  <EditFacilitatorForm
                    facilitator={editingFacilitator}
                    onSubmit={handleEditFacilitator}
                    onCancel={() => {
                      setIsEditModalOpen(false);
                      setEditingFacilitator(null);
                    }}
                  />
                )}
              </CredenzaContent>
            </Credenza>
          </div>
        </CardHeader>
      </Card>

      {/* Facilitators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facilitators</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Base Fee</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilitators.map((facilitator) => (
                <TableRow key={facilitator.id}>
                  <TableCell className="font-medium">
                    {facilitator.name}
                  </TableCell>
                  <TableCell>{facilitator.role}</TableCell>
                  <TableCell>{facilitator.email}</TableCell>
                  <TableCell>{formatCurrency(facilitator.baseFee)}</TableCell>
                  <TableCell>
                    {(facilitator.commission * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell>{facilitator.assignedBookings}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        facilitator.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {facilitator!.status!.charAt(0).toUpperCase() +
                        facilitator!.status!.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingFacilitator(facilitator);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFacilitator(facilitator.id)}
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
    </div>
  );
}

// Edit Facilitator Form Component
function EditFacilitatorForm({
  facilitator,
  onSubmit,
  onCancel,
}: {
  facilitator: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    id: facilitator.id,
    name: facilitator.name || "",
    role: facilitator.role || "",
    email: facilitator.email || "",
    baseFee: facilitator.baseFee?.toString() || "",
    commission: (facilitator.commission * 100).toString() || "",
    status: facilitator.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      baseFee: parseFloat(formData.baseFee),
      commission: parseFloat(formData.commission) / 100,
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Edit Facilitator</CredenzaTitle>
        <CredenzaDescription>Update facilitator details</CredenzaDescription>
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
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, role: e.target.value })
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseFee">Base Fee (LKR)</Label>
              <Input
                id="baseFee"
                type="number"
                min="0"
                value={formData.baseFee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, baseFee: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commission}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, commission: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
          Update Facilitator
        </Button>
      </CredenzaFooter>
    </>
  );
}

// Add Facilitator Form Component
function AddFacilitatorForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    baseFee: "",
    commission: "",
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      role: "",
      email: "",
      baseFee: "",
      commission: "",
      status: "active",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New Facilitator</CredenzaTitle>
        <CredenzaDescription>
          Create a new facilitator profile
        </CredenzaDescription>
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
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, role: e.target.value })
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseFee">Base Fee (LKR)</Label>
              <Input
                id="baseFee"
                type="number"
                min="0"
                value={formData.baseFee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, baseFee: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commission}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, commission: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
          Add Facilitator
        </Button>
      </CredenzaFooter>
    </>
  );
}
