
import AuthGuard from "@/components/auth/AuthGuard";
import MainLayout from "@/components/layout/MainLayout";
import OutfitRecommendation from "@/components/ai/OutfitRecommendation";
import LaundryNotifications from "@/components/ai/LaundryNotifications";
import ProductRecommendations from "@/components/ai/ProductRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shirt, Calendar, Pants, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  totalItems: number;
  totalOutfits: number;
  dirtyItems: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalItems: 0,
    totalOutfits: 0,
    dirtyItems: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Get wardrobe items count
        const { count: itemsCount, error: itemsError } = await supabase
          .from('wardrobe_items')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (itemsError) throw itemsError;
        
        // Get outfits count
        const { count: outfitsCount, error: outfitsError } = await supabase
          .from('outfits')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (outfitsError) throw outfitsError;
        
        // Get dirty items count
        const { count: dirtyCount, error: dirtyError } = await supabase
          .from('wardrobe_items')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_dirty', true);
          
        if (dirtyError) throw dirtyError;
        
        setData({
          totalItems: itemsCount || 0,
          totalOutfits: outfitsCount || 0,
          dirtyItems: dirtyCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Could not load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, toast]);

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader className="h-8 w-8 animate-spin mb-2 text-styleit-400" />
                <p className="text-muted-foreground">Loading your data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Wardrobe Items
                    </CardTitle>
                    <Shirt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.totalItems}</div>
                    <p className="text-xs text-muted-foreground">
                      Items in your wardrobe
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Outfits
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.totalOutfits}</div>
                    <p className="text-xs text-muted-foreground">
                      Created outfits
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Laundry Status
                    </CardTitle>
                    <Pants className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.dirtyItems}</div>
                    <p className="text-xs text-muted-foreground">
                      Items need washing
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="recommendations" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
                  <TabsTrigger value="laundry">Laundry Assistant</TabsTrigger>
                  <TabsTrigger value="shopping">Shopping</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendations">
                  <OutfitRecommendation />
                </TabsContent>
                
                <TabsContent value="laundry">
                  <LaundryNotifications />
                </TabsContent>
                
                <TabsContent value="shopping">
                  <ProductRecommendations />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Dashboard;
