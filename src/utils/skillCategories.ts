interface SkillCategory {
  name: string;
  skills: Record<string, string[]>;
}

export const skillCategories: Record<string, SkillCategory> = {
  technicalSkills: {
    name: 'Technical Skills',
    skills: {
      'frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Gatsby', 'Redux', 'WebGL', 'Three.js', 'Responsive Design', 'Web Performance'],
      'backend': ['Node.js', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'System Design', 'API Design'],
      'mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Mobile UI/UX', 'App Store Optimization', 'Push Notifications', 'Mobile Security'],
      'ai_ml': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Computer Vision', 'NLP', 'Deep Learning', 'Machine Learning', 'Data Science', 'Neural Networks', 'AI Ethics', 'MLOps', 'Data Mining'],
      'web3': ['Solidity', 'Smart Contracts', 'Ethereum', 'Web3.js', 'Blockchain', 'DeFi', 'NFTs', 'Crypto Wallets', 'Token Economics', 'Zero Knowledge Proofs', 'Layer 2 Solutions'],
      'devops': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Infrastructure as Code', 'Cloud Architecture', 'Monitoring', 'Security', 'DevSecOps', 'Site Reliability Engineering'],
      'nocode': ['Bubble', 'Webflow', 'Zapier', 'Airtable', 'Notion', 'Retool', 'Adalo', 'Glide', 'AppSheet', 'Internal Tools'],
      'data': ['SQL', 'Python', 'R', 'Data Analysis', 'Data Visualization', 'Business Intelligence', 'ETL', 'Data Warehousing', 'Big Data', 'Data Engineering', 'Analytics']
    }
  },
  businessSkills: {
    name: 'Business & Strategy',
    skills: {
      'venture_capital': ['Financial Modeling', 'Due Diligence', 'Market Analysis', 'Pitch Deck Creation', 'Term Sheets', 'Cap Table Management', 'Portfolio Management', 'Investment Thesis'],
      'operations': ['Project Management', 'Process Optimization', 'Team Management', 'Strategic Planning', 'OKRs', 'Resource Allocation', 'Risk Management', 'Change Management'],
      'finance': ['Financial Analysis', 'Budgeting', 'Forecasting', 'Accounting', 'Fundraising', 'Valuation', 'Unit Economics', 'Financial Planning', 'Treasury Management'],
      'sales': ['B2B Sales', 'Sales Strategy', 'Lead Generation', 'Account Management', 'Sales Operations', 'CRM Management', 'Pipeline Development', 'Contract Negotiation'],
      'strategy': ['Business Strategy', 'Go-to-Market', 'Market Research', 'Competitive Analysis', 'Business Development', 'Strategic Partnerships', 'Growth Strategy'],
      'legal': ['Contract Law', 'IP Law', 'Corporate Law', 'Regulatory Compliance', 'Privacy Law', 'Employment Law', 'Legal Operations']
    }
  },
  marketingSkills: {
    name: 'Marketing & Growth',
    skills: {
      'digital_marketing': ['SEO', 'Content Marketing', 'Email Marketing', 'Social Media Marketing', 'Marketing Analytics', 'Marketing Automation', 'Growth Marketing', 'Conversion Optimization'],
      'paid_marketing': ['Google Ads', 'Facebook Ads', 'PPC', 'Performance Marketing', 'Media Buying', 'Programmatic Advertising', 'Attribution Modeling', 'Ad Operations'],
      'content': ['Content Strategy', 'Copywriting', 'Brand Strategy', 'Content Creation', 'Editorial Planning', 'Content Distribution', 'Storytelling', 'Technical Writing'],
      'community': ['Community Management', 'Discord', 'Social Media Management', 'Community Building', 'Moderation', 'Event Planning', 'User Engagement', 'Ambassador Programs'],
      'brand': ['Brand Strategy', 'Brand Identity', 'Brand Guidelines', 'Brand Voice', 'Brand Marketing', 'Brand Partnerships', 'Reputation Management'],
      'analytics': ['Web Analytics', 'Marketing Analytics', 'Data Analysis', 'A/B Testing', 'User Research', 'Attribution Modeling', 'Reporting', 'Dashboard Creation']
    }
  },
  productSkills: {
    name: 'Product & Design',
    skills: {
      'design': ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Product Design', 'Design Systems', 'Interaction Design', 'Visual Design', 'Prototyping', 'User Testing'],
      'product': ['Product Management', 'Product Strategy', 'User Research', 'Agile', 'Product Analytics', 'Feature Prioritization', 'Product Marketing', 'Product Operations'],
      'graphic_design': ['Graphic Design', 'Brand Design', 'Visual Design', 'Logo Design', 'Typography', 'Color Theory', 'Print Design', 'Digital Design'],
      'research': ['User Research', 'Market Research', 'Usability Testing', 'Customer Interviews', 'Data Analysis', 'Research Synthesis', 'Journey Mapping'],
      'ux_writing': ['UX Writing', 'Content Design', 'Information Architecture', 'Content Strategy', 'Microcopy', 'Documentation', 'Style Guides']
    }
  },
  hardSkills: {
    name: 'Hard Skills',
    skills: {
      'analytics': ['SQL', 'Python', 'R', 'Excel', 'Tableau', 'Power BI', 'Data Visualization', 'Statistical Analysis'],
      'tools': ['Jira', 'Confluence', 'Notion', 'Asana', 'Monday.com', 'Slack', 'G Suite', 'Microsoft Office'],
      'languages': ['English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic', 'French', 'German', 'Japanese'],
      'certifications': ['PMP', 'Scrum Master', 'AWS Certified', 'CFA', 'Six Sigma', 'CISSP', 'Google Analytics']
    }
  },
  softSkills: {
    name: 'Soft Skills',
    skills: {
      'leadership': ['Team Leadership', 'Mentoring', 'Decision Making', 'Strategic Thinking', 'Conflict Resolution', 'Change Management'],
      'communication': ['Public Speaking', 'Written Communication', 'Presentation Skills', 'Negotiation', 'Cross-cultural Communication'],
      'collaboration': ['Team Collaboration', 'Cross-functional Leadership', 'Stakeholder Management', 'Remote Work', 'Cultural Awareness'],
      'personal': ['Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity', 'Emotional Intelligence']
    }
  }
}; 