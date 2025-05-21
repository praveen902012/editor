import React, { useState, useRef } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { FileDetails } from '../types';
import { isValidFileType, fileToBase64, getFileDetails } from '../utils/fileUtils';
import Button from './ui/Button';

interface FileUploaderProps {
  onFileConverted: (base64: string, fileDetails: FileDetails) => void;
  onError: (message: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileConverted, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!isValidFileType(file)) {
      onError('Unsupported file type. Please upload a .doc, .docx, .pdf, or .txt file.');
      return;
    }

    setIsProcessing(true);
    try {
      const base64 = await fileToBase64(file);
      const fileDetails = getFileDetails(file);
      onFileConverted(base64, fileDetails);
    } catch (error) {
      onError('Failed to convert file. Please try again.');
      console.error('File conversion error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center text-center
          transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${isProcessing ? 'opacity-70 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          accept=".doc,.docx,.pdf,.txt"
        />
        
        {isProcessing ? (
          <div className="my-4 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mb-3"></div>
            <p className="text-gray-600">Processing file...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 bg-blue-100 p-3 rounded-full">
              <Upload size={24} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Upload a .doc, .docx, .pdf, or .txt file to convert to base64
            </p>
            <Button variant="primary" size="md" icon={FileIcon}>
              Browse Files
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;