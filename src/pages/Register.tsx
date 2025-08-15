import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

// Mock user registration service
const userService = {
  register: (username: string, password: string, role: 'job_seeker' | 'job_poster') => {
    // In a real application, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some((user: any) => user.username === username)) {
      throw new Error('用户名已存在');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // In real app, this should be hashed
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }
};

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState<'job_seeker' | 'job_poster'>('job_seeker');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = '用户名不能为空';
    }
    
    if (!password) {
      newErrors.password = '密码不能为空';
    } else if (password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次密码输入不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      await userService.register(username, password, userRole);
      toast.success('注册成功！请登录');
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('注册失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-800 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">创建账号</h1>
          <p className="opacity-90 mt-1">加入大工校友就业平台</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* User Role Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">选择用户身份</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    userRole === 'job_seeker' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setUserRole('job_seeker')}
                >
                  <div className="flex items-center justify-center mb-2">
                    <i class={`fa-solid fa-user-circle text-2xl ${
                      userRole === 'job_seeker' ? 'text-blue-600' : 'text-gray-400'
                    }`}></i>
                  </div>
                  <div className="text-center font-medium">
                    个人求职者
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    userRole === 'job_poster' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setUserRole('job_poster')}
                >
                  <div className="flex items-center justify-center mb-2">
                    <i class={`fa-solid fa-building text-2xl ${
                      userRole === 'job_poster' ? 'text-blue-600' : 'text-gray-400'
                    }`}></i>
                  </div>
                  <div className="text-center font-medium">
                    职位发布者
                  </div>
                </div>
              </div>
            </div>
            
            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                用户名
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i class="fa-solid fa-user"></i>
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.username 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                  placeholder="请输入用户名"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                密码
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i class="fa-solid fa-lock"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                  placeholder="请输入密码"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                确认密码
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i class="fa-solid fa-lock"></i>
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                  placeholder="请再次输入密码"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>处理中...
                </>
              ) : (
                '注册账号'
              )}
            </button>
            
            {/* Login Link */}
            <div className="mt-6 text-center text-gray-600">
              已有账号？{' '}
              <Link to="/login" className="text-blue-700 hover:text-blue-800 font-medium">
                立即登录
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}