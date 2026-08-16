'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { useState, useRef } from 'react';
import { ArrowLeft, Upload, LayoutGrid, Download, X } from 'lucide-react';

function PhotoCollageMaker() {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Photo Collage Maker</h1>
      <p className="text-[var(--muted-foreground)] mb-6">Create beautiful photo collages from your images</p>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-[var(--border)]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = e.dataTransfer.files;
          if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" />
        <p className="text-sm font-medium">Drop images here or click to upload</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">JPG, PNG, WebP supported</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">{images.length} images</span>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-sm rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  // In a real implementation, this would generate the collage
                  alert('Collage generation would happen here!');
                }}
                className="px-3 py-1.5 text-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Collage
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--border)]">
                <img src={src} alt={`Collage ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PhotoCollageMakerToolWrapper() {
  const meta = tools.find(t => t.slug === 'photo-collage-maker');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PhotoCollageMaker />
    </EnhancedToolWrapper>
  );
}
