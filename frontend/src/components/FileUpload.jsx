import React, { useState } from "react";

const FileUpload = ({ onFileSelect, inputId }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle single file selection
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; // Only select the first file
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file); // Pass the selected file to the parent component
      }
    }
  };

  return (
    <div className="file-upload-container">
      {/* Attach Button */}
      <label htmlFor={inputId} className="file-button">
        Attach File
      </label>

      {/* Hidden File Input (Ensures each instance is independent) */}
      <input 
        type="file" 
        id={inputId} 
        className="file-input" 
        onChange={handleFileChange} 
        accept=".pdf,.png,.jpg,.jpeg" /* Optional: Restrict file types */
        multiple={false} /* Ensures only one file is selected */
      />

      {/* Show Selected File Name */}
      {selectedFile && (
        <p className="file-name">Selected File: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default FileUpload;
