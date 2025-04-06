
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dream, DreamComment } from "@/types/dream";
import { Copy, Share, Check, Facebook, Twitter, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { addDreamComment, deleteDreamComment } from "@/utils/dreamStorage";

interface DreamShareModalProps {
  dream: Dream;
  isOpen: boolean;
  onClose: () => void;
  onTogglePublic: (isPublic: boolean) => void;
}

const DreamShareModal = ({ dream, isOpen, onClose, onTogglePublic }: DreamShareModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("share");
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  
  // Create a shareable link
  const shareableLink = `${window.location.origin}/shared-dream/${dream.id}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = (platform: 'facebook' | 'twitter' | 'email') => {
    let shareUrl = '';
    const dreamTitle = encodeURIComponent(`My Dream: ${dream.title}`);
    const dreamDescription = encodeURIComponent(`Check out my dream: ${dream.title}`);
    const url = encodeURIComponent(shareableLink);
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${dreamDescription}&url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${dreamTitle}&body=${dreamDescription}%0A%0A${url}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTogglePublic = () => {
    onTogglePublic(!dream.isPublic);
  };

  const handleAddComment = () => {
    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    if (!authorName.trim()) {
      toast({
        title: "Author name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    const newComment: DreamComment = {
      id: crypto.randomUUID(),
      text: comment,
      author: authorName,
      date: new Date().toISOString(),
    };

    addDreamComment(dream.id, newComment);
    setComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been added to this dream",
    });
    onClose(); // Close the modal after adding comment
  };

  const handleDeleteComment = (commentId: string) => {
    deleteDreamComment(dream.id, commentId);
    toast({
      title: "Comment deleted",
      description: "The comment has been removed",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dream Details</DialogTitle>
          <DialogDescription>
            Share your dream or add comments
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="share" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {dream.comments && dream.comments.length > 0 && (
                <span className="ml-1 text-xs bg-dream-light-purple/30 px-1.5 py-0.5 rounded-full">
                  {dream.comments.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="share" className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="dream-public"
                checked={dream.isPublic || false}
                onCheckedChange={handleTogglePublic}
              />
              <Label htmlFor="dream-public">Make dream public</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  readOnly
                  value={shareableLink}
                  className="font-mono text-sm"
                />
              </div>
              <Button 
                type="button" 
                size="icon" 
                onClick={handleCopyLink}
                variant="outline"
                className={cn(
                  "transition-colors", 
                  copied ? "bg-green-50 text-green-700 border-green-200" : ""
                )}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            
            <div className="flex justify-center space-x-4 pt-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('facebook')}
                disabled={!dream.isPublic}
                className="rounded-full w-10 h-10 bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('twitter')}
                disabled={!dream.isPublic}
                className="rounded-full w-10 h-10 bg-sky-50 text-sky-500 hover:bg-sky-100"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('email')}
                disabled={!dream.isPublic}
                className="rounded-full w-10 h-10 bg-gray-50 text-gray-600 hover:bg-gray-100"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Share via Email</span>
              </Button>
            </div>
            
            {!dream.isPublic && (
              <p className="text-sm text-muted-foreground text-center">
                Enable "Make dream public" to share this dream
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-4 py-4">
            {dream.comments && dream.comments.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {dream.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{comment.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(comment.date), "MMM d, yyyy")}
                      </div>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 hover:text-red-700 mt-2 h-6 px-2"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p>No comments yet</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="author">Your Name</Label>
                <Input
                  id="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-dream-light-purple/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Add Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your thoughts about this dream..."
                  className="min-h-[80px] border-dream-light-purple/30"
                />
              </div>
              
              <Button 
                onClick={handleAddComment}
                className="w-full bg-dream-gradient hover:opacity-90"
              >
                Add Comment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-center border-t border-dream-light-purple/20 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DreamShareModal;
