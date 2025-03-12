import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/utils/AuthContext';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center"
              >
                <span className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                  <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="content-section">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 rounded-lg px-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center ml-4">
                  <span className="text-sm text-gray-500">{activity.time}</span>
                  <ChevronRightIcon className="ml-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 