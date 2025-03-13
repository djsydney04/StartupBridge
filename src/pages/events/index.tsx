import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventCard from '@/components/EventCard';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Organization filters
const organizationFilters = [
  {
    id: 'all',
    name: 'All Organizations',
    icon: BuildingLibraryIcon,
  },
  {
    id: 'leatherby',
    name: 'Leatherby Center',
    icon: RocketLaunchIcon,
  },
  {
    id: 'ceo',
    name: 'CEO',
    icon: UserGroupIcon,
  },
  {
    id: 'community',
    name: 'Community',
    icon: GlobeAltIcon,
  }
];

// Event type definition
interface Event {
  id: number;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  type: string;
  category: string;
  description: string;
  attendees: number;
  image: string;
  isVirtual?: boolean;
  registrationLink?: string;
}

// Category type
type CategoryKey = 'ceo' | 'leatherby' | 'community';

// Mock events data categorized by source
const mockEvents: Record<CategoryKey, Event[]> = {
  ceo: [
    {
      id: 1,
      title: 'CEO Speaker Series: From Student to Startup Founder',
      organizer: 'Chapman Entrepreneurs Organization',
      date: 'March 15, 2024',
      time: '5:00 PM - 7:00 PM',
      location: 'Argyros Forum 209A',
      type: 'In-Person',
      category: 'Speaker Series',
      description: 'Join us for an inspiring talk with Chapman alumni who built successful startups straight out of college. Learn about their journey, challenges, and insights they wish they knew earlier.',
      attendees: 65,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 2,
      title: 'CEO Networking Mixer',
      organizer: 'Chapman Entrepreneurs Organization',
      date: 'March 22, 2024',
      time: '6:30 PM - 8:30 PM',
      location: 'The District Lounge, Orange',
      type: 'In-Person',
      category: 'Networking',
      description: 'Connect with fellow entrepreneurial-minded students in a relaxed setting. Build relationships that could lead to your next venture or collaboration.',
      attendees: 40,
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
  ],
  leatherby: [
    {
      id: 3,
      title: 'Startup Pitch Competition',
      organizer: 'Leatherby Center',
      date: 'April 5, 2024',
      time: '1:00 PM - 5:00 PM',
      location: 'Leatherby Center for Entrepreneurship',
      type: 'In-Person',
      category: 'Competition',
      description: 'Pitch your startup idea to a panel of investors and entrepreneurs. Cash prizes and mentorship opportunities available for winners.',
      attendees: 85,
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 4,
      title: 'Startup Workshop: Financial Modeling',
      organizer: 'Leatherby Center',
      date: 'March 28, 2024',
      time: '4:00 PM - 6:00 PM',
      location: 'Leatherby Center, Room 204',
      type: 'Hybrid',
      category: 'Workshop',
      description: 'Learn how to create financial projections and models for your startup. Bring your laptop for this hands-on workshop led by finance experts.',
      attendees: 35,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
  ],
  community: [
    {
      id: 5,
      title: 'OC Tech Meetup',
      organizer: 'OCTech Community',
      date: 'April 10, 2024',
      time: '7:00 PM - 9:00 PM',
      location: 'The LAB Anti-Mall, Costa Mesa',
      type: 'In-Person',
      category: 'Networking',
      description: 'Join the Orange County tech community for demos, talks, and networking. Great opportunity to meet potential technical co-founders.',
      attendees: 120,
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 6,
      title: 'Founder Fireside Chat',
      organizer: 'SoCal Startups',
      date: 'March 30, 2024',
      time: '6:00 PM - 7:30 PM',
      location: 'Virtual Event',
      type: 'Online',
      category: 'Speaker Series',
      description: 'Virtual fireside chat with successful founders from Southern California. Learn about raising capital in the current environment and building resilient startups.',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
  ]
};

// Flatten events for search functionality
const allEvents = [
  ...mockEvents.ceo, 
  ...mockEvents.leatherby, 
  ...mockEvents.community
];

// Get upcoming events (next 7 days)
const getUpcomingEvents = () => {
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  return allEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <Events />
    </ProtectedRoute>
  );
}

function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [view, setView] = useState<'grid' | 'calendar'>('grid');
  
  const upcomingEvents = getUpcomingEvents();

  // Filter events based on search and organization
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = selectedOrg === 'all' || 
                      (selectedOrg === 'leatherby' && event.organizer.includes('Leatherby')) ||
                      (selectedOrg === 'ceo' && event.organizer.includes('CEO')) ||
                      (selectedOrg === 'community' && event.organizer.includes('Community'));
    return matchesSearch && matchesOrg;
  });

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover and join events in the Chapman startup community
          </p>
        </div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming This Week</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                View all <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={`upcoming-${event.id}`}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  description={event.description}
                  attendees={event.attendees}
                  isVirtual={event.type === 'Online'}
                  organizer={event.organizer}
                />
              ))}
            </div>
          </div>
        )}

        {/* Organization Filters */}
        <div className="mt-8 flex space-x-4 overflow-x-auto pb-4">
          {organizationFilters.map((org) => (
            <button
              key={org.id}
              onClick={() => setSelectedOrg(org.id)}
              className={`flex items-center px-4 py-2 rounded-lg border whitespace-nowrap transition-all ${
                selectedOrg === org.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <org.icon className={`h-5 w-5 mr-2 ${
                selectedOrg === org.id ? 'text-white' : 'text-gray-500'
              }`} />
              <span className="text-sm font-medium">{org.name}</span>
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg ${
                view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg ${
                view === 'calendar' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {view === 'grid' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                description={event.description}
                attendees={event.attendees}
                isVirtual={event.type === 'Online'}
                organizer={event.organizer}
              />
            ))}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-center text-gray-500">Calendar view coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}