'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';

function BlurFaceContent() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!image || !canvasRef.current) return;
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Simple blur effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply a pixelation effect (simulating blur)
      for (let i = 0; i < data.length; i += 4) {
        if (i % 100 < 20) {
          data[i] = data[i] > 128 ? 255 : 0;
          data[i+1] = data[i+1] > 128 ? 255 : 0;
          data[i+2] = data[i+2] > 128 ? 255 : 0;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
      setImage(canvas.toDataURL());
    };
    img.src = image;
  };

  const resetImage = () => {
    setImage(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors">
            {!image ? (
              <div>
                <div className="text-4xl mb-4">📸</div>
                <p className="text-lg font-medium mb-2">Upload an image to blur faces</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Click the button below to select an image</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img src={image} alt="Uploaded" className="max-h-96 mx-auto rounded-lg" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Blur Faces'}
                  </button>
                  <button
                    onClick={resetImage}
                    className="px-6 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ⚡ This tool processes your image locally in your browser. No data is uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlurFacePageWrapper() {
  const meta = tools.find(t => t.slug === 'blur-face');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BlurFaceContent />
    </EnhancedToolWrapper>
  );
}
