import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  PlusIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Mock events data (replace with real data later)
const mockEvents = [
  {
    id: 1,
    title: 'Startup Pitch Competition',
    date: '2024-03-15T18:00:00',
    location: 'Chapman University - Argyros Forum',
    description: 'Present your startup idea to a panel of investors and entrepreneurs. Cash prizes for winners!',
    category: 'Pitch Competition',
    attendees: 45,
    maxAttendees: 100,
    organizer: 'Chapman Entrepreneurship Club',
    isRSVPed: false
  },
  {
    id: 2,
    title: 'Networking Mixer: Tech Founders',
    date: '2024-03-20T17:30:00',
    location: 'Virtual Event',
    description: 'Connect with fellow tech founders and industry professionals in this virtual networking event.',
    category: 'Networking',
    attendees: 28,
    maxAttendees: 50,
    organizer: 'Chapman Tech Society',
    isRSVPed: true
  },
  // Add more mock events...
];

const categories = [
  'All Events',
  'Networking',
  'Pitch Competition',
  'Workshop',
  'Hackathon',
  'Speaker Series'
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState('All Events');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events & Networking</h1>
            <p className="mt-1 text-sm text-gray-500">
              Discover and join startup events in the Chapman community
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  ${selectedCategory === category
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  transition-colors duration-150
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {event.title}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {event.category}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {event.attendees} / {event.maxAttendees} attending
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Organized by: {event.organizer}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-purple-500 rounded-full"
                        style={{
                          width: `${(event.attendees / event.maxAttendees) * 100}%`
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {event.maxAttendees - event.attendees} spots remaining
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`
                      ml-4 inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                      ${event.isRSVPed
                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        : 'border-transparent text-white bg-purple-600 hover:bg-purple-700'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                    `}
                  >
                    {event.isRSVPed ? 'Cancel RSVP' : 'RSVP'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 