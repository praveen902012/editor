import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Save } from 'lucide-react';
import mammoth from 'mammoth';
import Button from './ui/Button';
import { Card, CardHeader, CardBody } from './ui/Card';

interface DocumentEditorProps {
  base64Data: string;
  fileType: string;
  onSave: (content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ base64Data, fileType, onSave }) => {
  const [content, setContent] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      setIsPdf(fileType === 'application/pdf');

      if (!isPdf) {
        try {
          // Convert base64 to ArrayBuffer
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const buffer = bytes.buffer;

          if (fileType.includes('word')) {
            // Use mammoth to convert Word document to HTML
            const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
            setContent(result.value);
          } else {
            // For plain text documents
            const textDecoder = new TextDecoder('utf-8');
            const text = textDecoder.decode(buffer);
            setContent(text);
          }
        } catch (error) {
          console.error('Error loading document:', error);
          setContent('Error loading document content. Please try again.');
        }
      }
      setIsLoading(false);
    };

    loadDocument();
  }, [base64Data, fileType, isPdf]);

  const handleSave = () => {
    if (!isPdf) {
      try {
        // Convert HTML content to UTF-8 bytes
        const encoder = new TextEncoder();
        const bytes = encoder.encode(content);
        
        // Convert bytes to base64
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Content = btoa(binary);
        onSave(base64Content);
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ]
  };

  if (isPdf) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">PDF Preview</h3>
        </CardHeader>
        <CardBody className="p-0 h-[600px]">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={`data:application/pdf;base64,${base64Data}`} />
          </Worker>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardBody className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600">Loading document...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Document Editor</h3>
        <Button
          variant="primary"
          size="sm"
          icon={Save}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </CardHeader>
      <CardBody className="p-0">
        <div className="h-[400px]">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-full"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default DocumentEditor;