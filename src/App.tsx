import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import FileInfo from './components/FileInfo';
import TextPreview from './components/TextPreview';
import Base64Decoder from './components/Base64Decoder';
import DocumentEditor from './components/DocumentEditor';
import Navbar from './components/Navbar';
import AlertMessage from './components/AlertMessage';
import { FileDetails, ConversionMode } from './types';
import { Card, CardBody } from './components/ui/Card';

function App() {
  const [conversionMode, setConversionMode] = useState<ConversionMode>('encode');
  const [base64Data, setBase64Data] = useState<string>('');
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const handleFileConverted = (base64: string, details: FileDetails) => {
    setBase64Data(base64);
    setFileDetails(details);
    setAlert({
      message: 'File successfully converted to base64!',
      type: 'success'
    });
  };
  
  const handleBase64Decoded = (base64: string) => {
    setBase64Data(base64);
    setAlert({
      message: 'Base64 successfully decoded!',
      type: 'success'
    });
  };
  
  const handleError = (message: string) => {
    setAlert({
      message,
      type: 'error'
    });
  };
  
  const dismissAlert = () => {
    setAlert(null);
  };
  
  const handleModeChange = (mode: ConversionMode) => {
    setConversionMode(mode);
    setBase64Data('');
    setFileDetails(null);
  };

  const handleDocumentSave = (updatedBase64: string) => {
    setBase64Data(updatedBase64);
    setAlert({
      message: 'Document saved successfully!',
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar mode={conversionMode} onModeChange={handleModeChange} />
      
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onDismiss={dismissAlert}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {conversionMode === 'encode' ? 'Convert Document to Base64' : 'Decode Base64 to Document'}
          </h1>
          <p className="mt-2 text-gray-600">
            {conversionMode === 'encode'
              ? 'Upload a document to convert it to a base64 encoded string.'
              : 'Paste a base64 encoded string to decode it back to a document.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            {conversionMode === 'encode' ? (
              <Card>
                <CardBody>
                  <FileUploader 
                    onFileConverted={handleFileConverted} 
                    onError={handleError} 
                  />
                </CardBody>
              </Card>
            ) : (
              <Base64Decoder 
                onDecoded={handleBase64Decoded}
                onError={handleError}
              />
            )}
          </div>
          
          <div className="space-y-6">
            {conversionMode === 'encode' && fileDetails && (
              <FileInfo fileDetails={fileDetails} />
            )}
            
            {base64Data && (
              <>
                {fileDetails && (
                  <DocumentEditor
                    base64Data={base64Data}
                    fileType={fileDetails.type}
                    onSave={handleDocumentSave}
                  />
                )}
                <TextPreview 
                  text={base64Data}
                  label={conversionMode === 'encode' ? 'Base64 Output' : 'Decoded Base64 Input'}
                  mode={conversionMode}
                />
              </>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            DocConvert — Convert documents to and from base64 encoding with ease
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;