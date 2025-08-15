import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

export default function Navbar() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  
  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i class="fa-solid fa-briefcase text-xl"></i>
          <Link to="/" className="text-xl font-bold">大工校友就业平台</Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/jobs" className="hover:text-blue-200 transition-colors">
            <i class="fa-solid fa-search mr-1"></i>职位搜索
          </Link>
          
          {isAuthenticated ? (
            <>
              {userRole === 'job_poster' && (
                <Link to="/post-job" className="hover:text-blue-200 transition-colors">
                  <i class="fa-solid fa-plus-circle mr-1"></i>发布职位
                </Link>
              )}
              
              <button 
                onClick={logout}
                className="hover:text-blue-200 transition-colors"
              >
                <i class="fa-solid fa-sign-out-alt mr-1"></i>退出登录
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                <i class="fa-solid fa-user mr-1"></i>登录
              </Link>
              <Link 
                to="/register" 
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md transition-colors"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}