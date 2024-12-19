'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';

export default function NewPrompt() {
  const [prompt, setPrompt] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
    version: '',
    cover_img: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/tags')
      .then((response) => response.json())
      .then((data) => {
        setTagOptions(data.map(tag => ({ value: tag.name, label: tag.name })));
      })
      .catch((error) => console.error('Error fetching tags:', error));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setPrompt({ ...prompt, cover_img: data.url });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (!res.ok) {
        throw new Error('Failed to create prompt');
      }

      router.push('/prompts');
    } catch (error) {
      console.error('Error creating prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tagSelectProps = {
    isCreatable: true,
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the input value
        const inputValue = e.target.value;
        if (inputValue) {
          // Call onCreateOption with the current input value
          tagSelectProps.onCreateOption(inputValue);
        }
      }
    },
    onCreateOption: async (inputValue) => {
      try {
        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: inputValue }),
        });
        
        if (response.ok) {
          const newOption = { value: inputValue, label: inputValue };
          setTagOptions([...tagOptions, newOption]);
          
          const newTags = prompt.tags ? `${prompt.tags},${inputValue}` : inputValue;
          setPrompt({ ...prompt, tags: newTags });
        }
      } catch (error) {
        console.error('Error creating new tag:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">创建新提示词</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={prompt.title}
                onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                value={prompt.content}
                onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                className="min-h-[128px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={prompt.description}
                onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">标签</Label>
              <CreatableSelect
                id="tags"
                isMulti
                value={prompt.tags?prompt.tags.split(',').map(tag => ({ value: tag, label: tag })):[]}
                onChange={(selected) => {
                  const tags = selected ? selected.map(option => option.value).join(',') : '';
                  setPrompt({ ...prompt, tags });
                }}
                options={tagOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                {...tagSelectProps}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">版本</Label>
              <Input
                id="version"
                value={prompt.version}
                onChange={(e) => setPrompt({ ...prompt, version: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_img">封面图片</Label>
              <div className="flex items-center gap-4">
                {prompt.cover_img && (
                  <Image src={prompt.cover_img} alt="封面预览" className="w-20 h-20 object-cover rounded" width={80} height={80} />
                )}
                <Input
                  id="cover_img"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '创建中...' : '创建'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 