
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Upload, Link, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isYouTubeUrl, isGoogleDriveUrl, getYouTubeEmbedUrl, getGoogleDriveEmbedUrl } from "@/types/supabase";

interface MediaUploadProps {
  type: "image" | "video";
  value?: string | null;
  onChange: (url: string) => void;
}

export function MediaUpload({ type, value, onChange }: MediaUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(value || "");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, etc.)",
      });
      return;
    }
    
    if (type === "video" && !file.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WebM, etc.)",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('blog-assets')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath);
        
      onChange(publicUrlData.publicUrl);
      
      toast({
        title: "File uploaded",
        description: `${type === "image" ? "Image" : "Video"} has been uploaded successfully.`,
      });
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        variant: "destructive",
        title: `Failed to upload ${type}`,
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "URL is required",
        description: "Please enter a valid URL",
      });
      return;
    }
    
    // Check if it's a YouTube or Google Drive link for videos
    if (type === "video") {
      if (isYouTubeUrl(urlInput)) {
        const embedUrl = getYouTubeEmbedUrl(urlInput);
        if (embedUrl) {
          onChange(embedUrl);
          toast({
            title: "YouTube video added",
            description: "The YouTube video has been added successfully.",
          });
          return;
        }
      } else if (isGoogleDriveUrl(urlInput)) {
        const embedUrl = getGoogleDriveEmbedUrl(urlInput);
        if (embedUrl) {
          onChange(embedUrl);
          toast({
            title: "Google Drive video added",
            description: "The Google Drive video has been added successfully.",
          });
          return;
        }
      }
    }
    
    // For regular URLs (images or direct video links)
    onChange(urlInput);
    toast({
      title: `${type === "image" ? "Image" : "Video"} URL added`,
      description: `The ${type} URL has been added successfully.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload {type === "image" ? "Image" : "Video"}
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="mr-2 h-4 w-4" />
            {type === "video" ? "Video URL / Embed" : "Image URL"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="pt-4">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop<br />
                {type === "image" ? "PNG, JPG or GIF" : "MP4, WebM or other video formats"}
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={type === "image" ? "image/*" : "video/*"}
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-church-primary"></div>
              </div>
            )}
            
            {value && type === "image" && (
              <div className="mt-4">
                <p className="text-sm mb-2">Current image:</p>
                <div className="rounded-md overflow-hidden max-h-48">
                  <img src={value} alt="Current" className="w-full h-auto object-cover" />
                </div>
              </div>
            )}
            
            {value && type === "video" && !isYouTubeUrl(value) && !isGoogleDriveUrl(value) && (
              <div className="mt-4">
                <p className="text-sm mb-2">Current video:</p>
                <div className="rounded-md overflow-hidden">
                  <video src={value} controls className="w-full h-auto max-h-48" />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${type}-url`}>
                {type === "video" ? "Video URL (YouTube, Google Drive, or direct link)" : "Image URL"}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id={`${type}-url`}
                  placeholder={type === "video" 
                    ? "https://youtube.com/watch?v=... or https://drive.google.com/..." 
                    : "https://example.com/image.jpg"}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button onClick={handleUrlSubmit}>Add</Button>
              </div>
              
              {type === "video" && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Supports YouTube, Google Drive, and direct video links</span>
                </div>
              )}
            </div>
            
            {value && type === "image" && (
              <div className="mt-4">
                <p className="text-sm mb-2">Current image:</p>
                <div className="rounded-md overflow-hidden max-h-48">
                  <img src={value} alt="Current" className="w-full h-auto object-cover" />
                </div>
              </div>
            )}
            
            {value && type === "video" && (
              <div className="mt-4">
                <p className="text-sm mb-2">Current video:</p>
                <div className="rounded-md overflow-hidden">
                  {isYouTubeUrl(value) || isGoogleDriveUrl(value) ? (
                    <iframe 
                      src={value} 
                      allowFullScreen 
                      className="w-full aspect-video rounded-md"
                    />
                  ) : (
                    <video src={value} controls className="w-full h-auto max-h-48" />
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
