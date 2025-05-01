
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WashingMachine, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getItemsNeedingWash, markItemsAsWashed, LaundryNotification } from "@/services/laundryService";

export const LaundryNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<LaundryNotification[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const fetchLaundryData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const laundryItems = await getItemsNeedingWash(user.id);
        setNotifications(laundryItems);
      } catch (error) {
        console.error("Error fetching laundry data:", error);
        toast({
          title: "Error",
          description: "Could not load laundry information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLaundryData();
  }, [user, toast]);
  
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prevItems => {
      const newItems = new Set(prevItems);
      if (newItems.has(id)) {
        newItems.delete(id);
      } else {
        newItems.add(id);
      }
      return newItems;
    });
  };
  
  const handleMarkAsWashed = async () => {
    if (selectedItems.size === 0) return;
    
    try {
      const success = await markItemsAsWashed(Array.from(selectedItems));
      
      if (success) {
        toast({
          title: "Success",
          description: `${selectedItems.size} items marked as clean`,
        });
        
        // Remove marked items from the list
        setNotifications(prevItems => 
          prevItems.filter(item => !selectedItems.has(item.id))
        );
        
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error("Error marking items as washed:", error);
      toast({
        title: "Error",
        description: "Could not update items",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <WashingMachine className="mr-2 h-5 w-5" />
          Laundry Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No items need washing right now. Your wardrobe is clean!
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {notifications.map(item => (
                <Alert 
                  key={item.id} 
                  variant={item.type === 'alert' ? 'destructive' : 'default'}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <AlertCircle className="h-4 w-4" />
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <AlertTitle>{item.itemName}</AlertTitle>
                      <AlertDescription>
                        {item.message}
                      </AlertDescription>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.has(item.id)}
                      onChange={() => {}} // Handled by the Alert onClick
                      className="h-4 w-4"
                    />
                  </div>
                </Alert>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <Badge variant="outline">
                  {selectedItems.size} items selected
                </Badge>
              </div>
              <Button
                variant="default"
                size="sm"
                disabled={selectedItems.size === 0}
                onClick={handleMarkAsWashed}
              >
                Mark as Washed
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LaundryNotifications;
