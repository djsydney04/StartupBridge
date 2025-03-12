import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const mockEvents = [
  {
    id: 1,
    title: 'Startup Pitch Competition',
    organizer: 'Chapman Startup Hub',
    date: 'March 15, 2024',
    time: '5:00 PM - 8:00 PM',
    location: 'Chapman University, Orange, CA',
    type: 'In-Person',
    category: 'Competition',
    description: 'Join us for an exciting evening of startup pitches from Chapman\'s most innovative entrepreneurs. Network with investors and fellow founders.',
    attendees: 75,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 2,
    title: 'Founder Fireside Chat',
    organizer: 'Entrepreneurship Club',
    date: 'March 20, 2024',
    time: '6:00 PM - 7:30 PM',
    location: 'Virtual Event',
    type: 'Online',
    category: 'Networking',
    description: 'Learn from successful founders as they share their entrepreneurial journey, challenges, and insights in an intimate fireside chat format.',
    attendees: 120,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 3,
    title: 'Startup Workshop Series',
    organizer: 'Chapman Innovation Lab',
    date: 'March 25, 2024',
    time: '4:00 PM - 6:00 PM',
    location: 'Beckman Hall 404',
    type: 'Hybrid',
    category: 'Workshop',
    description: 'A hands-on workshop series covering essential startup topics including business model validation, fundraising, and growth strategies.',
    attendees: 45,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
];

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <Events />
    </ProtectedRoute>
  );
}

function Events() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DashboardLayout>
      <div className="content-container">
        <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">
            Startup Events
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover networking opportunities and learning experiences
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="content-section">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  placeholder="Search events by title or organizer"
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="content-section">
          <div className="content-grid">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="card"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="card-body">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.organizer}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {event.type}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="btn btn-primary w-full"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 