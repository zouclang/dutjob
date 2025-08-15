import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

// Mock login service
const authService = {
  login: (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    // Store user info in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role
    }));
    
    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    try {
      setIsLoading(true);
      const user = await authService.login(username, password);
      setIsAuthenticated(true, user.role);
      toast.success(`欢迎回来，${user.username}！`);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('登录失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-800 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">账号登录</h1>
          <p className="opacity-90 mt-1">欢迎回到大工校友就业平台</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <i class="fa-solid fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  placeholder="请输入密码"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>登录中...
                </>
              ) : (
                '登录账号'
              )}
            </button>
            
            {/* Register Link */}
            <div className="mt-6 text-center text-gray-600">
              没有账号？{' '}
              <Link to="/register" className="text-blue-700 hover:text-blue-800 font-medium">
                立即注册
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}