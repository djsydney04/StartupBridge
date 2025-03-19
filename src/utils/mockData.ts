import { skillCategories } from './skillCategories';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  detailedDescription: string;
  skills: string[];
  skillCategories: string[];
  hoursPerWeek: string;
  compensation?: string;
  companyStage: string;
  companySize: string;
  timeCommitment: string;
  startupType: string;
  applicationFormUrl: string;
  postedDate: string;
}

// Helper function to get random skills from categories
const getRandomSkills = (count: number): string[] => {
  const allSkills: string[] = [];
  Object.values(skillCategories).forEach(category => {
    Object.values(category.skills).forEach(skillArray => {
      allSkills.push(...skillArray);
    });
  });
  
  const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechStartup',
    location: 'Remote',
    description: 'We are seeking a talented frontend developer to join our team...',
    detailedDescription: 'We are seeking a talented frontend developer to join our team to help build innovative web applications. You will work closely with our design and backend teams to create responsive and performant user interfaces.',
    skills: getRandomSkills(5),
    skillCategories: ['technicalSkills'],
    hoursPerWeek: '40',
    compensation: '$80k-100k/year',
    companyStage: 'Seed',
    companySize: '11-50 employees',
    timeCommitment: 'Full-time',
    startupType: 'B2B',
    applicationFormUrl: 'https://example.com/apply',
    postedDate: '2024-03-15',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'San Francisco, CA',
    description: 'Looking for an experienced product manager to lead our core product initiatives...',
    detailedDescription: 'Looking for an experienced product manager to lead our core product initiatives. You will be responsible for defining product strategy, gathering requirements, and working with engineering teams to deliver features.',
    skills: getRandomSkills(6),
    skillCategories: ['productSkills'],
    hoursPerWeek: '40',
    compensation: '$120k-150k/year',
    companyStage: 'Series A',
    companySize: '51-200 employees',
    timeCommitment: 'Full-time',
    startupType: 'SaaS',
    applicationFormUrl: 'https://example.com/apply',
    postedDate: '2024-03-14',
  },
  {
    id: '3',
    title: 'Growth Marketing Manager',
    company: 'FinTech Solutions',
    location: 'New York, NY',
    description: 'Join our marketing team to drive user acquisition and growth...',
    detailedDescription: 'Join our marketing team to drive user acquisition and growth through data-driven marketing strategies. You will own our growth metrics and implement various marketing campaigns.',
    skills: getRandomSkills(4),
    skillCategories: ['marketingSkills'],
    hoursPerWeek: '40',
    compensation: '$90k-110k/year',
    companyStage: 'Series B',
    companySize: '201-500 employees',
    timeCommitment: 'Full-time',
    startupType: 'Fintech',
    applicationFormUrl: 'https://example.com/apply',
    postedDate: '2024-03-13',
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'HealthTech',
    location: 'Remote',
    description: 'Looking for a full stack developer to help build our healthcare platform...',
    detailedDescription: 'Looking for a full stack developer to help build our healthcare platform. You will work on both frontend and backend development, implementing new features and maintaining existing ones.',
    skills: getRandomSkills(7),
    skillCategories: ['technicalSkills'],
    hoursPerWeek: '30',
    compensation: '$60-80/hour',
    companyStage: 'Seed',
    companySize: '11-50 employees',
    timeCommitment: 'Contract',
    startupType: 'Healthcare',
    applicationFormUrl: 'https://example.com/apply',
    postedDate: '2024-03-12',
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'EdTech Innovators',
    location: 'Boston, MA',
    description: 'Join us in creating beautiful and intuitive educational experiences...',
    detailedDescription: 'Join us in creating beautiful and intuitive educational experiences. You will be responsible for designing user interfaces and experiences that make learning more engaging and effective.',
    skills: getRandomSkills(5),
    skillCategories: ['productSkills'],
    hoursPerWeek: '20',
    compensation: '$50-70/hour',
    companyStage: 'Pre-seed',
    companySize: '1-10 employees',
    timeCommitment: 'Part-time',
    startupType: 'EdTech',
    applicationFormUrl: 'https://example.com/apply',
    postedDate: '2024-03-11',
  },
]; 