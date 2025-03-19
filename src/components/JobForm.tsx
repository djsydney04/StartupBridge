import React, { useState, useMemo, Fragment } from 'react';
import { Combobox, Transition, Listbox } from '@headlessui/react';
import { ChevronUpIcon, CheckIcon, XMarkIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { skillCategories } from '../utils/skillCategories';

// Helper function to get all available skills as a flat array
const getAllSkills = () => {
  const allSkills: string[] = [];
  Object.values(skillCategories).forEach((category) => {
    Object.values(category.skills).forEach((skillArray) => {
      allSkills.push(...skillArray);
    });
  });
  return Array.from(new Set(allSkills)).sort();
};

// Smart skill matching algorithm
const matchSkill = (query: string, skills: string[]): string[] => {
  const normalizedQuery = query.toLowerCase();
  return skills
    .filter(skill => {
      const normalizedSkill = skill.toLowerCase();
      if (normalizedSkill === normalizedQuery) return true;
      if (normalizedSkill.startsWith(normalizedQuery)) return true;
      if (normalizedSkill.includes(normalizedQuery)) return true;
      const acronym = skill
        .split(' ')
        .map(word => word[0])
        .join('')
        .toLowerCase();
      if (acronym.includes(normalizedQuery)) return true;
      return false;
    })
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      if (aLower === normalizedQuery) return -1;
      if (bLower === normalizedQuery) return 1;
      if (aLower.startsWith(normalizedQuery) && !bLower.startsWith(normalizedQuery)) return -1;
      if (!aLower.startsWith(normalizedQuery) && bLower.startsWith(normalizedQuery)) return 1;
      return a.localeCompare(b);
    });
};

interface JobFormData {
  title: string;
  company: string;
  location: string;
  hoursPerWeek: string;
  description: string;
  skills: string[];
  compensation?: string;
  companyStage: string;
  timeCommitment: string;
  startupType: string;
  applicationFormUrl: string;
}

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
}

const companyStages = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Public',
  'Bootstrapped'
];

const timeCommitments = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Flexible'
];

const startupTypes = [
  'B2B',
  'B2C',
  'Enterprise',
  'Consumer',
  'Marketplace',
  'SaaS',
  'AI/ML',
  'Fintech',
  'Healthcare',
  'EdTech',
  'Other'
];

