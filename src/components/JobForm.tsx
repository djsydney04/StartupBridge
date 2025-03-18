import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface JobFormData {
  id?: number;
  title: string;
  company: string;
  location: string;
  hoursPerWeek: string;
  description: string;
  skills: string[];
  applicationFormUrl: string;
  compensation?: string;
}

interface JobFormProps {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<JobFormData>(
    initialData || {
      title: '',
      company: '',
      location: '',
      hoursPerWeek: '',
      description: '',
      skills: [],
      applicationFormUrl: '',
      compensation: '',
    }
  );

  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company Name *
          </label>
          <input
            type="text"
            id="company"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700">
            Hours per Week *
          </label>
          <input
            type="text"
            id="hoursPerWeek"
            required
            value={formData.hoursPerWeek}
            onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
            placeholder="e.g., 20-30 hours/week"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="compensation" className="block text-sm font-medium text-gray-700">
            Compensation (Optional)
          </label>
          <input
            type="text"
            id="compensation"
            value={formData.compensation}
            onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
            placeholder="e.g., $20-25/hour, Equity Only, etc."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="applicationFormUrl" className="block text-sm font-medium text-gray-700">
          Application Form URL *
        </label>
        <input
          type="url"
          id="applicationFormUrl"
          required
          value={formData.applicationFormUrl}
          onChange={(e) => setFormData({ ...formData, applicationFormUrl: e.target.value })}
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Job Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Required Skills
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Type a skill and press Enter"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          {initialData ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm; 