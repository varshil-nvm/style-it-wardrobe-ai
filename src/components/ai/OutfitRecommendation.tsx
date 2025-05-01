
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown, Sun, CloudRain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  getRecommendedOutfits,
  getWeatherData,
  recordOutfitFeedback,
  RecommendedOutfit,
  WeatherData
} from "@/services/aiRecommendationService";

export const OutfitRecommendation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendedOutfit[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Get weather data
        let weatherData = null;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              weatherData = await getWeatherData(
                position.coords.latitude,
                position.coords.longitude
              );
              setWeather(weatherData);
              
              // Get recommendations using weather data
              const outfits = await getRecommendedOutfits(user.id, {
                weather: weatherData
              });
              setRecommendations(outfits);
            },
            async () => {
              // Fallback if location is denied
              const outfits = await getRecommendedOutfits(user.id, {});
              setRecommendations(outfits);
            }
          );
        } else {
          // Fallback for browsers without geolocation
          const outfits = await getRecommendedOutfits(user.id, {});
          setRecommendations(outfits);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast({
          title: "Error",
          description: "Could not load recommendations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user, toast]);
  
  const handleFeedback = async (outfitId: string, rating: number) => {
    if (!user) return;
    
    try {
      await recordOutfitFeedback(user.id, outfitId, rating);
      toast({
        title: "Feedback recorded",
        description: "Thanks for your feedback! We'll use it to improve your recommendations.",
      });
    } catch (error) {
      console.error("Error recording feedback:", error);
      toast({
        title: "Error",
        description: "Could not save your feedback",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">AI-Powered Outfit Suggestions</h2>
        
        {weather && (
          <div className="flex items-center">
            {weather.conditions.toLowerCase().includes("cloud") ? (
              <CloudRain className="h-5 w-5 mr-1" />
            ) : (
              <Sun className="h-5 w-5 mr-1" />
            )}
            <span>
              {weather.temperature}°, {weather.conditions}
            </span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              No recommendations available. Add more items to your wardrobe or create outfits to get personalized suggestions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((outfit, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{outfit.name}</CardTitle>
                <CardDescription>
                  Confidence: {Math.round(outfit.confidence * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {outfit.reason}
                </p>
                <div className="flex space-x-2 py-2">
                  {outfit.items.length > 0 ? (
                    outfit.items.map((itemId, i) => (
                      <Badge key={i} variant="outline">
                        Item {i + 1}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No items to display
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFeedback(index.toString(), 1)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFeedback(index.toString(), -1)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Dislike
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutfitRecommendation;
