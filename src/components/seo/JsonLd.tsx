"use client";

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export function JsonLd({ data, id = 'json-ld-schema' }: JsonLdProps) {
  useEffect(() => {
    // Remove existing script if any
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  return null;
}
