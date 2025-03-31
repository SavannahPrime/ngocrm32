
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Upload, Link, Image as ImageIcon, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isYouTubeUrl, isGoogleDriveUrl, getYouTubeEmbedUrl, getGoogleDriveEmbedUrl } from "@/types/supabase";
import { toast } from "sonner";

interface MediaUploadProps {
  type: "image" | "video";
  value: string;
  onChange: (url: string) => void;
}

export const MediaUpload = ({ type, value, onChange }: MediaUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("url");
  const [urlInput, setUrlInput] = useState(value || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Update URL input when value prop changes
  useEffect(() => {
    setUrlInput(value || "");
  }, [value]);

  // Update preview when URL input or file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (urlInput) {
      if (type === "video") {
        if (isYouTubeUrl(urlInput)) {
          setPreview(getYouTubeEmbedUrl(urlInput) || "");
        } else if (isGoogleDriveUrl(urlInput)) {
          setPreview(getGoogleDriveEmbedUrl(urlInput) || "");
        } else {
          setPreview(urlInput);
        }
      } else {
        setPreview(urlInput);
      }
    } else {
      setPreview(null);
    }
  }, [file, urlInput, type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Check if file type matches the expected type
      if (type === "image" && !selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (type === "video" && !selectedFile.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Generate a unique file name to prevent conflicts
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${type === "image" ? "images" : "videos"}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("blog-assets")
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(filePath);
      
      onChange(publicUrl);
      setUrlInput(publicUrl);
      toast.success("File uploaded successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    
    // Validate URL format
    try {
      new URL(urlInput);
      onChange(urlInput);
      setIsOpen(false);
    } catch (e) {
      toast.error("Please enter a valid URL");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setFile(null);
    setPreview(null);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset file and URL input when switching tabs
    if (value === "upload") {
      setUrlInput("");
    } else {
      setFile(null);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="border rounded-md p-3 space-y-3">
          <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
            {type === "image" ? (
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-full object-contain" 
              />
            ) : (
              isYouTubeUrl(value) || isGoogleDriveUrl(value) ? (
                <iframe 
                  src={preview || ""} 
                  className="w-full h-full" 
                  allowFullScreen
                  title="Video preview"
                  frameBorder="0"
                />
              ) : (
                <video 
                  src={value} 
                  controls 
                  className="w-full h-full object-contain"
                />
              )
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 truncate max-w-[180px]">
              {value}
            </div>
            <div className="flex gap-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">Change</Button>
                </SheetTrigger>
                {/* Sheet content below */}
              </Sheet>
              <Button variant="outline" size="sm" onClick={handleRemove}>Remove</Button>
            </div>
          </div>
        </div>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2">
              {type === "image" ? (
                <ImageIcon className="h-6 w-6" />
              ) : (
                <Video className="h-6 w-6" />
              )}
              <span>Add {type === "image" ? "Image" : "Video"}</span>
            </Button>
          </SheetTrigger>
          {/* Sheet content below */}
        </Sheet>
      )}

      {/* Common Sheet Content for both states */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add {type === "image" ? "Image" : "Video"}</SheetTitle>
            <SheetDescription>
              Upload a file or enter a URL for your {type === "image" ? "image" : "video"}.
              {type === "video" && " You can also use YouTube or Google Drive links."}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Enter {type === "image" ? "image" : "video"} URL</Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder={`Enter ${type === "image" ? "image" : "video"} URL`}
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  {type === "video" && (
                    <p className="text-xs text-gray-500">
                      You can use direct video URLs, YouTube, or Google Drive links.
                    </p>
                  )}
                </div>
                
                {preview && (
                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                    {type === "image" ? (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      isYouTubeUrl(urlInput) || isGoogleDriveUrl(urlInput) ? (
                        <iframe 
                          src={preview} 
                          className="w-full h-full" 
                          allowFullScreen
                          title="Video preview"
                          frameBorder="0"
                        />
                      ) : (
                        <video 
                          src={preview} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      )
                    )}
                  </div>
                )}
                
                <Button 
                  onClick={handleUrlSubmit} 
                  className="w-full"
                  disabled={!urlInput}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Use URL
                </Button>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="upload">
                    Upload {type === "image" ? "image" : "video"}
                  </Label>
                  <Input
                    id="upload"
                    type="file"
                    accept={type === "image" ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                
                {preview && (
                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                    {type === "image" ? (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <video 
                        src={preview} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                )}
                
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
