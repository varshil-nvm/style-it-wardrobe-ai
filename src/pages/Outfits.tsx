
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { useOutfits } from "@/hooks/useOutfits";
import OutfitForm from "@/components/outfits/OutfitForm";
import OutfitList from "@/components/outfits/OutfitList";
import OutfitCalendar from "@/components/outfits/OutfitCalendar";
import EmptyOutfitState from "@/components/outfits/EmptyOutfitState";

const Outfits = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("create");
  
  const {
    wardrobeItems,
    outfits,
    currentOutfit,
    outfitDate,
    handleOutfitNameChange,
    handleOutfitNotesChange,
    handleAddItemToOutfit,
    handleRemoveItemFromOutfit,
    handleSaveOutfit,
    handleDeleteOutfit,
    handleEditOutfit,
    handleToggleFavorite,
    setOutfitDate,
  } = useOutfits();

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Outfits</h1>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="create">Create Outfit</TabsTrigger>
              <TabsTrigger value="saved">Saved Outfits</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="animate-fade-in">
              <OutfitForm 
                currentOutfit={currentOutfit}
                outfitDate={outfitDate}
                wardrobeItems={wardrobeItems}
                onOutfitNameChange={handleOutfitNameChange}
                onOutfitNotesChange={handleOutfitNotesChange}
                onDateChange={setOutfitDate}
                onRemoveItemFromOutfit={handleRemoveItemFromOutfit}
                onAddItemToOutfit={handleAddItemToOutfit}
                onSaveOutfit={handleSaveOutfit}
              />
            </TabsContent>
            
            <TabsContent value="saved" className="animate-fade-in">
              {outfits.length === 0 ? (
                <EmptyOutfitState onCreateOutfit={() => setSelectedTab("create")} />
              ) : (
                <OutfitList 
                  outfits={outfits} 
                  onDeleteOutfit={handleDeleteOutfit}
                  onEditOutfit={(outfit) => {
                    handleEditOutfit(outfit);
                    setSelectedTab("create");
                  }}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="animate-fade-in">
              <OutfitCalendar 
                outfits={outfits} 
                onEditOutfit={(outfit) => {
                  handleEditOutfit(outfit);
                  setSelectedTab("create");
                }} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Outfits;
