import { Job, JobFilterOptions } from './jobTypes';

// Mock data service for job postings
export const jobService = {
  // Get all jobs with optional filtering
  getJobs: (filters?: JobFilterOptions): Job[] => {
    const storedJobs = localStorage.getItem('jobs');
    const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
    
    // Filter jobs if filters are provided
    if (filters) {
      return jobs.filter(job => {
        if (filters.jobType && job.jobType !== filters.jobType) return false;
        if (filters.location && job.location !== filters.location) return false;
        if (filters.isAlumniEnterprise !== undefined && job.isAlumniEnterprise !== filters.isAlumniEnterprise) return false;
        
        // Filter by deadline if specified
        if (filters.deadline) {
          const today = new Date();
          const deadline = new Date(job.deadline);
          const isExpired = deadline < today;
          
          // If filter is "active", show only non-expired jobs
          if (filters.deadline === "active" && isExpired) return false;
          // If filter is "expired", show only expired jobs
          if (filters.deadline === "expired" && !isExpired) return false;
        }
        
        return true;
      });
    }
    
    return jobs;
  },
  
  // Get a single job by ID
  getJobById: (id: string): Job | undefined => {
    const jobs = jobService.getJobs();
    return jobs.find(job => job.id === id);
  },
  
  // Create a new job posting
  createJob: (jobData: Omit<Job, 'id' | 'postedDate'>): Job => {
    const jobs = jobService.getJobs();
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString()
    };
    
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    return newJob;
  },
  
  // Check if a job is expired
  isJobExpired: (job: Job): boolean => {
    const today = new Date();
    const deadline = new Date(job.deadline);
    return deadline < today;
  }
};