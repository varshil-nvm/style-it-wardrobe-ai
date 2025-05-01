
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Home, Search, Settings, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { title: "Dashboard", icon: Home, url: "/" },
    { title: "Wardrobe", icon: ShoppingBag, url: "/wardrobe" },
    { title: "Outfits", icon: Calendar, url: "/outfits" },
    { title: "Favorites", icon: Heart, url: "/favorites" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarComponent>
      <SidebarContent>
        <div className="py-4 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-styleit-500">Style It</span>
          </Link>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item.url) && "bg-styleit-100 text-styleit-700"
                  )}>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(
                  isActive("/profile") && "bg-styleit-100 text-styleit-700"
                )}>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(
                  isActive("/settings") && "bg-styleit-100 text-styleit-700"
                )}>
                  <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 py-2">
        {user ? (
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="rounded-full bg-styleit-100 p-1">
              <User className="h-5 w-5 text-styleit-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.displayName || "User"}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2">
            <Button asChild className="w-full bg-styleit-400 hover:bg-styleit-500">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
