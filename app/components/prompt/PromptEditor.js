'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PromptEditor({ initialPrompt, onSave }) {
  const [title, setTitle] = useState(initialPrompt?.title || '');
  const [content, setContent] = useState(initialPrompt?.content || '');
  const [description, setDescription] = useState(initialPrompt?.description || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    const promptData = {
      title,
      content,
      description,
      user_id: user.id,
    };

    if (initialPrompt?.id) {
      // Update existing prompt
      const { data, error } = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', initialPrompt.id)
        .select();
        
      if (!error && data) {
        await handleTagsUpdate(data[0].id);
        onSave?.(data[0]);
      }
    } else {
      // Create new prompt
      const { data, error } = await supabase
        .from('prompts')
        .insert([promptData])
        .select();
        
      if (!error && data) {
        await handleTagsUpdate(data[0].id);
        onSave?.(data[0]);
      }
    }
  };

  const handleTagsUpdate = async (promptId) => {
    // First remove existing tags
    await supabase
      .from('prompt_tags')
      .delete()
      .eq('prompt_id', promptId);

    // Then insert new tags
    const tagPromises = selectedTags.map(tagId =>
      supabase
        .from('prompt_tags')
        .insert({ prompt_id: promptId, tag_id: tagId })
    );

    await Promise.all(tagPromises);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {initialPrompt ? 'Update Prompt' : 'Create Prompt'}
      </button>
    </form>
  );
} 