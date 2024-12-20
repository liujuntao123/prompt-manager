import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
      {prompts?.map((prompt) => (
        <Link href={`/prompts/${prompt.id}`} key={prompt.id}>
          <Card className="flex flex-col transition-all duration-200 hover:shadow-lg cursor-pointer">
            <CardHeader className="p-0">
              {prompt.cover_img ? (
                <div className="h-24 sm:h-40 md:h-36 relative overflow-hidden rounded-t-lg">
                  <Image 
                    src={prompt.cover_img}
                    alt={prompt.title}
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    fill
                  />
                </div>
              ) : (
                <div className="h-32 sm:h-40 md:h-48 bg-muted/50 flex items-center justify-center rounded-t-lg">
                  <span className="text-muted-foreground/70">无封面图片</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 pt-2 pb-1.5 px-3 sm:pt-4 sm:pb-2 sm:px-6 h-[160px] sm:h-[180px]">
              <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-1 hover:text-primary transition-colors">
                {prompt.title}
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground/70 mb-1 sm:mb-2">
                <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                {prompt.version && (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">•</span>
                    <span>版本: {prompt.version}</span>
                  </div>
                )}
              </div>
              
              <p className="text-muted-foreground/90 text-xs sm:text-sm leading-5 sm:leading-6 max-h-[40px] sm:max-h-[48px] overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-6 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent">
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

            <CardFooter className="flex justify-end items-center border-t pt-1 pb-1 px-3 sm:pt-3 sm:pb-3 sm:px-6 mt-auto">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopy(prompt.content);
                  }}
                  className="hover:bg-secondary/80"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare(prompt.id);
                  }}
                  className="hover:bg-secondary/80"
                >
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 