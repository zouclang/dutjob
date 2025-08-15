import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '@/lib/jobService';
import { Job } from '@/lib/jobTypes';
import { toast } from 'sonner';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (!id) {
      navigate('/jobs');
      return;
    }
    
    const loadJob = () => {
      try {
        setLoading(true);
        const foundJob = jobService.getJobById(id);
        
        if (!foundJob) {
          toast.error('职位不存在或已被删除');
          navigate('/jobs');
          return;
        }
        
        setJob(foundJob);
      } catch (error) {
        console.error('Failed to load job:', error);
        toast.error('加载职位详情失败');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    
    loadJob();
  }, [id, navigate]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Copy contact info to clipboard
  const copyContactInfo = () => {
    if (!job?.contactInfo) return;
    
    navigator.clipboard.writeText(job.contactInfo)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('联系方式已复制到剪贴板');
      })
      .catch(() => {
        toast.error('复制失败，请手动复制');
      });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>
    );
  }
  
  if (!job) {
    return null; // Will navigate away in useEffect
  }
  
  const isExpired = jobService.isJobExpired(job);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Job Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                {isExpired && (
                  <span className="ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    已过期
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-lg font-medium">{job.company}</span>
                {job.isAlumniEnterprise && (
                  <span className="ml-3 bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                    校友企业
                  </span>
                )}
              </div>
            </div>
            <Link 
              to="/jobs" 
              className="mt-4 md:mt-0 inline-flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <i class="fa-solid fa-arrow-left mr-1"></i> 返回职位列表
            </Link>
          </div>
        </div>
        
        {/* Job Info */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-gray-700 mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <i class="fa-solid fa-map-marker-alt"></i>
              </div>
              <div>
                <div className="text-gray-500 text-xs md:text-sm">工作地点</div>
                <div className="font-medium">{job.location}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <i class="fa-solid fa-briefcase"></i>
              </div>
              <div>
                <div className="text-gray-500 text-xs md:text-sm">职位类型</div>
                <div className="font-medium">{job.jobType}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <i class="fa-solid fa-money-bill-wave"></i>
              </div>
              <div>
                <div className="text-gray-500 text-xs md:text-sm">薪资范围</div>
                <div className="font-medium">{job.salaryRange}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <i class="fa-solid fa-calendar-alt"></i>
              </div>
              <div>
                <div className="text-gray-500 text-xs md:text-sm">截止日期</div>
                <div className="font-medium">{formatDate(job.deadline)}</div>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-blue-50 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">联系方式</h3>
                <p className="text-sm text-gray-600 mt-1">
                  请通过以下方式联系招聘方
                </p>
              </div>
              <button
                onClick={copyContactInfo}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                {copied ? (
                  <>
                    <i class="fa-solid fa-check mr-2"></i> 已复制
                  </>
                ) : (
                  <>
                    <i class="fa-solid fa-copy mr-2"></i> 复制联系方式
                  </>
                )}
              </button>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4 font-mono text-sm break-all">
              {job.contactInfo}
            </div>
          </div>
          
          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">职位描述</h2>
            <div className="prose max-w-none text-gray-700">
              {job.description.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index} className="mb-3">{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
          
          {/* Job Requirements */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">任职要求</h2>
            <div className="prose max-w-none text-gray-700">
              {job.requirements.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index} className="mb-3">{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
          
          {/* Apply Section */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 sm:mb-0">
              发布于: {formatDate(job.postedDate)}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={copyContactInfo}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <i class="fa-solid fa-copy mr-2"></i> 复制联系方式
              </button>
              <Link 
                to="/jobs" 
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                查看更多职位
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}