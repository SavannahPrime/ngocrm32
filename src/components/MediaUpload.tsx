import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Upload, Link as LinkIcon, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isYouTubeUrl, isGoogleDriveUrl, getYouTubeEmbedUrl, getGoogleDriveEmbedUrl } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface MediaUploadProps {
  onUploadComplete?: (url: string) => void;
  uploadType?: "image" | "video";
  className?: string;
  type?: "image" | "video";
  value?: string;
  onChange?: (url: string) => void;
}

const MediaUpload = ({ 
  onUploadComplete, 
  uploadType = "image", 
  className = "", 
  type = "image", 
  value = "", 
  onChange 
}: MediaUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("url");
  const [urlInput, setUrlInput] = useState(value || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const actualType = type || uploadType;
  const handleValueChange = (url: string) => {
    if (onChange) {
      onChange(url);
    } else if (onUploadComplete) {
      onUploadComplete(url);
    }
  };

  useEffect(() => {
    setUrlInput(value || "");
  }, [value]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (urlInput) {
      if (actualType === "video") {
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
  }, [file, urlInput, actualType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setUploadError(null);
    
    if (selectedFile) {
      if (actualType === "image" && !selectedFile.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      if (actualType === "video" && !selectedFile.type.startsWith("video/")) {
        toast({
          title: "Error",
          description: "Please select a video file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setUploadError(null);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${actualType === "image" ? "images" : "videos"}/${fileName}`;
      
      console.log("Uploading file to path:", filePath);
      
      const { data: buckets } = await supabase.storage.listBuckets();
      const blogAssetsBucket = buckets?.find(bucket => bucket.name === "blog-assets");
      
      if (!blogAssetsBucket) {
        console.log("Blog assets bucket doesn't exist. Please create it in the Supabase dashboard.");
        toast({
          title: "Storage Error",
          description: "Storage bucket not configured properly. Please contact the administrator.",
          variant: "destructive"
        });
        throw new Error("Storage bucket not found");
      }
      
      const { data, error } = await supabase.storage
        .from("blog-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });
        
      if (error) {
        console.error("Storage upload error:", error);
        setUploadError("Failed to upload file. Please try again.");
        throw error;
      }
      
      console.log("Upload successful, getting public URL");
      
      const { data: { publicUrl } } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(filePath);
      
      console.log("Public URL obtained:", publicUrl);
      
      const { error: insertError } = await supabase
        .from("media_library")
        .insert({
          file_name: file.name,
          type: actualType,
          size: file.size,
          url: publicUrl,
          uploaded_by: user?.id || null
        });

      if (insertError) {
        console.error("Error recording file metadata:", insertError);
      }
      
      handleValueChange(publicUrl);
      setUrlInput(publicUrl);
      toast({
        title: "Success",
        description: "File uploaded successfully"
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    
    try {
      new URL(urlInput);
      handleValueChange(urlInput);
      setIsOpen(false);
    } catch (e) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };

  const handleRemove = () => {
    handleValueChange("");
    setUrlInput("");
    setFile(null);
    setPreview(null);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "upload") {
      setUrlInput("");
    } else {
      setFile(null);
    }
    setUploadError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="border rounded-md p-3 space-y-3">
          <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
            {actualType === "image" ? (
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
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Add {actualType === "image" ? "Image" : "Video"}</SheetTitle>
                    <SheetDescription>
                      Upload a file or enter a URL for your {actualType === "image" ? "image" : "video"}.
                      {actualType === "video" && " You can also use YouTube or Google Drive links."}
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
                          <Label htmlFor="url">Enter {actualType === "image" ? "image" : "video"} URL</Label>
                          <Input
                            id="url"
                            type="text"
                            placeholder={`Enter ${actualType === "image" ? "image" : "video"} URL`}
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                          />
                          {actualType === "video" && (
                            <p className="text-xs text-gray-500">
                              You can use direct video URLs, YouTube, or Google Drive links.
                            </p>
                          )}
                        </div>
                        
                        {preview && (
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            {actualType === "image" ? (
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
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Use URL
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="upload" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="upload">
                            Upload {actualType === "image" ? "image" : "video"}
                          </Label>
                          <Input
                            id="upload"
                            type="file"
                            accept={actualType === "image" ? "image/*" : "video/*"}
                            onChange={handleFileChange}
                            className="cursor-pointer"
                          />
                        </div>
                        
                        {uploadError && (
                          <div className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {uploadError}
                          </div>
                        )}
                        
                        {preview && (
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            {actualType === "image" ? (
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
              <Button variant="outline" size="sm" onClick={handleRemove}>Remove</Button>
            </div>
          </div>
        </div>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2">
              {actualType === "image" ? (
                <ImageIcon className="h-6 w-6" />
              ) : (
                <Video className="h-6 w-6" />
              )}
              <span>Add {actualType === "image" ? "Image" : "Video"}</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add {actualType === "image" ? "Image" : "Video"}</SheetTitle>
              <SheetDescription>
                Upload a file or enter a URL for your {actualType === "image" ? "image" : "video"}.
                {actualType === "video" && " You can also use YouTube or Google Drive links."}
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
                    <Label htmlFor="url">Enter {actualType === "image" ? "image" : "video"} URL</Label>
                    <Input
                      id="url"
                      type="text"
                      placeholder={`Enter ${actualType === "image" ? "image" : "video"} URL`}
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                    {actualType === "video" && (
                      <p className="text-xs text-gray-500">
                        You can use direct video URLs, YouTube, or Google Drive links.
                      </p>
                    )}
                  </div>
                  
                  {preview && (
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      {actualType === "image" ? (
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
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Use URL
                  </Button>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload">
                      Upload {actualType === "image" ? "image" : "video"}
                    </Label>
                    <Input
                      id="upload"
                      type="file"
                      accept={actualType === "image" ? "image/*" : "video/*"}
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  {uploadError && (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {uploadError}
                    </div>
                  )}
                  
                  {preview && (
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      {actualType === "image" ? (
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
      )}
    </div>
  );
};

export { MediaUpload };
export default MediaUpload;
