import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Link2, Check, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SocialShareProps {
  title?: string;
  score?: number;
  topCareer?: string;
}

const SocialShare = ({ 
  title = "My Career Analysis Results", 
  score = 0, 
  topCareer = "career path" 
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const shareText = `🎯 I just discovered my career potential with CareerAI!\n\n📊 Career Readiness Score: ${score}%\n💼 Top Match: ${topCareer}\n\nFind your perfect career path too! 🚀`;
  
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  
  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          aria-label="Share your results"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Share Results
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
        <DropdownMenuItem 
          onClick={() => handleShare("twitter")}
          className="cursor-pointer gap-2"
        >
          <Twitter className="w-4 h-4 text-[#1DA1F2]" aria-hidden="true" />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare("linkedin")}
          className="cursor-pointer gap-2"
        >
          <Linkedin className="w-4 h-4 text-[#0077B5]" aria-hidden="true" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare("whatsapp")}
          className="cursor-pointer gap-2"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="cursor-pointer gap-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
          ) : (
            <Link2 className="w-4 h-4" aria-hidden="true" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
