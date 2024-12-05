'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function VersionHistory({ promptId }) {
  const [versions, setVersions] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadVersions();
  }, [promptId]);

  const loadVersions = async () => {
    const { data } = await supabase
      .from('prompt_versions')
      .select('*')
      .eq('prompt_id', promptId)
      .order('version_number', { ascending: false });
    
    setVersions(data || []);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Version History</h3>
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className="border rounded-md p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">Version {version.version_number}</span>
              <span className="text-sm text-gray-500">
                {new Date(version.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{version.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 