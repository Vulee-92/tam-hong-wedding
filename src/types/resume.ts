export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    youtube: string;
  };
  achievements: Array<{
    title: string;
    highlight: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    period: string;
    description: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
} 