
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import MainLayout from "@/components/layout/MainLayout";

const Profile = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      display_name: user?.display_name || "",
      email: user?.email || "",
    },
  });
  
  const onSubmit = async (data: any) => {
    try {
      if (updateProfile) {
        await updateProfile({
          display_name: data.display_name,
        });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={user?.photo_url || ""} />
                          <AvatarFallback className="text-lg">
                            {user?.display_name?.substring(0, 2).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="display_name">Name</Label>
                        <Input
                          id="display_name"
                          {...register("display_name")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          disabled
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-styleit-400 hover:bg-styleit-500">
                        Save Changes
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your password and security settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Change Password</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your app preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Preference settings coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Notification settings coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Profile;
