
import { useState } from "react";
import { useNGO } from "@/contexts/NGOContext";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import MediaUpload from "@/components/MediaUpload";

const EventForm = ({ onClose }: { onClose: () => void }) => {
  const { addEvent, isLoading } = useNGO();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("18:00");
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      return;
    }

    const success = await addEvent({
      title,
      description,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time,
      location,
      featured,
      image_url: imageUrl
    });

    if (success) {
      onClose();
    }
  };

  const handleMediaUpload = (url: string) => {
    setImageUrl(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input 
              id="title" 
              placeholder="Enter event title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter event description" 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="Enter event location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="featured" 
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Feature this event</Label>
          </div>

          <div className="space-y-2">
            <Label>Event Image</Label>
            <MediaUpload 
              onUploadComplete={handleMediaUpload} 
              uploadType="image" 
              className="w-full"
            />
            {imageUrl && (
              <div className="mt-2">
                <img 
                  src={imageUrl} 
                  alt="Event preview" 
                  className="h-40 w-auto object-cover rounded-md" 
                />
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || !title || !date}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EventForm;
