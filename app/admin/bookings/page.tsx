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

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [facilitators, setFacilitators] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
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

        // Fetch bookings
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        } else {
          throw new Error(bookingsData.error || "Failed to fetch bookings");
        }

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
  const handleAddBooking = async (newBooking: any) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBooking,
          eventDate: new Date(newBooking.eventDate),
          numberOfPeople: parseInt(newBooking.numberOfPeople),
          totalPrice:
            parseInt(newBooking.pricePerPerson) *
            parseInt(newBooking.numberOfPeople),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refetch bookings to get the updated list
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        }

        setIsAddModalOpen(false);
      } else {
        console.error("Failed to create booking:", result.error);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  // Handle editing a booking
  const handleEditBooking = async (updatedBooking: any) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      });

      const result = await response.json();

      if (result.success) {
        // Refetch bookings to get the updated list
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        }

        setIsEditModalOpen(false);
        setEditingBooking(null);
      } else {
        console.error("Failed to update booking:", result.error);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = async (id: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        // Refetch bookings to get the updated list
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        }
      } else {
        console.error("Failed to delete booking:", result.error);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading bookings...
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
                  facilitators={facilitators}
                  onSubmit={handleAddBooking}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </CredenzaContent>
            </Credenza>
            <Credenza open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <CredenzaContent>
                {editingBooking && (
                  <EditBookingForm
                    facilitators={facilitators}
                    booking={editingBooking}
                    onSubmit={handleEditBooking}
                    onCancel={() => {
                      setIsEditModalOpen(false);
                      setEditingBooking(null);
                    }}
                  />
                )}
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

// Edit Booking Form Component
function EditBookingForm({
  facilitators,
  booking,
  onSubmit,
  onCancel,
}: {
  facilitators: any[];
  booking: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    id: booking.id,
    eventName: booking.eventName || "",
    customerName: booking.customerName || "",
    eventDate: booking.eventDate
      ? new Date(booking.eventDate).toISOString().split("T")[0]
      : "",
    numberOfPeople: booking.numberOfPeople?.toString() || "1",
    pricePerPerson:
      Math.floor(booking.totalPrice / booking.numberOfPeople).toString() || "",
    facilitator: booking.facilitatorName || "",
    status: booking.status || "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Edit Booking</CredenzaTitle>
        <CredenzaDescription>Update booking details</CredenzaDescription>
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
          Update Booking
        </Button>
      </CredenzaFooter>
    </>
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
