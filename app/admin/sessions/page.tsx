"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  defaultPrice: number;
  defaultLocation?: string;
}

interface Session {
  id: string;
  eventId: string;
  title?: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  capacity: number;
  // bookedCount removed - calculated from bookings relationship
  bookings?: any[]; // For displaying booking count
  _count?: { bookings: number }; // Prisma count
  facilitatorId?: string;
  facilitatorName?: string;
  status: string;
  description?: string;
  event: Event;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    date: "",
    time: "",
    location: "",
    price: 0,
    capacity: 20,
    facilitatorName: "",
    status: "active",
    description: "",
  });

  useEffect(() => {
    fetchSessions();
    fetchEvents();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/sessions");
      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions);
      } else {
        setError(data.error || "Failed to fetch sessions");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events");
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleAddSession = async () => {
    try {
      const response = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchSessions();
        setIsAddModalOpen(false);
        resetForm();
      } else {
        alert("Failed to create session: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Failed to create session");
    }
  };

  const handleEditSession = async () => {
    if (!selectedSession) return;

    try {
      const response = await fetch("/api/admin/sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSession.id, ...formData }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchSessions();
        setIsEditModalOpen(false);
        setSelectedSession(null);
        resetForm();
      } else {
        alert("Failed to update session: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating session:", err);
      alert("Failed to update session");
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchSessions();
      } else {
        alert("Failed to delete session: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Failed to delete session");
    }
  };

  const openEditModal = (session: Session) => {
    setSelectedSession(session);
    const dateObj = new Date(session.date);
    const formattedDate = dateObj.toISOString().split("T")[0];

    setFormData({
      eventId: session.eventId,
      title: session.title || "",
      date: formattedDate,
      time: session.time,
      location: session.location,
      price: session.price,
      capacity: session.capacity,
      facilitatorName: session.facilitatorName || "",
      status: session.status,
      description: session.description || "",
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      eventId: "",
      title: "",
      date: "",
      time: "",
      location: "",
      price: 0,
      capacity: 20,
      facilitatorName: "",
      status: "active",
      description: "",
    });
  };

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setFormData({
        ...formData,
        eventId,
        location: event.defaultLocation || formData.location,
        price: event.defaultPrice || formData.price,
      });
    } else {
      setFormData({ ...formData, eventId });
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const searchString = `${session.event.title} ${session.location} ${
      session.facilitatorName || ""
    }`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading sessions...</div>
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
          Sessions Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage scheduled event sessions
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search sessions..."
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
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="full">Full</option>
          </select>
        </div>
        <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <CredenzaTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </CredenzaTrigger>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Add New Session</CredenzaTitle>
              <CredenzaDescription>
                Create a new scheduled session
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              <SessionForm
                formData={formData}
                setFormData={setFormData}
                events={events}
                onEventChange={handleEventChange}
                onSubmit={handleAddSession}
              />
            </CredenzaBody>
          </CredenzaContent>
        </Credenza>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Facilitator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.title || session.event.title}
                    </TableCell>
                    <TableCell>
                      {new Date(session.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell>LKR {session.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {session._count?.bookings ||
                        session.bookings?.length ||
                        0}{" "}
                      / {session.capacity}
                    </TableCell>
                    <TableCell>{session.facilitatorName || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.status === "active"
                            ? "default"
                            : session.status === "full"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(session)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
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
            <CredenzaTitle>Edit Session</CredenzaTitle>
            <CredenzaDescription>
              Update session information
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <SessionForm
              formData={formData}
              setFormData={setFormData}
              events={events}
              onEventChange={handleEventChange}
              onSubmit={handleEditSession}
            />
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

function SessionForm({
  formData,
  setFormData,
  events,
  onEventChange,
  onSubmit,
}: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="eventId">Event *</Label>
        <select
          id="eventId"
          value={formData.eventId}
          onChange={(e) => onEventChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
          required
        >
          <option value="">Select an event</option>
          {events
            .filter((e: any) => e.status === "active")
            .map((event: any) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
        </select>
      </div>
      <div>
        <Label htmlFor="title">Custom Title (Optional)</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Leave empty to use event title"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="6:00 PM"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Ojasen Healing Arts"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (LKR) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                capacity: parseInt(e.target.value) || 20,
              })
            }
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="facilitatorName">Facilitator</Label>
        <Input
          id="facilitatorName"
          value={formData.facilitatorName}
          onChange={(e) =>
            setFormData({ ...formData, facilitatorName: e.target.value })
          }
          placeholder="Facilitator name"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Additional session details"
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[80px]"
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
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
          <option value="full">Full</option>
        </select>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Save Session
      </Button>
    </div>
  );
}
