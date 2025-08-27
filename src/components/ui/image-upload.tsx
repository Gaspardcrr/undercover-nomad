import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  fallback: string;
  className?: string;
}

export function ImageUpload({ value, onChange, fallback, className }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      <Avatar className="w-16 h-16 border-2 border-border">
        {value ? (
          <AvatarImage src={value} alt="Profile" />
        ) : null}
        <AvatarFallback className="bg-muted text-muted-foreground text-lg font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute -bottom-2 -right-2 flex gap-1">
        <Button
          size="sm"
          variant="secondary"
          className="w-8 h-8 rounded-full p-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="w-4 h-4" />
        </Button>
        {value && (
          <Button
            size="sm"
            variant="destructive"
            className="w-8 h-8 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}