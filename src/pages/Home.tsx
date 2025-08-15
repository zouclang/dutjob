import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

export default function Home() {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl p-8 md:p-12 mb-12 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">大连理工校友就业平台</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            连接校友，共创职业未来
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/jobs" 
              className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-blue-50 transition-colors"
            >
              <i class="fa-solid fa-search mr-2"></i>寻找职位
            </Link>
            
            {isAuthenticated ? (
              userRole === 'job_poster' ? (
                <Link 
                  to="/post-job" 
                  className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-yellow-600 transition-colors"
                >
                  <i class="fa-solid fa-plus-circle mr-2"></i>发布职位
                </Link>
              ) : null
            ) : (
              <Link 
                to="/register" 
                className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-yellow-600 transition-colors"
              >
                <i class="fa-solid fa-user-plus mr-2"></i>立即注册
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">平台特色</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-handshake text-blue-800 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">校友互助</h3>
            <p className="text-gray-600">
              专为大连理工校友打造，促进校友间的职业互助与资源共享
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-briefcase text-blue-800 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">职位发布</h3>
            <p className="text-gray-600">
              企业用户可便捷发布职位信息，标记校友企业身份，吸引优秀人才
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-filter text-blue-800 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">精准筛选</h3>
            <p className="text-gray-600">
              多维度筛选功能，快速找到符合您需求的理想职位
            </p>
          </div>
        </div>
      </section>
      
       {/* Role-specific Dashboard Section */}
       <section className="bg-gray-50 rounded-2xl p-8 mb-12">
         {isAuthenticated ? (
           userRole === 'job_seeker' ? (
             <div>
               <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                 <i class="fa-solid fa-user-graduate text-blue-600 mr-3"></i>求职者中心
               </h2>
               <div className="grid md:grid-cols-2 gap-6 items-center">
                 <div>
                   <p className="text-lg text-gray-700 mb-6">
                     探索校友企业职位机会，连接大工校友网络，开启您的职业发展新旅程。
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Link 
                       to="/jobs" 
                       className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors text-center"
                     >
                       <i class="fa-solid fa-search mr-2"></i>浏览职位
                     </Link>
                     <Link 
                       to="/jobs?isAlumniEnterprise=true" 
                       className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors text-center"
                     >
                       <i class="fa-solid fa-handshake mr-2"></i>校友企业职位
                     </Link>
                   </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                   <h3 className="font-semibold text-gray-800 mb-4">求职小贴士</h3>
                   <ul className="space-y-3 text-gray-700">
                     <li className="flex items-start">
                       <i class="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                       <span>关注截止日期，及时投递简历</span>
                     </li>
                     <li className="flex items-start">
                       <i class="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                       <span>优先考虑校友企业，校友网络助力职业发展</span>
                     </li>
                     <li className="flex items-start">
                       <i class="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                       <span>通过职位提供的联系方式直接与招聘方沟通</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>
           ) : (
             <div>
               <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                 <i class="fa-solid fa-building text-blue-600 mr-3"></i>企业招聘中心
               </h2>
               <div className="grid md:grid-cols-2 gap-6 items-center">
                 <div>
                   <p className="text-lg text-gray-700 mb-6">
                     发布职位信息，吸引大连理工优秀校友人才，助力企业发展。标记校友企业身份，增强信任感和吸引力。
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Link 
                       to="/post-job" 
                       className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors text-center"
                     >
                       <i class="fa-solid fa-plus-circle mr-2"></i>发布新职位
                     </Link>
                     <Link 
                       to="/jobs" 
                       className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors text-center"
                     >
                       <i class="fa-solid fa-eye mr-2"></i>查看已发布职位
                     </Link>
                   </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                   <h3 className="font-semibold text-gray-800 mb-4">招聘小贴士</h3>
                   <ul className="space-y-3 text-gray-700">
                     <li className="flex items-start">
                       <i class="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                       <span>详细描述职位职责和要求，吸引合适的候选人</span>
                     </li>
                     <li className="flex items-start">
                       <i class="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                       <span>设置合理的截止日期，及时处理应聘信息</span>
                     </li>
                     <li className="flex items-start">
                       <i class="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                       <span>标记"校友企业"可提高职位吸引力和可信度</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>
           )
         ) : (
           <div className="text-center">
             <h2 className="text-2xl font-bold mb-4 text-gray-800">准备好开始您的职业之旅了吗？</h2>
             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
               <Link 
                 to="/register" 
                 className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors"
               >
                 <i class="fa-solid fa-user-plus mr-2"></i>立即注册
               </Link>
               <Link 
                 to="/login" 
                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors"
               >
                 <i class="fa-solid fa-sign-in-alt mr-2"></i>登录账号
               </Link>
             </div>
           </div>
         )}
       </section>
    </div>
  );
}