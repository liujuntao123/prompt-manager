import { Badge } from "@/components/ui/badge"

export default function TagFilter({ allTags, selectedTags, onTagSelect }) {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "outline"}
          className={`cursor-pointer hover:opacity-80 ${
            selectedTags.includes(tag) ? "" : "bg-background"
          }`}
          onClick={() => toggleTag(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
} 