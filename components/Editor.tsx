'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Basic fallback component to show when the editor fails to load
const FallbackEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  disabled 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  disabled?: boolean; 
}) => (
  <div className="border p-4 rounded bg-gray-50">
    <p className="text-gray-700 mb-2">Rich text editor unavailable</p>
    <textarea 
      value={value || ''} 
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder || ''}
      disabled={disabled}
      className="w-full h-[300px] p-2 border rounded"
    />
  </div>
);

// Dynamically import the Quill editor with error handling
const QuillEditor = dynamic(
  async () => {
    const QuillNoSSRWrapper = (props: any) => {
      const [mounted, setMounted] = useState(false);
      
      useEffect(() => {
        setMounted(true);
      }, []);

      if (!mounted) return null;

      const ReactQuill = require('react-quill-new').default;
      return <ReactQuill {...props} />;
    };
    return QuillNoSSRWrapper;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-gray-100 animate-pulse flex items-center justify-center">
        Loading editor...
      </div>
    )
  }
);

// Minimal toolbar configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
  clipboard: {
    matchVisual: false
  },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true
  }
};

// Props interface for the Editor component
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Editor({
  value,
  onChange,
  placeholder = 'Start writing your content...',
  className = '',
  disabled = false
}: EditorProps) {
  // State management
  const [editorMounted, setEditorMounted] = useState(false);
  const [editorFailed, setEditorFailed] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  // Handle component mounting
  useEffect(() => {
    try {
      setEditorMounted(true);
      
      // Cleanup on unmount
      return () => {
        setEditorMounted(false);
      };
    } catch (error) {
      console.error('Error initializing editor component:', error);
      setEditorFailed(true);
    }
  }, []);

  // Sync with parent value changes
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  // Safe change handler
  const handleChange = (newContent: string) => {
    try {
      setInternalValue(newContent || '');
      if (typeof onChange === 'function') {
        onChange(newContent || '');
      }
    } catch (error) {
      console.error('Error in editor onChange handler:', error);
      setEditorFailed(true);
    }
  };

  // If not mounted yet or in SSR, show nothing
  if (!editorMounted) {
    return (
      <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center">
        Initializing editor...
      </div>
    );
  }

  // If editor failed to load, use fallback
  if (editorFailed) {
    return (
      <FallbackEditor
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  }

  // Return the actual editor with error boundary
  return (
    <div className={`editor-container ${className} ${disabled ? 'opacity-60' : ''}`}>
      <ErrorBoundary fallback={
        <FallbackEditor
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      }>
       <QuillEditor
          theme="snow"
          value={internalValue}
          onChange={handleChange}
          modules={modules}
          formats={['header', 'bold', 'italic', 'list', 'link']}
          placeholder={placeholder}
          readOnly={disabled}
          className="min-h-[300px]"
        />
      </ErrorBoundary>
    </div>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Editor error boundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}