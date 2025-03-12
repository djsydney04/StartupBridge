import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/utils/AuthContext';
import Link from 'next/link';
import {
  BoltIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'Find Co-Founders',
    description: 'Connect with potential startup partners',
    href: '/co-founders',
    icon: BoltIcon,
    color: 'bg-purple-500'
  },
  {
    name: 'Explore Startup Jobs',
    description: 'Browse available positions',
    href: '/jobs',
    icon: BriefcaseIcon,
    color: 'bg-blue-500'
  },
  {
    name: 'Upcoming Events',
    description: 'See what\'s happening in the community',
    href: '/events',
    icon: CalendarIcon,
    color: 'bg-green-500'
  }
];

// Mock activity data (replace with real data later)
const recentActivity = [
  {
    id: 1,
    type: 'connection',
    title: 'New Co-founder Request',
    description: 'Sarah Chen wants to connect with you',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'job',
    title: 'New Job Posted',
    description: 'Frontend Developer at TechStartup',
    time: '3 hours ago'
  },
  {
    id: 3,
    type: 'event',
    title: 'Upcoming Event',
    description: 'Startup Pitch Competition this Friday',
    time: '1 day ago'
  }
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            You have 3 new co-founder requests and 2 job applications
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <span className={`inline-flex p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-200 pointer-events-none"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <ChevronRightIcon className="ml-2 h-5 w-5 text-gray-400" />
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