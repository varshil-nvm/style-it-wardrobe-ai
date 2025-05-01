
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GalleryHorizontalEnd, ShoppingBag, Calendar, Heart } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-styleit-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Smart Wardrobe Assistant
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Organize your clothes, create outfits, and never wonder what to wear again with Style It.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild className="bg-styleit-400 hover:bg-styleit-500 px-8 py-6 text-lg">
                  <Link to="/register">Sign Up Free</Link>
                </Button>
                <Button asChild variant="outline" className="px-8 py-6 text-lg">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <div className="relative">
                <div className="w-full h-72 md:h-96 bg-styleit-100 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                    alt="Style It App"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-styleit-200 rounded-lg rotate-12" />
                <div className="absolute -top-6 -left-6 w-16 h-16 md:w-24 md:h-24 bg-styleit-300 rounded-lg -rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-styleit-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-styleit-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Wardrobe Management</h3>
            <p className="text-gray-600">
              Upload and organize all your clothing items with detailed information.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-styleit-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GalleryHorizontalEnd className="w-8 h-8 text-styleit-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Outfit Creator</h3>
            <p className="text-gray-600">
              Mix and match items to create perfect outfits for any occasion.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-styleit-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-styleit-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Outfit Calendar</h3>
            <p className="text-gray-600">
              Plan your outfits ahead of time with an easy-to-use scheduler.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-styleit-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-styleit-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Laundry Tracking</h3>
            <p className="text-gray-600">
              Keep track of which items need washing and when.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-styleit-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your wardrobe?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join Style It today and make your wardrobe work for you. Organize, plan, and create outfits with ease.
          </p>
          <Button asChild className="bg-styleit-400 hover:bg-styleit-500 px-8 py-6 text-lg">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-2xl text-styleit-500">Style It</h3>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Style It. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
