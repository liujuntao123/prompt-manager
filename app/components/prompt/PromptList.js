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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {prompts?.map((prompt) => (
        <Card key={prompt.id} className="flex flex-col  transition-all duration-200 hover:shadow-lg">
          <CardHeader className="p-0">
            {prompt.cover_img ? (
              <div className="h-48 relative overflow-hidden rounded-t-lg">
                <Image 
                  src={prompt.cover_img}
                  alt={prompt.title}
                  className="object-cover hover:scale-105 transition-transform duration-200"
                  fill
                />
              </div>
            ) : (
              <div className="h-48 bg-muted/50 flex items-center justify-center rounded-t-lg">
                <span className="text-muted-foreground/70">无封面图片</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 pt-6 pb-2">
            <h3 className="text-xl font-semibold mb-3 line-clamp-1 hover:text-primary transition-colors">
              {prompt.title}
            </h3>
            
            {prompt.version && (
              <div className="text-sm text-muted-foreground/80 mb-3">
                版本: {prompt.version}
              </div>
            )}
            
            <p className="text-muted-foreground/90 mb-4 line-clamp-2">{prompt.content}</p>
            
            <div className="flex flex-wrap gap-2 ">
              {prompt.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="bg-secondary/80 text-secondary-foreground text-xs px-3 py-1 rounded-full hover:bg-secondary transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground/70">
                {new Date(prompt.created_at).toLocaleDateString()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(prompt.content)}
                className="hover:bg-secondary/80"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare(prompt.id)}
                className="hover:bg-secondary/80"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="link" asChild className="font-medium hover:text-primary p-0">
              <Link href={`/prompts/${prompt.id}`}>
                查看详情 →
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 