import React from 'react';
import Link from 'next/link';
import { 
  MapPinIcon, 
  ClockIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedDate: string;
  applicants?: number;
  deadline?: string;
  skills: string[];
  companyLogo?: string;
  isFeatured?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  type,
  salary,
  postedDate,
  applicants,
  deadline,
  skills,
  companyLogo,
  isFeatured = false,
}) => {
  // Calculate days ago
  const getDaysAgo = (dateString: string) => {
    const postedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const daysAgo = getDaysAgo(postedDate);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isFeatured ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'} hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden`}>
      {isFeatured && (
        <div className="bg-blue-50 py-1.5 px-4 border-b border-blue-100">
          <span className="text-blue-700 text-xs font-medium">Featured Job</span>
        </div>
      )}
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link 
              href={`/jobs/${id}`}
              className="block text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1"
            >
              {title}
            </Link>
            <div className="flex items-center text-gray-600 text-sm mb-4">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={company} 
                  className="w-5 h-5 rounded-full mr-2"
                />
              ) : (
                <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
              )}
              <span>{company}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-5">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{location}</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-gray-500 text-sm">
              <BriefcaseIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{type}</span>
            </div>
            
            {salary && (
              <div className="flex items-center text-gray-500 text-sm">
                <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                <span>{salary}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-500 text-sm">
              <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{daysAgo}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          {applicants !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              <span>{applicants} {applicants === 1 ? 'applicant' : 'applicants'}</span>
            </div>
          )}
          
          {deadline && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">Deadline:</span> {deadline}
            </div>
          )}
          
          <Link
            href={`/jobs/${id}`}
            className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors ml-auto"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 