import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PromptList({ prompts }) {
  const { toast } = useToast();

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
      {prompts?.map((prompt) => (
        <Link href={`/prompts/${prompt.id}`} key={prompt.id}>
          <Card className="flex flex-col transition-all duration-200 hover:shadow-lg cursor-pointer">
            <CardContent className="flex-1 pt-3 pb-2 px-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold line-clamp-1 hover:text-primary transition-colors max-w-[calc(100%-40px)]">
                  {prompt.title}
                </h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.preventDefault()}
                      className="hover:bg-secondary/80"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      handleCopy(prompt.content);
                    }}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>复制提示词</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      handleShare(prompt.id);
                    }}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>分享链接</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground/70 mb-1 sm:mb-1.5">
                <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                {prompt.version && (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">•</span>
                    <span>版本: {prompt.version}</span>
                  </div>
                )}
              </div>
              
              <p className="text-muted-foreground/90 text-[11px] sm:text-xs leading-4 sm:leading-5 h-[40px] sm:h-[400px] overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-6 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent bg-secondary/20 rounded-sm p-2">
                {prompt.content}
              </p>
              
              <div className="flex flex-wrap gap-1 sm:gap-1.5 min-h-[20px] sm:min-h-[24px] max-h-[20px] sm:max-h-[24px] overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-6 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent">
                {prompt.tags?.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-secondary/80 text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full hover:bg-secondary transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
                {prompt.tags?.length > 3 && (
                  <span className="text-muted-foreground text-xs">
                    +{prompt.tags.length - 3}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 