import React from 'react';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export interface EventProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  attendees?: number;
  isVirtual?: boolean;
  registrationLink?: string;
  rsvpLink?: string;
  organizer?: string;
}

const EventCard: React.FC<EventProps> = ({
  title,
  date,
  time,
  location,
  description,
  attendees,
  isVirtual,
  registrationLink,
  rsvpLink,
  organizer
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{date} • {time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{isVirtual ? 'Virtual Event' : location}</span>
          </div>

          {attendees && (
            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{attendees} Attendees</span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}

        {organizer && (
          <p className="text-sm text-gray-500 mb-4">
            Organized by: {organizer}
          </p>
        )}

        <div className="flex space-x-3">
          {registrationLink && (
            <Link 
              href={registrationLink}
              className="btn btn-primary"
            >
              Register Now
            </Link>
          )}
          
          {rsvpLink && (
            <Link 
              href={rsvpLink}
              className="btn btn-secondary"
            >
              RSVP
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 