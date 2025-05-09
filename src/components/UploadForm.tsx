import React, { useState } from 'react';

interface UploadFormProps {
  onGenerate: (files: File[], prompt: string) => void;
  loading: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onGenerate, loading }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 2) {
      alert('Please upload at least 2 documents.');
      return;
    }
    onGenerate(files, prompt);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Documents (PDF or TXT):</label>
        <input type="file" multiple accept=".pdf,.txt" onChange={handleFileChange} />
      </div>
      <div>
        <label>Prompt:</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g. Create a training manual on the most important points"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};

export default UploadForm;