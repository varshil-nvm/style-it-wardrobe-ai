
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl text-styleit-500">Style It</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full" size="icon">
                  <Avatar>
                    <AvatarImage src={user.photo_url || ""} alt={user.display_name || "User"} />
                    <AvatarFallback className="bg-styleit-400 text-white">
                      {user.display_name ? user.display_name[0].toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="bg-styleit-400 hover:bg-styleit-500">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
