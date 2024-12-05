'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Spinner } from '@/app/components/ui/Spinner';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    <div className="container mx-auto p-6 max-w-4xl">
      {prompt.cover_img && (
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden h-[400px]">
              <Image 
                src={prompt.cover_img} 
                alt={prompt.title}
                className="w-full h-full object-contain"
                width={1000}
                height={1000}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{prompt.title}</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant={copySuccess ? "success" : "secondary"}
              >
                {copySuccess ? '已复制' : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    复制提示词
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
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

          <div className="prose max-w-none mb-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">提示词内容</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap font-mono">{prompt.content}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">描述</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{prompt.description}</p>
              </CardContent>
            </Card>
          </div>

          {prompt.tags?.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">标签</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((pt) => (
                  <Badge key={pt} variant="secondary">
                    {pt}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 