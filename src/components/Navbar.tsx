import React from 'react';
import { FileUp, FileDown, RefreshCw } from 'lucide-react';
import { ConversionMode } from '../types';

interface NavbarProps {
  mode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, onModeChange }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <RefreshCw size={20} className="text-blue-500 mr-2" />
            <span className="text-xl font-medium text-gray-900">DocConvert</span>
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <button
              className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                mode === 'encode'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onModeChange('encode')}
            >
              <FileUp size={18} className="mr-1.5" />
              <span className="hidden sm:inline">Encode to Base64</span>
              <span className="sm:hidden">Encode</span>
            </button>
            
            <button
              className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                mode === 'decode'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onModeChange('decode')}
            >
              <FileDown size={18} className="mr-1.5" />
              <span className="hidden sm:inline">Decode from Base64</span>
              <span className="sm:hidden">Decode</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;