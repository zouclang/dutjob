export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange: string;
  description: string;
  requirements: string;
  contactInfo: string;
  deadline: string;
  isAlumniEnterprise: boolean;
  postedDate: string;
  posterId: string;
}

export type JobFilterOptions = {
  jobType?: string;
  location?: string;
  deadline?: string;
  isAlumniEnterprise?: boolean;
};