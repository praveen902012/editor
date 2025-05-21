import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { base64ToBlob, downloadBlob, isValidBase64 } from '../utils/fileUtils';
import Button from './ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from './ui/Card';

interface Base64DecoderProps {
  onDecoded: (text: string) => void;
  onError: (message: string) => void;
}

const Base64Decoder: React.FC<Base64DecoderProps> = ({ onDecoded, onError }) => {
  const [base64Input, setBase64Input] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDecode = () => {
    if (!base64Input.trim()) {
      onError('Please enter a base64 string to decode');
      return;
    }

    if (!isValidBase64(base64Input)) {
      onError('Invalid base64 string. Please check your input');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Pass the decoded content to the parent component
      onDecoded(base64Input);
      setIsProcessing(false);
    } catch (error) {
      onError('Failed to decode base64 string');
      console.error('Decoding error:', error);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!base64Input || !fileName) {
      onError('Please enter a base64 string and filename');
      return;
    }

    try {
      // Determine mime type - this is a simplification, in reality
      // you might want to let the user specify the mime type
      const mimeType = 'application/octet-stream';
      const blob = base64ToBlob(base64Input, mimeType);
      downloadBlob(blob, fileName);
    } catch (error) {
      onError('Failed to download file');
      console.error('Download error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">Decode Base64</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div>
            <label htmlFor="base64-input" className="block text-sm font-medium text-gray-700 mb-1">
              Paste base64 string
            </label>
            <textarea
              id="base64-input"
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Paste your base64 encoded string here..."
              disabled={isProcessing}
            />
          </div>
          
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-1">
              Output filename (for download)
            </label>
            <input
              type="text"
              id="filename"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., document.doc"
              disabled={isProcessing}
            />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button
          variant="primary"
          onClick={handleDecode}
          disabled={!base64Input.trim() || isProcessing}
          className="mr-2"
        >
          {isProcessing ? 'Processing...' : 'Decode'}
        </Button>
        <Button
          variant="outline"
          icon={Download}
          onClick={handleDownload}
          disabled={!base64Input.trim() || !fileName.trim() || isProcessing}
        >
          Download File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Base64Decoder;