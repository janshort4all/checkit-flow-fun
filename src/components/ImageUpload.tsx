
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageData {
  id: string;
  url: string;
  alt: string;
  name: string;
}

interface ImageUploadProps {
  images: ImageData[];
  onUpdate: (images: ImageData[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onUpdate, maxImages = 5 }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ImageData = {
            id: `img-${Date.now()}-${Math.random()}`,
            url: e.target?.result as string,
            alt: file.name,
            name: file.name
          };
          
          if (images.length < maxImages) {
            onUpdate([...images, newImage]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (imageId: string) => {
    onUpdate(images.filter(img => img.id !== imageId));
  };

  const updateImageAlt = (imageId: string, alt: string) => {
    onUpdate(images.map(img => 
      img.id === imageId ? { ...img, alt } : img
    ));
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Bilder hier hineinziehen oder klicken zum Auswählen
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Maximal {maxImages} Bilder, unterstützte Formate: JPG, PNG, GIF
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Bilder auswählen
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <Label>Hochgeladene Bilder</Label>
          {images.map((image) => (
            <div key={image.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <img
                src={image.url}
                alt={image.alt}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 space-y-2">
                <div className="text-sm font-medium">{image.name}</div>
                <Input
                  value={image.alt}
                  onChange={(e) => updateImageAlt(image.id, e.target.value)}
                  placeholder="Bildbeschreibung"
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeImage(image.id)}
                className="text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
