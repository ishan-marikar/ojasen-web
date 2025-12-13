"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category?: string;
  image?: string;
  defaultPrice: number;
  defaultLocation?: string;
  status: string;
  sessions?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    image: "",
    defaultPrice: 0,
    defaultLocation: "",
    status: "active",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/events");
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
      } else {
        setError(data.error || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchEvents();
        setIsAddModalOpen(false);
        resetForm();
      } else {
        alert("Failed to create event: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event");
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEvent.id, ...formData }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchEvents();
        setIsEditModalOpen(false);
        setSelectedEvent(null);
        resetForm();
      } else {
        alert("Failed to update event: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This will also delete all associated sessions."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchEvents();
      } else {
        alert("Failed to delete event: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      fullDescription: event.fullDescription || "",
      category: event.category || "",
      image: event.image || "",
      defaultPrice: event.defaultPrice,
      defaultLocation: event.defaultLocation || "",
      status: event.status,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      fullDescription: "",
      category: "",
      image: "",
      defaultPrice: 0,
      defaultLocation: "",
      status: "active",
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Events Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage event templates and offerings
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <CredenzaTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </CredenzaTrigger>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Add New Event</CredenzaTitle>
              <CredenzaDescription>
                Create a new event template
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              <EventForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddEvent}
              />
            </CredenzaBody>
          </CredenzaContent>
        </Credenza>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Default Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.category || "—"}</TableCell>
                    <TableCell>
                      LKR {event.defaultPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>{event.defaultLocation || "—"}</TableCell>
                    <TableCell>{event.sessions?.length || 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.status === "active" ? "default" : "secondary"
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Credenza open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Edit Event</CredenzaTitle>
            <CredenzaDescription>Update event information</CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <EventForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditEvent}
            />
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

function EventForm({ formData, setFormData, onSubmit }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Short description"
          required
        />
      </div>
      <div>
        <Label htmlFor="fullDescription">Full Description</Label>
        <textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) =>
            setFormData({ ...formData, fullDescription: e.target.value })
          }
          placeholder="Detailed description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[100px]"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Select category</option>
          <option value="Yoga">Yoga</option>
          <option value="Healing">Healing</option>
          <option value="Sound Healing">Sound Healing</option>
          <option value="Ceremonies">Ceremonies</option>
          <option value="Workshops">Workshops</option>
          <option value="Retreats">Retreats</option>
        </select>
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="/images/event.png"
        />
      </div>
      <div>
        <Label htmlFor="defaultPrice">Default Price (LKR) *</Label>
        <Input
          id="defaultPrice"
          type="number"
          value={formData.defaultPrice}
          onChange={(e) =>
            setFormData({
              ...formData,
              defaultPrice: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="3000"
          required
        />
      </div>
      <div>
        <Label htmlFor="defaultLocation">Default Location</Label>
        <Input
          id="defaultLocation"
          value={formData.defaultLocation}
          onChange={(e) =>
            setFormData({ ...formData, defaultLocation: e.target.value })
          }
          placeholder="Ojasen Healing Arts"
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Save Event
      </Button>
    </div>
  );
}
