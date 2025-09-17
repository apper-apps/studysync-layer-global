import React, { useState, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { AuthContext } from "../../App";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" }
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) => cn(
        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        mobile && "justify-center lg:justify-start"
      )}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
    >
      <ApperIcon name={item.icon} size={20} className="mr-3" />
      <span className={mobile ? "lg:block" : ""}>{item.name}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="GraduationCap" size={20} className="text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  StudySync
                </h1>
                <p className="text-xs text-gray-500">Student Management</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          
<div className="p-4 border-t border-gray-200 space-y-3">
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ApperIcon name="LogOut" size={16} className="mr-2" />
              Logout
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Academic Year 2024-25
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 translate-x-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={20} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      StudySync
                    </h1>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>
            
            <nav className="px-4 pb-4 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} mobile />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-md flex items-center justify-center mr-2">
                <ApperIcon name="GraduationCap" size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                StudySync
              </h1>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;