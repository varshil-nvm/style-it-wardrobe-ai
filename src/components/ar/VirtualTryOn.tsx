
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VirtualTryOn = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [tab, setTab] = useState("upload");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClothingSelect = (clothingUrl: string) => {
    setOverlayImage(clothingUrl);
  };
  
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
      }
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Mock clothing items for the prototype
  const mockClothingItems = [
    { id: "1", name: "Blue T-Shirt", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop" },
    { id: "2", name: "Black Jacket", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop" },
    { id: "3", name: "White Shirt", imageUrl: "https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=500&auto=format&fit=crop" },
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Virtual Try-On (Beta)</CardTitle>
        <CardDescription>
          Try on clothes virtually using augmented reality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex justify-center py-8">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="camera" className="space-y-4">
            <div className="relative">
              <video 
                ref={videoRef}
                className="w-full h-64 bg-black object-cover rounded-lg"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 right-4 space-x-2">
                {!cameraActive ? (
                  <Button onClick={startCamera}>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" onClick={takeSnapshot}>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="destructive" onClick={stopCamera}>
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {image && (
          <div className="mt-6 space-y-4">
            <div className="relative w-full h-96">
              <img 
                src={image} 
                alt="Your photo" 
                className="w-full h-full object-contain rounded-lg"
              />
              
              {overlayImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={overlayImage} 
                    alt="Clothing overlay" 
                    className="max-w-full max-h-full object-contain opacity-80"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => { 
                  setImage(null); 
                  setOverlayImage(null); 
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Select clothing to try on:</h3>
          <div className="grid grid-cols-3 gap-2">
            {mockClothingItems.map(item => (
              <div 
                key={item.id} 
                className="cursor-pointer border rounded-md overflow-hidden hover:border-primary"
                onClick={() => handleClothingSelect(item.imageUrl)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-1 text-xs text-center truncate">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualTryOn;
