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

            <CardContent className="flex-1 pt-4 pb-2">
              <h3 className="text-xl font-semibold mb-2 line-clamp-1 hover:text-primary transition-colors">
                {prompt.title}
              </h3>
              
              {prompt.version && (
                <div className="text-sm text-muted-foreground/80 mb-2">
                  版本: {prompt.version}
                </div>
              )}
              
              <p className="text-muted-foreground/90 mb-3 line-clamp-2">{prompt.content}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags?.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-secondary/80 text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full hover:bg-secondary transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t pt-3 pb-3 mt-auto">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground/70">
                  {new Date(prompt.created_at).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopy(prompt.content);
                  }}
                  className="hover:bg-secondary/80"
                >
                  <Copy className="h-4 w-4" />
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
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 