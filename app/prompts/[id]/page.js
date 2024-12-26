'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Spinner } from '@/app/components/ui/Spinner';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MoreVertical, Copy, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PromptDetail({ params }) {
  const router = useRouter();
  const {id} = use(params);
  const [prompt, setPrompt] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch the prompt data from your API or data source
      fetch(`/api/prompts/${id}`)
        .then((response) => response.json())
        .then((data) => setPrompt({...data, cover_img: data.cover_img ? data.cover_img : null,tags: data.tags ? data.tags.split(',') : []}))
        .catch((error) => console.error('Error fetching prompt:', error));
    }
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/prompts');
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const handleShare = async () => {
    try {
      // 首先调用 API 将提示词设为公开
      const response = await fetch(`/api/prompts/share/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('分享失败');
      }

      // 成功后复制分享链接
      const shareUrl = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to share prompt:', err);
      // 可以添加错误提示
      alert('分享失败，请稍后重试');
    }
  };

  if (!prompt) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-6 max-w-4xl">
      <div className="flex items-center gap-2 sm:gap-4 mb-6">
        <Button
          variant="ghost"
          className="text-muted-foreground h-8 sm:h-10 p-0"
          onClick={() => router.push('/prompts')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg sm:text-2xl font-bold flex-grow">{prompt.title}</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShare}>
              {shareSuccess ? "已分享" : "分享"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/prompts/${id}/edit`)}>
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive"
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(prompt.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Version {prompt.version}
          </div>
        </div>
        
        {prompt.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((pt) => (
              <Badge key={pt} variant="outline">{pt}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">提示词内容</h2>
        <div className="relative p-4 rounded-lg bg-muted/50 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCopy}
            className="absolute top-2 right-2 text-muted-foreground h-8 w-8 bg-background/50 hover:bg-background/80"
          >
            {copySuccess ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <p className="text-xs sm:text-sm leading-tight whitespace-pre-wrap font-mono">
            {prompt.content}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">描述</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{prompt.description}</p>
      </div>

      {prompt.cover_img && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">封面图片</h2>
          <div className="rounded-lg overflow-hidden h-[200px] sm:h-[400px]">
            <Image 
              src={prompt.cover_img} 
              alt={prompt.title}
              className="w-full h-full object-contain bg-muted"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">确定要删除这个提示词吗？此操作无法撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setShowDeleteConfirm(false);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 