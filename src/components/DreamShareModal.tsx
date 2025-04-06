
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dream } from "@/types/dream";
import { Copy, Share, Check, Facebook, Twitter, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamShareModalProps {
  dream: Dream;
  isOpen: boolean;
  onClose: () => void;
  onTogglePublic: (isPublic: boolean) => void;
}

const DreamShareModal = ({ dream, isOpen, onClose, onTogglePublic }: DreamShareModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Dream</DialogTitle>
          <DialogDescription>
            Share your dream with others via link or social media
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 pt-4">
          <Switch 
            id="dream-public"
            checked={dream.isPublic || false}
            onCheckedChange={handleTogglePublic}
          />
          <Label htmlFor="dream-public">Make dream public</Label>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
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
            className={cn("transition-colors", 
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
        
        <DialogFooter className="sm:justify-center">
          {!dream.isPublic && (
            <p className="text-sm text-muted-foreground">
              Enable "Make dream public" to share this dream
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DreamShareModal;
