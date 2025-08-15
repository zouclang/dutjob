import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { jobService } from '@/lib/jobService';
import { toast } from 'sonner';

export default function JobPosting() {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    salaryRange: '',
    description: '',
    requirements: '',
    contactInfo: '',
    deadline: '',
    isAlumniEnterprise: false,
    posterId: ''
  });
  
  // Redirect if not authenticated or not a job poster
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!isAuthenticated || userRole !== 'job_poster' || !currentUser) {
      toast.error('您没有权限发布职位');
      navigate('/');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      posterId: currentUser.id
    }));
  }, [isAuthenticated, userRole, navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = '职位名称不能为空';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = '公司名称不能为空';
    }
    
     if (!formData.location.trim()) {
      newErrors.location = '工作地点不能为空';
    }
    
    if (!formData.jobType) {
      newErrors.jobType = '请选择职位类型';
    }
    
    if (!formData.salaryRange.trim()) {
      newErrors.salaryRange = '薪资范围不能为空';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '职位描述不能为空';
    }
    
    if (!formData.requirements.trim()) {
      newErrors.requirements = '任职要求不能为空';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = '联系方式不能为空';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = '请选择截止日期';
    } else {
      const deadline = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadline < today) {
        newErrors.deadline = '截止日期不能早于今天';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is modified
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      await jobService.createJob(formData);
      toast.success('职位发布成功！');
      navigate('/jobs');
    } catch (error) {
      toast.error('发布职位失败，请重试');
      console.error('Job creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If not authorized, show loading state
  if (!isAuthenticated || userRole !== 'job_poster') {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-center">
          <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">正在验证您的权限...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-800 text-white p-6">
          <h1 className="text-2xl font-bold">发布职位</h1>
          <p className="opacity-90 mt-1">填写以下信息，发布招聘职位</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">基本信息</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    职位名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                    placeholder="例如：前端开发工程师"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                
                {/* Company Name */}
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                    公司名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      errors.company ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                    placeholder="请输入公司名称"
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                  )}
                </div>
                
                 {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                    工作地点 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                    placeholder="请输入工作地点，例如：大连或远程"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>
                
                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="block text-gray-700 font-medium mb-2">
                    职位类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      errors.jobType ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                  >
                    <option value="">请选择职位类型</option>
                    <option value="全职">全职</option>
                    <option value="兼职">兼职</option>
                    <option value="实习">实习</option>
                    <option value="校招">校招</option>
                    <option value="社招">社招</option>
                  </select>
                  {errors.jobType && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
                  )}
                </div>
                
                 {/* Salary Range */}
                <div>
                  <label htmlFor="salaryRange" className="block text-gray-700 font-medium mb-2">
                    薪资范围 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="salaryRange"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      errors.salaryRange ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                    placeholder="请输入薪资范围，例如：15k-25k或面议"
                  />
                  {errors.salaryRange && (
                    <p className="text-red-500 text-sm mt-1">{errors.salaryRange}</p>
                  )}
                </div>
                
                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">
                    截止日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
                  )}
                </div>
              </div>
              
              {/* Alumni Enterprise Checkbox */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAlumniEnterprise"
                    checked={formData.isAlumniEnterprise}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">标记为校友企业</span>
                </label>
              </div>
            </section>
            
            {/* Job Details Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">职位详情</h2>
              
              {/* Job Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  职位描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                  placeholder="请详细描述职位职责、工作内容等"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              {/* Job Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-gray-700 font-medium mb-2">
                  任职要求 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    errors.requirements ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                  placeholder="请详细描述任职资格、技能要求等"
                ></textarea>
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
                )}
              </div>
            </section>
            
            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">联系方式</h2>
              
              <div>
                <label htmlFor="contactInfo" className="block text-gray-700 font-medium mb-2">
                  联系方式 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    errors.contactInfo ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                  placeholder="请输入邮箱或电话，求职者将通过此方式联系您"
                />
                {errors.contactInfo && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  <i class="fa-solid fa-info-circle mr-1"></i>
                  求职者将直接通过您提供的联系方式与您沟通
                </p>
              </div>
            </section>
            
            {/* Submit Section */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i class="fa-solid fa-spinner fa-spin mr-2"></i>发布中...
                  </>
                ) : (
                  '发布职位'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}