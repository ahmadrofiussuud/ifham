import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, BookOpen, BarChart2 } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Beranda', path: '/dashboard', icon: Home },
    { name: 'Chat AI', path: '/chat', icon: MessageSquare },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#00B4B4] font-black scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#EAF9F9] text-[#00B4B4]' : 'bg-transparent text-slate-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
