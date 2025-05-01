
import { supabase } from "@/integrations/supabase/client";

export interface LaundryItem {
  id: string;
  name: string;
  timesWorn: number;
  isDirty: boolean;
  lastWashed: string | null;
}

export interface LaundryNotification {
  id: string;
  itemName: string;
  message: string;
  type: 'warning' | 'alert';
}

// Default wear thresholds by category
const DEFAULT_WEAR_THRESHOLDS = {
  tops: 3,
  bottoms: 5,
  dresses: 2,
  outerwear: 7,
  accessories: 10,
  shoes: 15
};

// Check if an item needs washing based on wears
export const checkItemNeedsWashing = (
  item: any,
  customThresholds?: Record<string, number>
): boolean => {
  const thresholds = customThresholds || DEFAULT_WEAR_THRESHOLDS;
  const categoryThreshold = thresholds[item.category] || 5;
  
  return (item.times_worn >= categoryThreshold) || item.is_dirty;
};

// Get all items that need washing
export const getItemsNeedingWash = async (userId: string): Promise<LaundryNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    const notifications: LaundryNotification[] = [];
    
    data?.forEach(item => {
      if (checkItemNeedsWashing(item)) {
        notifications.push({
          id: item.id,
          itemName: item.name,
          message: item.is_dirty ? 
            `${item.name} is marked as dirty` : 
            `${item.name} has been worn ${item.times_worn} times since last wash`,
          type: item.times_worn >= (DEFAULT_WEAR_THRESHOLDS[item.category] || 5) * 1.5 ? 'alert' : 'warning'
        });
      }
    });
    
    return notifications;
  } catch (error) {
    console.error("Error getting laundry notifications:", error);
    return [];
  }
};

// Mark items as washed
export const markItemsAsWashed = async (itemIds: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('wardrobe_items')
      .update({
        times_worn: 0,
        is_dirty: false,
        last_washed: new Date().toISOString()
      })
      .in('id', itemIds);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error marking items as washed:", error);
    return false;
  }
};
