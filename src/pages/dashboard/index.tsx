import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/utils/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
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
  FireIcon,
  BellIcon,
  SparklesIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'Find Co-Founders',
    description: 'Connect with potential startup partners',
    href: '/co-founders',
    icon: UsersIcon,
    color: 'bg-black',
    primary: true
  },
  {
    name: 'My Network',
    description: 'View your startup connections',
    href: '/connections',
    icon: UserPlusIcon,
    color: 'bg-black',
    primary: true
  },
  {
    name: 'Explore Startup Jobs',
    description: 'Browse available positions',
    href: '/jobs',
    icon: BriefcaseIcon,
    color: 'bg-gray-700'
  },
  {
    name: 'Upcoming Events',
    description: 'See what\'s happening in the community',
    href: '/events',
    icon: CalendarIcon,
    color: 'bg-gray-700'
  },
  {
    name: 'Resources Library',
    description: 'Access guides, templates and tools',
    href: '/resources',
    icon: BookOpenIcon,
    color: 'bg-gray-700'
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
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <DashboardLayout>
      <div className="content-container">
        {/* Welcome Section with Notifications */}
        <div className="content-section p-8 mb-8 flex flex-col md:flex-row justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              You have 2 job applications waiting for your review
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
              >
                <BellIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-600"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <span className="inline-flex p-2 rounded-lg bg-gray-100 mr-3">
                            <activity.icon className="h-5 w-5 text-gray-600" />
                          </span>
                          <div>
                            <h4 className="text-sm font-medium">{activity.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <Link href="/notifications" className="text-xs text-gray-500 hover:text-gray-700">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Co-founder Matches */}
        <div className="content-section mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-900">Co-founder Matches</h2>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                <SparklesIcon className="h-3 w-3 mr-1" /> AI-Powered
              </span>
            </div>
            <Link href="/co-founders" className="text-sm text-gray-600 hover:text-black flex items-center">
              Find More <ArrowRightIcon className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedCoFounders.map((person) => (
              <div key={person.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">{person.name}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                    {person.matchScore}% Match
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {person.role}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {person.skills.map((skill, idx) => (
                    <span key={idx} className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <Link href={`/co-founders`} className="text-xs text-white bg-black px-3 py-1 rounded hover:bg-gray-800">
                    See More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Grid */}
        <div className="content-section mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className={`flex items-center p-4 rounded-lg border ${action.primary ? 'border-black' : 'border-gray-200'} hover:shadow-md transition-all bg-white`}
              >
                <span className={`inline-flex p-3 rounded-lg ${action.color} mr-4`}>
                  <action.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {action.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
                {action.primary && (
                  <div className="ml-auto">
                    <ArrowRightIcon className="h-4 w-4 text-gray-500" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Two-column layout for Events and Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Job Highlights */}
          <div className="content-section p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Latest Jobs</h2>
              <Link href="/jobs" className="text-xs text-gray-600 hover:text-black flex items-center">
                Browse All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {jobHighlights.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{job.company}</p>
                    </div>
                    <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                      {job.location}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Posted {job.postedAt}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    <Link href={`/jobs/${job.id}`} className="text-xs text-white bg-black px-3 py-1 rounded hover:bg-gray-800">
                      See More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="content-section p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <Link href="/events" className="text-xs text-gray-600 hover:text-black flex items-center">
                View Calendar <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                  <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    <span>{event.date}</span>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    <Link href={`/events/${event.id}`} className="text-xs text-white bg-black px-3 py-1 rounded hover:bg-gray-800">
                      See More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="content-section p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Resources for You</h2>
            <Link href="/resources" className="text-sm text-gray-600 hover:text-black flex items-center">
              View Library <ArrowRightIcon className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all bg-white">
                <div className="flex items-start">
                  <span className="inline-flex p-2 rounded-lg bg-gray-100 mr-3">
                    <resource.icon className="h-5 w-5 text-gray-600" />
                  </span>
                  <div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{resource.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">{resource.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <Link href={`/resources/${resource.id}`} className="text-xs text-white bg-black px-3 py-1 rounded hover:bg-gray-800">
                    See More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 