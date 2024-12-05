'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TagSelector({ selectedTags, onChange }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const { data } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    setTags(data || []);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    const { data, error } = await supabase
      .from('tags')
      .insert([{ name: newTag.trim() }])
      .select();

    if (!error && data) {
      setTags([...tags, data[0]]);
      setNewTag('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => {
              const isSelected = selectedTags.includes(tag.id);
              onChange(
                isSelected
                  ? selectedTags.filter((id) => id !== tag.id)
                  : [...selectedTags, tag.id]
              );
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add new tag"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          onClick={handleAddTag}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
} 