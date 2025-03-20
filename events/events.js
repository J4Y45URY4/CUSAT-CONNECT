import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FiSettings, FiBell, FiUser, FiLogOut } from "react-icons/fi";

const events = Array(8).fill({
  title: "National Seminar",
  date: "16 Dec, 2019",
  location: "Whitefield, Bengaluru, 642002, India",
  category: "Science",
  attendees: 50,
  image: "https://source.unsplash.com/random/200x200/?science",
});

export default function EventoDashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Evento</h2>
        <nav className="flex flex-col gap-4">
          <Button variant="ghost" className="justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start">
            Profile
          </Button>
          <Button variant="ghost" className="justify-start">
            Settings
          </Button>
          <Button variant="ghost" className="justify-start">
            Notification
          </Button>
          <Button variant="ghost" className="justify-start">
            Following
          </Button>
        </nav>
        <Button variant="ghost" className="mt-auto flex items-center gap-2">
          <FiLogOut /> Logout
        </Button>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex gap-6">
          {/* Profile Card */}
          <div className="w-1/3 bg-white p-6 rounded-2xl shadow-lg">
            <Avatar className="w-20 h-20 mx-auto" />
            <h3 className="text-center text-xl font-semibold mt-4">John Doe</h3>
            <p className="text-center text-gray-500">(Department) | Semester X</p>
            <div className="mt-4">
              <h4 className="text-gray-700 font-semibold">Education Details</h4>
              <p className="text-sm text-gray-600">AMS Higher Secondary School</p>
              <p className="text-sm text-gray-600">HSC - Biology (2009 - 2011)</p>
            </div>
            <div className="mt-4">
              <h4 className="text-gray-700 font-semibold">Job History</h4>
              <p className="text-sm text-gray-600">UI/UX Designer at Tarlabs</p>
            </div>
          </div>
          
          {/* Events List */}
          <div className="flex-1">
            <Tabs defaultValue="events">
              <TabsList className="flex gap-4">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="internships">Internships</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
            </Tabs>
            <ScrollArea className="mt-6 grid grid-cols-3 gap-4">
              {events.map((event, index) => (
                <Card key={index} className="relative">
                  <img
                    src={event.image}
                    alt="event"
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      {event.category}
                    </Badge>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-500">By John Doe</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    <p className="text-sm text-gray-600">+{event.attendees} others are going</p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
