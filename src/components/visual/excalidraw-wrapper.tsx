"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Excalidraw is client-side only and needs dynamic import
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

interface ExcalidrawWrapperProps {
  initialData?: string;
  onChange: (data: string) => void;
  isEditable?: boolean;
}

export default function ExcalidrawWrapper({ 
  initialData, 
  onChange, 
  isEditable = true 
}: ExcalidrawWrapperProps) {
  const [elements, setElements] = useState<any[]>([]);
  const [appState, setAppState] = useState<any>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        setElements(data.elements || []);
        setAppState(data.appState || {});
      } catch (e) {
        console.error("Failed to parse Excalidraw data", e);
      }
    }
    setIsLoaded(true);
  }, [initialData]);

  const handleChange = (newElements: readonly any[], newAppState: any) => {
    if (!isEditable) return;
    
    setElements([...newElements]);
    setAppState(newAppState);
    
    // Save to parent
    onChange(JSON.stringify({
      elements: newElements,
      appState: {
        viewBackgroundColor: newAppState.viewBackgroundColor,
        currentItemFontFamily: newAppState.currentItemFontFamily,
      }
    }));
  };

  if (!isLoaded) return <div className="h-96 w-full animate-pulse bg-secondary/10 rounded-lg" />;

  return (
    <div className="h-[450px] w-full border border-border rounded-lg overflow-hidden relative gh-box">
      <Excalidraw
        initialData={{
          elements: elements,
          appState: { ...appState, theme: "dark" },
          scrollToContent: true,
        }}
        onChange={handleChange}
        theme="dark"
        viewModeEnabled={!isEditable}
      />
    </div>
  );
}
