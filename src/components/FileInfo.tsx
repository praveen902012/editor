import React from 'react';
import { FileText, File as FileIcon } from 'lucide-react';
import { FileDetails } from '../types';
import { formatFileSize, getFileTypeIcon } from '../utils/fileUtils';
import { Card, CardBody } from './ui/Card';

interface FileInfoProps {
  fileDetails: FileDetails;
}

const FileInfo: React.FC<FileInfoProps> = ({ fileDetails }) => {
  const { name, size, type, lastModified } = fileDetails;
  const formattedSize = formatFileSize(size);
  const fileIcon = getFileTypeIcon(type);
  const lastModifiedDate = new Date(lastModified).toLocaleString();

  return (
    <Card className="mb-6">
      <CardBody className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-100 flex-shrink-0">
          {fileIcon === 'file-text' ? (
            <FileText size={24} className="text-blue-600" />
          ) : (
            <FileIcon size={24} className="text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-lg mb-1 truncate" title={name}>
            {name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-500">
            <div>
              <span className="inline-block w-24 text-gray-400">Type:</span>
              <span>{type || 'Unknown'}</span>
            </div>
            <div>
              <span className="inline-block w-24 text-gray-400">Size:</span>
              <span>{formattedSize}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="inline-block w-24 text-gray-400">Modified:</span>
              <span>{lastModifiedDate}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FileInfo;