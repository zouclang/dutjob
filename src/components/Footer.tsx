export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <i class="fa-solid fa-briefcase text-xl mr-2"></i>
              <span className="text-xl font-bold">大工校友就业平台</span>
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center md:text-left">
              连接大连理工校友，促进职业发展
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} 大连理工大学校友会
            </p>
            <p className="text-gray-500 text-xs mt-1">
              校友互助 · 职业发展 · 人才交流
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}