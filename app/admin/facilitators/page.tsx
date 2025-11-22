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

// Mock data for facilitators
const mockFacilitators = [
  {
    id: "1",
    name: "Oshadi",
    role: "Sound Healer",
    email: "oshadi@ojasen.com",
    baseFee: 2500,
    commission: 0.15,
    assignedBookings: 24,
    status: "active",
  },
  {
    id: "2",
    name: "Alice",
    role: "Yoga Instructor",
    email: "alice@ojasen.com",
    baseFee: 3000,
    commission: 0.2,
    assignedBookings: 18,
    status: "active",
  },
  {
    id: "3",
    name: "Deborah",
    role: "Energy Healer",
    email: "deborah@ojasen.com",
    baseFee: 2800,
    commission: 0.18,
    assignedBookings: 22,
    status: "inactive",
  },
];

export default function FacilitatorsManagementPage() {
  const [facilitators, setFacilitators] = useState(mockFacilitators);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFacilitator, setEditingFacilitator] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
  const handleAddFacilitator = (newFacilitator: any) => {
    const facilitator = {
      ...newFacilitator,
      id: (facilitators.length + 1).toString(),
      assignedBookings: 0,
      baseFee: parseInt(newFacilitator.baseFee),
      commission: parseFloat(newFacilitator.commission),
    };
    setFacilitators([facilitator, ...facilitators]);
    setIsAddModalOpen(false);
  };

  // Handle editing a facilitator
  const handleEditFacilitator = (updatedFacilitator: any) => {
    setFacilitators(
      facilitators.map((facilitator) =>
        facilitator.id === updatedFacilitator.id
          ? { ...facilitator, ...updatedFacilitator }
          : facilitator
      )
    );
    setIsEditModalOpen(false);
    setEditingFacilitator(null);
  };

  // Handle deleting a facilitator
  const handleDeleteFacilitator = (id: string) => {
    setFacilitators(
      facilitators.filter((facilitator) => facilitator.id !== id)
    );
  };

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
                      {facilitator.status.charAt(0).toUpperCase() +
                        facilitator.status.slice(1)}
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