export default function JobForm({ onSubmit, initialData = {} }: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData.title || '',
    company: initialData.company || '',
    location: initialData.location || '',
    hoursPerWeek: initialData.hoursPerWeek || '',
    description: initialData.description || '',
    skills: initialData.skills || [],
    compensation: initialData.compensation || '',
    companyStage: initialData.companyStage || companyStages[0],
    timeCommitment: initialData.timeCommitment || timeCommitments[0],
    startupType: initialData.startupType || startupTypes[0],
    applicationFormUrl: initialData.applicationFormUrl || '',
  });

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const allSkills = useMemo(() => getAllSkills(), []);
  
  const filteredSkills = useMemo(() => {
    if (query === '') {
      return selectedCategory 
        ? Object.values(skillCategories[selectedCategory].skills).flat()
        : allSkills;
    }
    return matchSkill(query, selectedCategory 
      ? Object.values(skillCategories[selectedCategory].skills).flat()
      : allSkills
    );
  }, [query, selectedCategory, allSkills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
      <div className="space-y-8 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <label htmlFor="title" className="block text-base font-medium text-gray-700">
              Job Title *
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="e.g., Frontend Developer, Product Manager, Marketing Lead"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-base font-medium text-gray-700">
              Company Name *
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="Your company name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="companyStage" className="block text-base font-medium text-gray-700">
                Company Stage *
              </label>
              <div className="mt-2">
                <Listbox
                  value={formData.companyStage}
                  onChange={(value) => setFormData({ ...formData, companyStage: value })}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg border-2 border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base">
                      <span className="block truncate">{formData.companyStage}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {companyStages.map((stage) => (
                          <Listbox.Option
                            key={stage}
                            value={stage}
                            className={({ active }) =>
                              `relative cursor-default select-none py-3 px-4 ${
                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                  {stage}
                                </span>
                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                      active ? 'text-white' : 'text-indigo-600'
                                    }`}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>

            <div>
              <label htmlFor="timeCommitment" className="block text-base font-medium text-gray-700">
                Time Commitment *
              </label>
              <div className="mt-2">
                <Listbox
                  value={formData.timeCommitment}
                  onChange={(value) => setFormData({ ...formData, timeCommitment: value })}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg border-2 border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base">
                      <span className="block truncate">{formData.timeCommitment}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {timeCommitments.map((commitment) => (
                          <Listbox.Option
                            key={commitment}
                            value={commitment}
                            className={({ active }) =>
                              `relative cursor-default select-none py-3 px-4 ${
                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                  {commitment}
                                </span>
                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                      active ? 'text-white' : 'text-indigo-600'
                                    }`}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>

            <div>
              <label htmlFor="startupType" className="block text-base font-medium text-gray-700">
                Startup Type *
              </label>
              <div className="mt-2">
                <Listbox
                  value={formData.startupType}
                  onChange={(value) => setFormData({ ...formData, startupType: value })}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg border-2 border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base">
                      <span className="block truncate">{formData.startupType}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {startupTypes.map((type) => (
                          <Listbox.Option
                            key={type}
                            value={type}
                            className={({ active }) =>
                              `relative cursor-default select-none py-3 px-4 ${
                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                  {type}
                                </span>
                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                      active ? 'text-white' : 'text-indigo-600'
                                    }`}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-base font-medium text-gray-700">
              Location *
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="e.g., Remote, San Francisco, CA, Hybrid - New York"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="hoursPerWeek" className="block text-base font-medium text-gray-700">
              Hours per Week *
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="hoursPerWeek"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="e.g., 40, 20-30, Flexible"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="compensation" className="block text-base font-medium text-gray-700">
              Compensation
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="compensation"
                name="compensation"
                value={formData.compensation || ''}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="e.g., $20-30/hour, $80k-100k/year, Equity Only"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">
              Skills *
            </label>
            <p className="mt-1 text-sm text-gray-500">
              List all skills relevant to the role
            </p>
            <div className="mt-4 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-3">
                <div className="sticky top-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Categories</p>
                  <nav className="space-y-1">
                    {Object.entries(skillCategories).map(([key, category]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                          selectedCategory === key
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="col-span-12 md:col-span-9">
                <div className="space-y-4">
                  <Combobox
                    value=""
                    onChange={(skill: string) => {
                      if (!formData.skills.includes(skill)) {
                        setFormData({ ...formData, skills: [...formData.skills, skill] });
                      }
                    }}
                  >
                    <div className="relative">
                      <Combobox.Input
                        className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={`Search ${selectedCategory ? skillCategories[selectedCategory].name : 'all'} skills...`}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </Combobox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                      >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {filteredSkills.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-3 px-4 text-gray-700">
                              Nothing found.
                            </div>
                          ) : (
                            filteredSkills.map((skill) => (
                              <Combobox.Option
                                key={skill}
                                value={skill}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-3 px-4 ${
                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                  }`
                                }
                              >
                                {({ active, selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                      {skill}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                          active ? 'text-white' : 'text-indigo-600'
                                        }`}
                                      >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>

                  <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-indigo-100 py-2 pl-4 pr-3 text-sm font-medium text-indigo-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              skills: formData.skills.filter((s) => s !== skill)
                            })
                          }
                          className="ml-2 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                        >
                          <span className="sr-only">Remove {skill}</span>
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-base font-medium text-gray-700">
              Job Description *
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={12}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="Provide a detailed description of the role, including:&#13;&#10;• Key responsibilities&#13;&#10;• Qualifications&#13;&#10;• What success looks like&#13;&#10;• Team structure&#13;&#10;• Benefits and perks&#13;&#10;• Application process"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="applicationFormUrl" className="block text-base font-medium text-gray-700">
              Application Form URL *
            </label>
            <div className="mt-2">
              <input
                type="url"
                id="applicationFormUrl"
                name="applicationFormUrl"
                value={formData.applicationFormUrl}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                placeholder="https://..."
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 bg-gray-50">
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Post Job
          </button>
        </div>
      </div>
    </form>
  );
} 