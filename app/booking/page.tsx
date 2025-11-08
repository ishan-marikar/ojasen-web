"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { MapPin, Clock, Calendar, User, Mail, Phone } from "lucide-react";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    participants: "1",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Booking data:", formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        participants: "1",
        message: "",
      });
    }, 3000);
  };

  // Sample event data - in a real app this would come from props or API
  const event = {
    title: "Zen & Balance Retreat",
    date: "November 29, 2025",
    time: "7:00 AM - 9:00 AM",
    location: "The Island - Ahangama",
    price: "LKR 15,000",
    image: "/images/events/event-01.jpg",
    description: "Join us for a rejuvenating weekend retreat focused on finding inner peace and balance through yoga, meditation, and holistic healing practices."
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#f7faf6] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-light text-[#191d18] mb-4">
              Book Your Experience
            </h1>
            <p className="text-[#525A52] max-w-2xl mx-auto text-lg">
              Reserve your spot for our transformative wellness events
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Event Details */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#68887d]/20">
              <h2 className="text-2xl font-light text-[#191d18] mb-6">Event Details</h2>
              
              <div className="aspect-video bg-gray-200 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-xl font-light text-[#191d18] mb-4">{event.title}</h3>
              <p className="text-[#525A52] mb-6">{event.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center text-[#191d18]">
                  <Calendar className="h-5 w-5 mr-3 text-[#68887d]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-[#191d18]">
                  <Clock className="h-5 w-5 mr-3 text-[#68887d]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-[#191d18]">
                  <MapPin className="h-5 w-5 mr-3 text-[#68887d]" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-[#191d18]">
                  <span className="font-medium text-lg">Price: {event.price}</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#68887d]/20">
              <h2 className="text-2xl font-light text-[#191d18] mb-6">Booking Information</h2>
              
              {isSubmitted ? (
                <div className="bg-[#CDEDD4] rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-light text-[#191d18] mb-4">Booking Confirmed!</h3>
                  <p className="text-[#525A52] mb-6">
                    Thank you for your booking. We've sent a confirmation to your email.
                  </p>
                  <p className="text-[#525A52]">
                    Our team will contact you shortly to finalize the details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[#191d18] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#68887d]" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[#191d18] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#68887d]" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[#191d18] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#68887d]" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-[#191d18] mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="participants" className="block text-[#191d18] mb-2">
                      Number of Participants
                    </label>
                    <select
                      id="participants"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[#191d18] mb-2">
                      Special Requests
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent"
                      placeholder="Any special requests or dietary requirements?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#68887d] hover:bg-[#5a786d] text-white uppercase px-6 py-4 text-sm font-medium transition-colors duration-300"
                  >
                    Confirm Booking
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}