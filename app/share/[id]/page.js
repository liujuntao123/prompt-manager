'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Spinner } from '@/app/components/ui/Spinner';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Copy } from "lucide-react"

export default function SharePromptDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [prompt, setPrompt] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/share/${id}`)
        .then((response) => response.json())
        .then((data) => setPrompt({...data, cover_img: data.cover_img ? data.cover_img : null, tags: data.tags ? data.tags.split(',') : []}))
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
        <h1 className="text-lg sm:text-2xl font-bold flex-grow">{prompt.title}</h1>
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
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              {copySuccess ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
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
    </div>
  );
} 