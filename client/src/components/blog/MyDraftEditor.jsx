import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import React-Quill styles

const MyQuillEditor =({ onEditorChange }) => {
    const [editorValue, setEditorValue] = useState('');
  
    const handleEditorChange = (value) => {
      setEditorValue(value);
      onEditorChange(value); // Notify the parent component about the editor content
    };
  
    return (
      <div>
        <ReactQuill value={editorValue} onChange={handleEditorChange} />
      </div>
    );
  };

export default MyQuillEditor;
