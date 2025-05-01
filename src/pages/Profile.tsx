
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";

interface UserProfile {
  displayName: string;
  height: string;
  weight: string;
  shirtSize: string;
  pantsSize: string;
  shoeSize: string;
  preferredStyle: string;
  colorPreferences: string[];
}

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || "",
    height: "",
    weight: "",
    shirtSize: "",
    pantsSize: "",
    shoeSize: "",
    preferredStyle: "casual",
    colorPreferences: [],
  });
  
  // Load stored profile data
  useEffect(() => {
    const storedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (storedProfile) {
      setProfile({
        ...JSON.parse(storedProfile),
        displayName: user?.displayName || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile({ displayName: profile.displayName });
      localStorage.setItem(`profile_${user?.id}`, JSON.stringify(profile));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      // Error is handled in useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="preferences">Style Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="animate-fade-in">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">
                        Your email cannot be changed.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="bg-styleit-400 hover:bg-styleit-500"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="measurements" className="animate-fade-in">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Body Measurements</CardTitle>
                    <CardDescription>
                      Add your measurements for better outfit recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        value={profile.height}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        value={profile.weight}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shirtSize">Shirt Size</Label>
                      <Select
                        value={profile.shirtSize}
                        onValueChange={(value) => handleSelectChange("shirtSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shirt size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pantsSize">Pants Size</Label>
                      <Input
                        id="pantsSize"
                        name="pantsSize"
                        value={profile.pantsSize}
                        onChange={handleChange}
                        placeholder="e.g., 32/34, M, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shoeSize">Shoe Size</Label>
                      <Input
                        id="shoeSize"
                        name="shoeSize"
                        value={profile.shoeSize}
                        onChange={handleChange}
                        placeholder="e.g., 9, 42, etc."
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="bg-styleit-400 hover:bg-styleit-500"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="animate-fade-in">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Style Preferences</CardTitle>
                    <CardDescription>
                      Set your style preferences for better outfit recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="preferredStyle">Preferred Style</Label>
                      <Select
                        value={profile.preferredStyle}
                        onValueChange={(value) => handleSelectChange("preferredStyle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="athleisure">Athleisure</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                          <SelectItem value="streetwear">Streetwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Favorite Colors</Label>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {[
                          { name: "Black", color: "bg-black" },
                          { name: "White", color: "bg-white border" },
                          { name: "Gray", color: "bg-gray-400" },
                          { name: "Red", color: "bg-red-500" },
                          { name: "Blue", color: "bg-blue-500" },
                          { name: "Green", color: "bg-green-500" },
                          { name: "Yellow", color: "bg-yellow-400" },
                          { name: "Purple", color: "bg-purple-500" },
                          { name: "Pink", color: "bg-pink-400" },
                          { name: "Orange", color: "bg-orange-500" },
                          { name: "Brown", color: "bg-amber-800" },
                          { name: "Navy", color: "bg-indigo-900" },
                        ].map((item) => (
                          <div
                            key={item.name}
                            className="flex flex-col items-center justify-center"
                          >
                            <button
                              type="button"
                              className={`w-8 h-8 rounded-full ${item.color} cursor-pointer transition-all ${
                                profile.colorPreferences.includes(item.name)
                                  ? "ring-2 ring-styleit-400 ring-offset-2"
                                  : ""
                              }`}
                              onClick={() => {
                                setProfile((prev) => {
                                  if (prev.colorPreferences.includes(item.name)) {
                                    return {
                                      ...prev,
                                      colorPreferences: prev.colorPreferences.filter(
                                        (color) => color !== item.name
                                      ),
                                    };
                                  } else {
                                    return {
                                      ...prev,
                                      colorPreferences: [...prev.colorPreferences, item.name],
                                    };
                                  }
                                });
                              }}
                              aria-label={item.name}
                            />
                            <span className="text-xs mt-1">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="bg-styleit-400 hover:bg-styleit-500"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Profile;
