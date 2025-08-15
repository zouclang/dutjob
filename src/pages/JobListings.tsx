import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '@/lib/jobService';
import { Job, JobFilterOptions } from '@/lib/jobTypes';
import { Empty } from '@/components/Empty';

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilterOptions>({});
  
  // Load jobs on component mount
  useEffect(() => {
    const loadJobs = () => {
      try {
        setLoading(true);
        const allJobs = jobService.getJobs();
        setJobs(allJobs);
        setFilteredJobs(allJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobs();
    
    // Set up refresh on storage change (when new jobs are added)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jobs') {
        loadJobs();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Apply filters when filters change
  useEffect(() => {
    const results = jobService.getJobs(filters);
    setFilteredJobs(results);
  }, [filters]);
  
  const handleFilterChange = (key: keyof JobFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get filter count for display
  const getFilterCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof JobFilterOptions] !== undefined && filters[key as keyof JobFilterOptions] !== null).length;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">职位列表</h1>
          <p className="text-gray-500 mt-1">
            找到 {filteredJobs.length} 个职位
            {getFilterCount() > 0 && (
              <>
                {' '}（已应用 {getFilterCount()} 个筛选条件）
                <button 
                  onClick={clearFilters}
                  className="text-blue-700 text-sm ml-2 hover:underline"
                >
                  清除筛选
                </button>
              </>
            )}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">职位筛选</h2>
            
            {/* Job Type Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">职位类型</h3>
              <div className="space-y-2">
                {['全职', '兼职', '实习', '校招', '社招'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="jobType"
                      checked={filters.jobType === type}
                      onChange={() => handleFilterChange('jobType', filters.jobType === type ? undefined : type)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Location Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">工作地点</h3>
              <div className="space-y-2">
                {['大连', '北京', '上海', '广州', '深圳', '杭州', '成都', '远程'].map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="radio"
                      name="location"
                      checked={filters.location === location}
                      onChange={() => handleFilterChange('location', filters.location === location ? undefined : location)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Deadline Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">截止日期</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deadline"
                    checked={filters.deadline === 'active'}
                    onChange={() => handleFilterChange('deadline', filters.deadline === 'active' ? undefined : 'active')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">仅显示未过期</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deadline"
                    checked={filters.deadline === 'expired'}
                    onChange={() => handleFilterChange('deadline', filters.deadline === 'expired' ? undefined : 'expired')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">仅显示已过期</span>
                </label>
              </div>
            </div>
            
            {/* Alumni Enterprise Filter */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.isAlumniEnterprise === true}
                  onChange={() => handleFilterChange(
                    'isAlumniEnterprise', 
                    filters.isAlumniEnterprise === true ? undefined : true
                  )}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">仅显示校友企业</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Job Listings */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Empty />
              <p className="mt-4 text-gray-500">没有找到符合条件的职位</p>
              {getFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-700 hover:text-blue-800 font-medium"
                >
                  <i class="fa-solid fa-filter-circle-xmark mr-1"></i>清除所有筛选条件
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map(job => {
                const isExpired = jobService.isJobExpired(job);
                
                return (
                  <div 
                    key={job.id} 
                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg ${
                      isExpired ? 'opacity-70' : 'hover:-translate-y-1'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 hover:text-blue-700 transition-colors">
                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                          </h2>
                          <div className="flex items-center mt-1"><span className="text-gray-700 font-medium">{job.company}</span>
                            {job.isAlumniEnterprise && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                校友企业
                              </span>
                            )}
                          </div>
                        </div>
                        {isExpired && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            已过期
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <i class="fa-solid fa-map-marker-alt mr-1 text-gray-400"></i>
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <i class="fa-solid fa-briefcase mr-1 text-gray-400"></i>
                          {job.jobType}
                        </div>
                        <div className="flex items-center">
                          <i class="fa-solid fa-money-bill-wave mr-1 text-gray-400"></i>
                          {job.salaryRange}
                        </div>
                        <div className="flex items-center">
                          <i class="fa-solid fa-calendar-alt mr-1 text-gray-400"></i>
                          截止: {formatDate(job.deadline)}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          发布于: {formatDate(job.postedDate)}
                        </div>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="text-blue-700 hover:text-blue-800 font-medium flex items-center"
                        >
                          查看详情 <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}