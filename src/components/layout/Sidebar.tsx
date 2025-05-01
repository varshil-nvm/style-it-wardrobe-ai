
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  UserRound,
  Heart,
  Menu,
  X,
  ShirtIcon,
  Glasses,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const { isMobile } = useMobile();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      name: "Wardrobe",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/wardrobe",
    },
    {
      name: "Outfits",
      icon: <ShirtIcon className="h-5 w-5" />,
      path: "/outfits",
    },
    {
      name: "Virtual Try-On",
      icon: <Glasses className="h-5 w-5" />,
      path: "/try-on",
    },
    {
      name: "Favorites",
      icon: <Heart className="h-5 w-5" />,
      path: "/favorites",
    },
    {
      name: "Profile",
      icon: <UserRound className="h-5 w-5" />,
      path: "/profile",
    },
  ];

  // Mobile toggle button
  const MobileMenuButton = () => (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="z-50 fixed bottom-4 right-4 rounded-full h-12 w-12 bg-styleit-100 shadow-lg border border-styleit-200 md:hidden"
    >
      {isSidebarOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );

  const handleLogout = async () => {
    await logout();
  };

  // Sidebar content component - shared between mobile and desktop
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="flex items-center justify-center mb-6 px-4">
        <Link to="/dashboard" onClick={closeSidebar}>
          <h1 className="text-2xl font-bold">Style It</h1>
        </Link>
      </div>

      {user && (
        <div className="px-4 mb-6">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.photo_url || undefined} />
              <AvatarFallback>
                {user.display_name?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.display_name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <Separator className="mb-4" />

      <nav className="space-y-1 px-3 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            onClick={closeSidebar}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1",
                location.pathname === item.path
                  ? "bg-styleit-100 text-styleit-800 hover:bg-styleit-200"
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="px-3 mt-6">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  // Render sidebar based on screen size
  return (
    <>
      {isMobile ? (
        <>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <MobileMenuButton />
        </>
      ) : (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
