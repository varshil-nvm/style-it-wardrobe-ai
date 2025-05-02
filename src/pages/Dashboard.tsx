import { LayoutDashboard, ShoppingBag, ShirtIcon, CalendarIcon, Heart, UserRound } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";

const Dashboard = () => {
  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Overview</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Quick summary of your account.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Wardrobe</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your clothing items.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ShirtIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Outfits</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Plan and create your outfits.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Calendar</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Schedule your outfits.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Favorites</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your favorite items and outfits.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserRound className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Profile</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your profile settings.
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Dashboard;
