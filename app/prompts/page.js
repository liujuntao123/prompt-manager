'use client';
import { useState, useEffect } from 'react';
import PromptList from '@/app/components/prompt/PromptList';
import { Input } from "@/components/ui/input"
import { Spinner } from '@/app/components/ui/Spinner';
import TagFilter from '@/app/components/prompt/TagFilter';
import { Button } from "@/components/ui/button"
import { Search, PlusCircle } from "lucide-react"

async function getPrompts() {
  const res = await fetch('/api/prompts',{
    method:'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch prompts');
  }
  return res.json();
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        const data = await getPrompts();
        setPrompts(data.map(prompt => ({
          ...prompt,
          version: prompt.version || '1.0',
          cover_img: prompt.cover_img || '/default-cover.jpg',
          tags: prompt.tags?.split(',') || []
        })));
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const filteredPrompts = prompts.filter(prompt => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => prompt.tags.includes(tag));
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  const allTags = [...new Set(prompts.flatMap(prompt => prompt.tags))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索提示词..."
                  className="w-full h-12 pl-10 transition-all border rounded-lg focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <Button
              className="h-12 px-6 active:scale-95 transition-transform touch-manipulation md:active:scale-100 gap-2"
              onClick={() => window.location.href = '/prompts/new'}
            >
              <PlusCircle className="h-5 w-5" />
              新建提示词
            </Button>
          </div>
          <TagFilter 
            allTags={allTags}
            selectedTags={selectedTags}
            onTagSelect={setSelectedTags}
            className="pb-4 touch-manipulation"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="w-8 h-8" />
          </div>
        ) : (
          <div className="mt-8">
            <PromptList prompts={filteredPrompts} />
          </div>
        )}
      </div>
    </div>
  );
} 