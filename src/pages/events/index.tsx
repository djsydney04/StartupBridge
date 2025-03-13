import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ChevronDownIcon,
  BuildingLibraryIcon,
  UserGroupIcon as UserGroupSolidIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

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

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <Events />
    </ProtectedRoute>
  );
}

function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<CategoryKey, boolean>>({
    ceo: true,
    leatherby: true,
    community: true
  });

  // Filter events based on search query
  const filteredEvents = searchQuery 
    ? allEvents.filter(event => {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query)
        );
      })
    : null;

  // Toggle category expansion
  const toggleCategory = (category: CategoryKey) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  return (
    <DashboardLayout>
      <div className="content-container max-w-6xl mx-auto">
        <div className="content-header mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Events
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover networking opportunities and learning experiences
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-6 mb-6">
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200 text-sm"
                  placeholder="Search events by title, organizer, or category"
                />
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Search Results (if any) */}
        {filteredEvents && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search Results ({filteredEvents.length})
            </h2>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={`search-${event.id}`} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No events found matching your search.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events by Category */}
        {!searchQuery && (
          <>
            {/* CEO Events */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between p-4 bg-white rounded-t-xl shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => toggleCategory('ceo')}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <UserGroupSolidIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">CEO Events</h2>
                    <p className="text-sm text-gray-500">Chapman Entrepreneurs Organization</p>
                  </div>
                </div>
                <ChevronDownIcon 
                  className={`h-6 w-6 text-gray-400 transition-transform ${expandedCategories.ceo ? 'transform rotate-180' : ''}`} 
                />
              </div>
              
              {expandedCategories.ceo && (
                <div className="bg-white rounded-b-xl shadow-sm border-x border-b border-gray-100 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.ceo.map((event) => (
                      <EventCard key={`ceo-${event.id}`} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Leatherby Center Events */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between p-4 bg-white rounded-t-xl shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => toggleCategory('leatherby')}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <BuildingLibraryIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Leatherby Center Events</h2>
                    <p className="text-sm text-gray-500">Entrepreneurship workshops and competitions</p>
                  </div>
                </div>
                <ChevronDownIcon 
                  className={`h-6 w-6 text-gray-400 transition-transform ${expandedCategories.leatherby ? 'transform rotate-180' : ''}`} 
                />
              </div>
              
              {expandedCategories.leatherby && (
                <div className="bg-white rounded-b-xl shadow-sm border-x border-b border-gray-100 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.leatherby.map((event) => (
                      <EventCard key={`leatherby-${event.id}`} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Community Events */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between p-4 bg-white rounded-t-xl shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => toggleCategory('community')}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <GlobeAltIcon className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Community Events</h2>
                    <p className="text-sm text-gray-500">External opportunities from the startup ecosystem</p>
                  </div>
                </div>
                <ChevronDownIcon 
                  className={`h-6 w-6 text-gray-400 transition-transform ${expandedCategories.community ? 'transform rotate-180' : ''}`} 
                />
              </div>
              
              {expandedCategories.community && (
                <div className="bg-white rounded-b-xl shadow-sm border-x border-b border-gray-100 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.community.map((event) => (
                      <EventCard key={`community-${event.id}`} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

// Extracted Event Card Component
function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 h-[420px] flex flex-col">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-medium text-gray-900 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500">
              {event.organizer}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {event.type}
          </span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{event.attendees} attending</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500 line-clamp-3 flex-grow">
          {event.description}
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 shadow-sm transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
} 