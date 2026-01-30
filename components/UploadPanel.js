"use client";

export default function UploadPanel({ onUpload }) {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    onUpload(imageURL);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border p-2 rounded"
      />
    </div>
  );
}
