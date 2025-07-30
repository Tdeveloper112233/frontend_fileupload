import React, { useState, useEffect } from "react";
import axios from "axios";

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/files");
      setUploadedFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      await axios.post("http://localhost:5000/upload", formData);
      setFiles([]);
      fetchFiles(); // Refresh list
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Uploaded Files</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((file, idx) => {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
            const fileUrl = file.url || `http://localhost:5000/uploads/${file.name}`;

            return (
              <div key={idx} className="bg-white p-3 rounded shadow text-center">
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="text-gray-700 mb-2">{file.name}</div>
                )}
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-1 text-blue-600 underline text-sm"
                >
                  Download
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
