
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cloud, Sun, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getWeatherData, WeatherData } from "@/services/aiRecommendationService";

interface Event {
  title: string;
  date: Date;
  type: string;
}

// Mock calendar events for prototype
const mockEvents: Event[] = [
  { title: "Business Meeting", date: new Date(new Date().setHours(14, 0, 0, 0)), type: "meeting" },
  { title: "Dinner Date", date: new Date(new Date().setHours(19, 0, 0, 0)), type: "social" },
  { title: "Gym Session", date: new Date(new Date().setHours(18, 0, 0, 0)), type: "fitness" },
];

export const ContextualOutfitSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContextualData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Get weather data if location is available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const weatherData = await getWeatherData(
                position.coords.latitude,
                position.coords.longitude
              );
              setWeather(weatherData);
            },
            () => {
              // Fallback if location is denied
              console.log("Location permission denied");
            }
          );
        }
        
        // In a real app, this would fetch actual calendar events
        // For now, use mock data
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching contextual data:", error);
        toast({
          title: "Error",
          description: "Could not load contextual data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContextualData();
  }, [user, toast]);
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "social":
        return <Calendar className="h-4 w-4" />;
      case "fitness":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  const createOutfitForContext = (context: string) => {
    // In a real app, this would create an outfit draft based on the context
    toast({
      title: "Creating outfit",
      description: `Creating a new outfit for ${context}`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-5 w-5" />
          Contextual Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weather && (
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {weather.conditions.toLowerCase().includes("cloud") ? (
                    <Cloud className="h-5 w-5 mr-2" />
                  ) : (
                    <Sun className="h-5 w-5 mr-2" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium">Weather-Based Suggestion</h3>
                    <p className="text-xs text-muted-foreground">
                      {weather.temperature}°, {weather.conditions}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => createOutfitForContext(`${weather.temperature}° ${weather.conditions}`)}
                >
                  Create Outfit
                </Button>
              </div>
            </div>
          )}
          
          {events.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Today's Events</h3>
              {events.map((event, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getEventIcon(event.type)}
                      <div className="ml-2">
                        <p className="text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => createOutfitForContext(event.title)}
                    >
                      Create Outfit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!weather && events.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No contextual data available. Allow location access to get weather-based recommendations.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextualOutfitSuggestions;
