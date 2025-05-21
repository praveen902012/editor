import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import Button from './ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from './ui/Card';

interface TextPreviewProps {
  text: string;
  label: string;
  mode: 'encode' | 'decode';
}

const TextPreview: React.FC<TextPreviewProps> = ({ text, label, mode }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Only show a truncated preview for better performance
  const maxPreviewLength = 1000;
  const truncatedText = text.length > maxPreviewLength
    ? `${text.substring(0, maxPreviewLength)}...`
    : text;
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center justify-between bg-gray-50">
        <h3 className="font-medium text-gray-700">{label}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyToClipboard}
          icon={isCopied ? CheckCircle : Copy}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </CardHeader>
      <CardBody className="p-0">
        <div className="relative">
          <pre className="text-xs text-gray-800 bg-gray-50 p-4 rounded m-0 overflow-x-auto max-h-[300px]">
            {truncatedText}
          </pre>
          {text.length > maxPreviewLength && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 to-transparent h-16 pointer-events-none"></div>
          )}
        </div>
      </CardBody>
      <CardFooter className="text-xs text-gray-500 bg-gray-50">
        {text.length > maxPreviewLength 
          ? `Preview showing ${maxPreviewLength} of ${text.length} characters` 
          : `${text.length} characters`
        }
      </CardFooter>
    </Card>
  );
};

export default TextPreview;