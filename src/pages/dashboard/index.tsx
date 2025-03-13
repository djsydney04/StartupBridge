import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/utils/AuthContext';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  BoltIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowRightIcon,
  UsersIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'Find Co-Founders',
    description: 'Connect with potential startup partners',
    href: '/co-founders',
    icon: UsersIcon,
    color: 'bg-black'
  },
  {
    name: 'Explore Startup Jobs',
    description: 'Browse available positions',
    href: '/jobs',
    icon: BriefcaseIcon,
    color: 'bg-black'
  },
  {
    name: 'Upcoming Events',
    description: 'See what\'s happening in the community',
    href: '/events',
    icon: CalendarIcon,
    color: 'bg-black'
  },
  {
    name: 'Resources Library',
    description: 'Access guides, templates and tools',
    href: '/resources',
    icon: BookOpenIcon,
    color: 'bg-black'
  }
];

// Mock activity data (replace with real data later)
const recentActivity = [
  {
    id: 1,
    type: 'connection',
    title: 'New Co-founder Request',
    description: 'Sarah Chen wants to connect with you',
    time: '2 hours ago',
    icon: UsersIcon,
    color: 'text-gray-800'
  },
  {
    id: 2,
    type: 'job',
    title: 'New Job Posted',
    description: 'Frontend Developer at TechStartup',
    time: '3 hours ago',
    icon: BriefcaseIcon,
    color: 'text-gray-800'
  },
  {
    id: 3,
    type: 'event',
    title: 'Upcoming Event',
    description: 'Startup Pitch Competition this Friday',
    time: '1 day ago',
    icon: CalendarIcon,
    color: 'text-gray-800'
  }
];

// Mock resources
const featuredResources = [
  {
    id: 1,
    title: 'Startup Pitch Deck Template',
    type: 'Template',
    description: 'A professional pitch deck template for student-led startups.',
    category: 'Pitch Materials',
    icon: DocumentTextIcon
  },
  {
    id: 2,
    title: 'Finding Co-Founder Chemistry',
    type: 'Guide',
    description: 'How to find and evaluate potential co-founders for your startup journey.',
    category: 'Team Building',
    icon: UsersIcon
  },
  {
    id: 3,
    title: 'Startup Legal Checklist',
    type: 'Checklist',
    description: 'Essential legal steps to take when launching your startup.',
    category: 'Legal',
    icon: DocumentTextIcon
  }
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: 'Startup Pitch Competition',
    date: 'Nov 15, 2023',
    time: '3:00 PM - 6:00 PM',
    location: 'Chapman Entrepreneurship Center'
  },
  {
    id: 2,
    title: 'VC Office Hours',
    date: 'Nov 17, 2023',
    time: '10:00 AM - 2:00 PM',
    location: 'Online (Zoom)'
  }
];

// Mock job highlights
const jobHighlights = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechStartup',
    location: 'Remote',
    postedAt: '3 days ago'
  },
  {
    id: 2,
    title: 'Growth Marketer',
    company: 'Chapman Ventures',
    location: 'Orange, CA',
    postedAt: '1 day ago'
  }
];

// Mock suggested co-founders
const suggestedCoFounders = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Developer',
    skills: ['Full-Stack', 'AI', 'Mobile'],
    matchScore: 95
  },
  {
    id: 2,
    name: 'Mia Chen',
    role: 'Designer',
    skills: ['UI/UX', 'Branding', 'Product'],
    matchScore: 87
  }
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const { user, profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <DashboardLayout>
      <div className="content-container">
        {/* Welcome Section */}
        <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            You have 3 new co-founder requests and 2 job applications
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="content-section">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
          <div className="content-grid">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="card"
              >
                <div className="card-body flex flex-col items-center">
                  <span className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                    <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Co-founder Matches */}
        <div className="content-section">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Co-founder Matches</h2>
            <Link href="/co-founders" className="text-sm text-gray-600 hover:text-black flex items-center">
              View All <ArrowRightIcon className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedCoFounders.map((person) => (
              <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{person.name}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                    {person.matchScore}% Match
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {person.role}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {person.skills.map((skill, idx) => (
                    <span key={idx} className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column layout for Events and Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="content-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-gray-600 hover:text-black flex items-center">
                View All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {event.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Highlights */}
          <div className="content-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Job Highlights</h2>
              <Link href="/jobs" className="text-sm text-gray-600 hover:text-black flex items-center">
                View All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {jobHighlights.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                  <div className="mt-1 text-xs text-gray-500">
                    {job.company} • {job.location}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Posted {job.postedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two-column layout for Resources and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="content-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link href="/profile" className="text-sm text-gray-600 hover:text-black flex items-center">
                View All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 rounded-lg px-3"
                >
                  <div className="flex items-start">
                    <span className={`inline-flex p-2 rounded-lg bg-gray-100 mr-3`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center ml-4">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <ChevronRightIcon className="ml-1 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Resources */}
          <div className="content-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Featured Resources</h2>
              <Link href="/resources" className="text-sm text-gray-600 hover:text-black flex items-center">
                View All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {featuredResources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 text-gray-800 mr-3">
                      <resource.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-gray-800 bg-gray-100 py-0.5 px-2 rounded">
                          {resource.type}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 