import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export default function PromptList({ prompts }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: "提示词已复制到剪贴板",
        duration: 2000,
      });
    } catch (err) {
      console.error('复制失败:', err);
      toast({
        variant: "destructive",
        description: "复制失败",
        duration: 2000,
      });
    }
  };

  const handleShare = async (id) => {
    try {
      const response = await fetch(`/api/prompts/share/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('分享失败');
      }

      const shareUrl = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        description: "分享链接已复制到剪贴板",
        duration: 2000,
      });
    } catch (err) {
      console.error('分享失败:', err);
      toast({
        variant: "destructive",
        description: "分享失败",
        duration: 2000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
      {prompts?.map((prompt) => (
        <Card key={prompt.id} className="flex flex-col h-full apple-hover apple-blur border-0 overflow-hidden">
          <CardContent className="flex-1 pt-4 md:pt-6 pb-3 md:pb-4 px-4 md:px-6">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <h3 className="text-lg md:text-xl font-semibold tracking-tight line-clamp-1 transition-colors duration-300 max-w-[calc(100%-140px)]">
                {prompt.title}
              </h3>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/prompts/${prompt.id}`)}
                  className="h-8 w-8 md:h-10 md:w-10 hover:bg-secondary/80 rounded-full"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(prompt.content)}
                  className="h-8 w-8 md:h-10 md:w-10 hover:bg-secondary/80 rounded-full"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare(prompt.id)}
                  className="h-8 w-8 md:h-10 md:w-10 hover:bg-secondary/80 rounded-full"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-row flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mb-3">
              <span className="font-medium">{new Date(prompt.created_at).toLocaleDateString()}</span>
              {prompt.version && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/50">•</span>
                  <span className="font-medium">版本 {prompt.version}</span>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed h-[72px] md:h-[80px] overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-12 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent rounded-lg p-2.5 md:p-3 bg-secondary/30">
              {prompt.content}
            </p>
            
            <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4 min-h-[24px] md:min-h-[28px] max-h-[48px] md:max-h-[56px] overflow-hidden">
              {prompt.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="bg-accent text-accent-foreground text-[10px] md:text-xs font-medium px-2.5 md:px-3 py-1 rounded-full transition-colors duration-200 hover:bg-accent/80"
                >
                  #{tag}
                </span>
              ))}
              {prompt.tags?.length > 3 && (
                <span className="text-muted-foreground text-[10px] md:text-xs font-medium px-2 py-1">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 