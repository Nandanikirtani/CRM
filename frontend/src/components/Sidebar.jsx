import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  GraduationCap,
  DollarSign,
  Bell,
  Settings,
  Menu,
  X
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Students", icon: Users, path: "/students" },
  { name: "Fees", icon: CreditCard, path: "/fees" },
  { name: "Teachers", icon: GraduationCap, path: "/teachers" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // close mobile sidebar when switching to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* 📱 Mobile Top Bar */}
      {!isDesktop && (
        <div className="flex items-center justify-between p-4 bg-[#0B1A2B] text-white fixed top-0 left-0 right-0 z-40">
          <h1 className="font-semibold">SM</h1>
          <Menu
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      {/* Overlay (mobile only) */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isDesktop ? 0 : isOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="fixed top-0 left-0 h-screen w-64 bg-[#0B1A2B] text-white z-50 shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center">
              SM
            </div>
            <span className="font-semibold">Study Marathon</span>
          </div>

          {!isDesktop && (
            <X
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>

        {/* Scrollable Menu ONLY */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate(item.path);
                  if (!isDesktop) setIsOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white/10"
                  }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Profile (Fixed) */}
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center">
            HK
          </div>
          <div>
            <p className="text-sm font-medium">Harshita Kirtani</p>
            <p className="text-xs text-gray-400">
              studymarathon99@gmail.com
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}