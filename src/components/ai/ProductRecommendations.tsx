
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
}

// Mock products for the prototype
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    brand: "Fashion Brand",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop",
    affiliateUrl: "https://example.com/product1",
    category: "tops"
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    brand: "Denim Co",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop",
    affiliateUrl: "https://example.com/product2",
    category: "bottoms"
  },
  {
    id: "3",
    name: "Summer Dress",
    brand: "Summer Collection",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=500&auto=format&fit=crop",
    affiliateUrl: "https://example.com/product3",
    category: "dresses"
  },
  {
    id: "4",
    name: "Casual Sneakers",
    brand: "FootWear Plus",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop",
    affiliateUrl: "https://example.com/product4",
    category: "shoes"
  },
];

export const ProductRecommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = selectedCategory 
    ? mockProducts.filter(product => product.category === selectedCategory)
    : mockProducts;
  
  const handleProductClick = (affiliateUrl: string) => {
    // In a real app, this would track the click for analytics
    console.log("Product clicked:", affiliateUrl);
    window.open(affiliateUrl, "_blank");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Product Recommendations
        </CardTitle>
        <CardDescription>
          Items you might like based on your wardrobe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {Array.from(new Set(mockProducts.map(p => p.category))).map(category => (
            <Button 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="border rounded-md overflow-hidden hover:border-primary cursor-pointer"
              onClick={() => handleProductClick(product.affiliateUrl)}
            >
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="p-2">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <div className="flex justify-between items-center mt-1">
                  <Badge variant="outline">${product.price}</Badge>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
