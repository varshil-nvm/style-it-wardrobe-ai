
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { Calendar as CalendarIcon, Plus, ShoppingBag, CircleMinus } from "lucide-react";
import { format } from "date-fns";

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  size: string;
  brand: string;
  tags: string[];
  imageUrl: string;
  timesWorn: number;
  lastWashed: string | null;
  isDirty: boolean;
}

interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  date?: Date;
  notes?: string;
  favorite: boolean;
}

const defaultImageUrl = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [dirtyItems, setDirtyItems] = useState<ClothingItem[]>([]);
  const [todayOutfit, setTodayOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const storedItems = localStorage.getItem(`wardrobe_${user.id}`);
    if (storedItems) {
      const items = JSON.parse(storedItems);
      setWardrobeItems(items);
      
      // Filter out dirty items
      const dirty = items.filter((item: ClothingItem) => item.isDirty);
      setDirtyItems(dirty);
    }
    
    const storedOutfits = localStorage.getItem(`outfits_${user.id}`);
    if (storedOutfits) {
      const outfits = JSON.parse(storedOutfits);
      setOutfits(outfits);
      
      // Find today's outfit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaysOutfit = outfits.find((outfit: Outfit) => {
        if (!outfit.date) return false;
        const outfitDate = new Date(outfit.date);
        outfitDate.setHours(0, 0, 0, 0);
        return outfitDate.getTime() === today.getTime();
      });
      
      if (todaysOutfit) {
        setTodayOutfit(todaysOutfit);
      }
    }
  }, [user]);
  
  const handleMarkClean = (itemId: string) => {
    const updatedItems = wardrobeItems.map((item) =>
      item.id === itemId ? { ...item, isDirty: false } : item
    );
    
    setWardrobeItems(updatedItems);
    setDirtyItems(updatedItems.filter(item => item.isDirty));
    
    if (user) {
      localStorage.setItem(`wardrobe_${user.id}`, JSON.stringify(updatedItems));
    }
    
    const item = wardrobeItems.find((i) => i.id === itemId);
    
    toast({
      title: "Item marked as clean",
      description: `${item?.name} has been marked as clean.`,
    });
  };
  
  const calculateCategoryCounts = () => {
    const counts: Record<string, number> = {};
    
    wardrobeItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    
    return counts;
  };
  
  const categoryCounts = calculateCategoryCounts();
  
  const getUpcomingOutfits = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return outfits
      .filter((outfit) => {
        if (!outfit.date) return false;
        const outfitDate = new Date(outfit.date);
        return outfitDate > today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date!);
        const dateB = new Date(b.date!);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  };
  
  const upcomingOutfits = getUpcomingOutfits();
  
  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button asChild className="bg-styleit-400 hover:bg-styleit-500">
                <Link to="/wardrobe">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Manage Wardrobe
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/outfits">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Outfit
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {todayOutfit ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Today's Outfit
                      <Badge variant="outline" className="ml-2">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {format(new Date(), "MMMM d, yyyy")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h3 className="font-medium mb-2">{todayOutfit.name}</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {todayOutfit.items.map((item) => (
                          <div key={item.id} className="aspect-square rounded-md overflow-hidden relative">
                            <img
                              src={item.imageUrl || defaultImageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-end justify-start">
                              <div className="bg-white bg-opacity-75 p-1 m-1 text-xs">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {todayOutfit.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                          <p className="font-medium">Notes:</p>
                          <p className="text-muted-foreground">{todayOutfit.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/outfits">View All Outfits</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Today's Outfit</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No outfit scheduled for today</p>
                    <Button asChild className="bg-styleit-400 hover:bg-styleit-500">
                      <Link to="/outfits">
                        <Plus className="mr-2 h-4 w-4" />
                        Create an Outfit
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Wardrobe Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-muted-foreground text-sm mb-1">Total Items</p>
                      <p className="text-2xl font-semibold">{wardrobeItems.length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-muted-foreground text-sm mb-1">Clean Items</p>
                      <p className="text-2xl font-semibold">{wardrobeItems.length - dirtyItems.length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-muted-foreground text-sm mb-1">Dirty Items</p>
                      <p className="text-2xl font-semibold">{dirtyItems.length}</p>
                    </div>
                    
                    {Object.entries(categoryCounts)
                      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                      .slice(0, 3)
                      .map(([category, count]) => (
                        <div key={category} className="bg-gray-50 p-3 rounded-md">
                          <p className="text-muted-foreground text-sm mb-1">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </p>
                          <p className="text-2xl font-semibold">{count}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/wardrobe">View All Items</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {dirtyItems.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Laundry Reminder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {dirtyItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img
                                src={item.imageUrl || defaultImageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Worn {item.timesWorn || 0} time(s)
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkClean(item.id)}
                          >
                            Mark Clean
                          </Button>
                        </div>
                      ))}
                      
                      {dirtyItems.length > 5 && (
                        <div className="text-center text-sm text-muted-foreground pt-2">
                          + {dirtyItems.length - 5} more items
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Calendar</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <Calendar
                    mode="single"
                    selected={new Date()}
                    className="rounded-md border"
                    modifiers={{
                      hasOutfit: outfits.filter(o => o.date).map(o => new Date(o.date!)),
                    }}
                    modifiersStyles={{
                      hasOutfit: {
                        backgroundColor: "rgb(219, 208, 255)",
                        color: "rgb(75, 52, 122)",
                      },
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Outfits</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingOutfits.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No upcoming outfits scheduled</p>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/outfits">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Schedule an Outfit
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingOutfits.map((outfit) => (
                        <div
                          key={outfit.id}
                          className="flex items-center space-x-3 bg-gray-50 p-2 rounded-md"
                        >
                          <div className="w-10 h-10 rounded overflow-hidden">
                            <img
                              src={outfit.items[0]?.imageUrl || defaultImageUrl}
                              alt={outfit.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{outfit.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(outfit.date!), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/outfits?tab=calendar">View Calendar</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/wardrobe">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Clothing Item
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/outfits">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Outfit
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/profile">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Update Style Preferences
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Dashboard;
