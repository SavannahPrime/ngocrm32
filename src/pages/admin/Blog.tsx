
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";
import { MediaUpload } from "@/components/MediaUpload";
import { toast } from "sonner";

// Update component using our temporary type
const AdminBlog = () => {
  const { toast: uiToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<SermonType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SermonType | null>(null);
  
  const [formData, setFormData] = useState<Partial<SermonType>>({
    title: "",
    preacher: "",
    date: new Date().toISOString().split('T')[0],
    scripture: "",
    content: "",
    video_url: "",
    image_url: "",
    featured: false,
    tags: [],
    type: "blog"
  });
  
  const [tagsInput, setTagsInput] = useState("");

  // Suggested NGO-focused tags
  const suggestedTags = [
    "Water", "Education", "Health", "Infrastructure", "Community", 
    "Sustainability", "Women Empowerment", "Climate", "Children", 
    "Food Security", "Disaster Relief", "Poverty Reduction"
  ];

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('type', 'blog')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
      uiToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle featured checkbox
  const handleFeaturedChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked });
  };

  // Handle image URL changes
  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };
  
  // Handle video URL changes
  const handleVideoUrlChange = (url: string) => {
    setFormData({ ...formData, video_url: url });
  };

  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  // Add a tag from suggestions
  const addTag = (tag: string) => {
    const currentTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setTagsInput(newTags);
    }
  };

  // Add blog post
  const handleAddBlogPost = async () => {
    try {
      if (!formData.title || !formData.preacher || !formData.content) {
        uiToast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        return;
      }

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { data, error } = await supabase
        .from('sermons')
        .insert({
          title: formData.title,
          preacher: formData.preacher,
          date: formData.date || new Date().toISOString().split('T')[0],
          scripture: formData.scripture || "Project Update", // Default value for NGO content
          content: formData.content,
          video_url: formData.video_url,
          image_url: formData.image_url,
          featured: formData.featured || false,
          tags: tags,
          type: 'blog'
        })
        .select();
        
      if (error) throw error;
      
      toast.success("Blog post added successfully");
      uiToast({
        title: "Success",
        description: "Blog post has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        preacher: "",
        date: new Date().toISOString().split('T')[0],
        scripture: "",
        content: "",
        video_url: "",
        image_url: "",
        featured: false,
        tags: [],
        type: "blog"
      });
      setTagsInput("");
      fetchBlogPosts();
    } catch (error: any) {
      console.error("Error adding blog post:", error);
      toast.error("Failed to add blog post");
      uiToast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add blog post: ${error.message}`,
      });
    }
  };

  // Edit blog post
  const handleEditBlogPost = async () => {
    try {
      if (!selectedPost) return;
      
      if (!formData.title || !formData.preacher || !formData.content) {
        uiToast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        return;
      }

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('sermons')
        .update({
          title: formData.title,
          preacher: formData.preacher,
          date: formData.date,
          scripture: formData.scripture || "Project Update",
          content: formData.content,
          video_url: formData.video_url,
          image_url: formData.image_url,
          featured: formData.featured,
          tags: tags,
          type: 'blog',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPost.id);
        
      if (error) throw error;
      
      toast.success("Blog post updated successfully");
      uiToast({
        title: "Success",
        description: "Blog post has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedPost(null);
      fetchBlogPosts();
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
      uiToast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update blog post: ${error.message}`,
      });
    }
  };

  // Delete blog post
  const handleDeleteBlogPost = async () => {
    try {
      if (!selectedPost) return;
      
      const { error } = await supabase
        .from('sermons')
        .delete()
        .eq('id', selectedPost.id);
        
      if (error) throw error;
      
      toast.success("Blog post deleted successfully");
      uiToast({
        title: "Success",
        description: "Blog post has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
      fetchBlogPosts();
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
      uiToast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
      });
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (post: SermonType) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      preacher: post.preacher,
      date: post.date,
      scripture: post.scripture,
      content: post.content,
      video_url: post.video_url || "",
      image_url: post.image_url || "",
      featured: post.featured || false,
      type: "blog"
    });
    setTagsInput(post.tags ? post.tags.join(', ') : "");
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (post: SermonType) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-ngo-primary">Blog Management</h1>
        <Button 
          onClick={() => {
            setFormData({
              title: "",
              preacher: "",
              date: new Date().toISOString().split('T')[0],
              scripture: "Project Update",  // Default for NGO
              content: "",
              video_url: "",
              image_url: "",
              featured: false,
              type: "blog"
            });
            setTagsInput("");
            setIsAddDialogOpen(true);
          }} 
          className="bg-ngo-primary hover:bg-ngo-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Blog Post
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.preacher}</TableCell>
                    <TableCell>{format(new Date(post.date), "MMMM d, yyyy")}</TableCell>
                    <TableCell>
                      {post.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Standard
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleOpenDeleteDialog(post)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No blog posts found. Click "Add New Blog Post" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Blog Post Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
            <DialogDescription>
              Create a new project update or story to be published on the website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preacher">Author *</Label>
                <Input
                  id="preacher"
                  name="preacher"
                  placeholder="Enter author name"
                  value={formData.preacher}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scripture">Category/Region *</Label>
                <Input
                  id="scripture"
                  name="scripture"
                  placeholder="Enter category or region"
                  value={formData.scripture}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter blog post content"
                rows={10}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <MediaUpload 
                type="image" 
                value={formData.image_url as string} 
                onChange={handleImageUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Video</Label>
              <MediaUpload 
                type="video" 
                value={formData.video_url as string} 
                onChange={handleVideoUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="water, education, health"
                value={tagsInput}
                onChange={handleTagsChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured} 
                onCheckedChange={handleFeaturedChange} 
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Featured Post
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBlogPost}>Add Blog Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Blog Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the details of the blog post.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  name="title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-preacher">Author *</Label>
                <Input
                  id="edit-preacher"
                  name="preacher"
                  placeholder="Enter author name"
                  value={formData.preacher}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-scripture">Category/Region *</Label>
                <Input
                  id="edit-scripture"
                  name="scripture"
                  placeholder="Enter category or region"
                  value={formData.scripture}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                name="content"
                placeholder="Enter blog post content"
                rows={10}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <MediaUpload 
                type="image" 
                value={formData.image_url as string} 
                onChange={handleImageUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Video</Label>
              <MediaUpload 
                type="video" 
                value={formData.video_url as string} 
                onChange={handleVideoUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                placeholder="water, education, health"
                value={tagsInput}
                onChange={handleTagsChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-featured" 
                checked={formData.featured} 
                onCheckedChange={handleFeaturedChange} 
              />
              <label
                htmlFor="edit-featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Featured Post
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditBlogPost}>Update Blog Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the blog post "{selectedPost?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlogPost}>
              Delete Blog Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
