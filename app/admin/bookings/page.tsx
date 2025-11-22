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

// Mock data for bookings
const mockBookings = [
  {
    id: "1",
    eventName: "Panchali Sadhana",
    customerName: "John Doe",
    eventDate: new Date("2025-11-29"),
    numberOfPeople: 2,
    totalPrice: 8000,
    status: "confirmed",
    facilitator: "Oshadi",
  },
  {
    id: "2",
    eventName: "Anahata Flow",
    customerName: "Jane Smith",
    eventDate: new Date("2025-11-22"),
    numberOfPeople: 1,
    totalPrice: 3500,
    status: "pending",
    facilitator: "Alice",
  },
  {
    id: "3",
    eventName: "Sound Healing",
    customerName: "Robert Johnson",
    eventDate: new Date("2025-12-15"),
    numberOfPeople: 3,
    totalPrice: 10500,
    status: "confirmed",
    facilitator: "Deborah",
  },
  {
    id: "4",
    eventName: "Ice Bath & Breathwork",
    customerName: "Emily Wilson",
    eventDate: new Date("2025-12-05"),
    numberOfPeople: 1,
    totalPrice: 4200,
    status: "cancelled",
    facilitator: "Oshadi",
  },
  {
    id: "5",
    eventName: "Energy Healing Session",
    customerName: "Michael Brown",
    eventDate: new Date("2025-11-30"),
    numberOfPeople: 2,
    totalPrice: 7000,
    status: "confirmed",
    facilitator: "Deborah",
  },
];

// Mock facilitators data
const mockFacilitators = [
  { id: "1", name: "Oshadi" },
  { id: "2", name: "Alice" },
  { id: "3", name: "Deborah" },
];

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.facilitator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle adding a new booking
  const handleAddBooking = (newBooking: any) => {
    const booking = {
      ...newBooking,
      id: (bookings.length + 1).toString(),
      totalPrice:
        parseInt(newBooking.pricePerPerson) *
        parseInt(newBooking.numberOfPeople),
    };
    setBookings([booking, ...bookings]);
    setIsAddModalOpen(false);
  };

  // Handle editing a booking
  const handleEditBooking = (updatedBooking: any) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === updatedBooking.id
          ? { ...booking, ...updatedBooking }
          : booking
      )
    );
    setIsEditModalOpen(false);
    setEditingBooking(null);
  };

  // Handle deleting a booking
  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookings Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all bookings and reservations
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
                  placeholder="Search bookings..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <CredenzaTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Booking
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <AddBookingForm
                  facilitators={mockFacilitators}
                  onSubmit={handleAddBooking}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </CredenzaContent>
            </Credenza>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Facilitator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.eventName}
                  </TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>
                    {booking.eventDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.numberOfPeople}</TableCell>
                  <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                  <TableCell>{booking.facilitator}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
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
                          setEditingBooking(booking);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBooking(booking.id)}
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

// Add Booking Form Component
function AddBookingForm({
  facilitators,
  onSubmit,
  onCancel,
}: {
  facilitators: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    eventName: "",
    customerName: "",
    eventDate: "",
    numberOfPeople: "1",
    pricePerPerson: "",
    facilitator: "",
    status: "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      eventName: "",
      customerName: "",
      eventDate: "",
      numberOfPeople: "1",
      pricePerPerson: "",
      facilitator: "",
      status: "pending",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New Booking</CredenzaTitle>
        <CredenzaDescription>
          Create a new booking for a customer
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              value={formData.eventName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, eventName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Number of People</Label>
              <Input
                id="numberOfPeople"
                type="number"
                min="1"
                value={formData.numberOfPeople}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, numberOfPeople: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerPerson">Price per Person (LKR)</Label>
            <Input
              id="pricePerPerson"
              type="number"
              min="0"
              value={formData.pricePerPerson}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, pricePerPerson: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilitator">Facilitator</Label>
            <Select
              value={formData.facilitator}
              onValueChange={(value) =>
                setFormData({ ...formData, facilitator: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select facilitator" />
              </SelectTrigger>
              <SelectContent>
                {facilitators.map((facilitator) => (
                  <SelectItem key={facilitator.id} value={facilitator.name}>
                    {facilitator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
          Add Booking
        </Button>
      </CredenzaFooter>
    </>
  );
}
