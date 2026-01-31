"use client";

export default function UploadPanel({ onUpload }) {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    onUpload(imageURL);
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 cursor-pointer hover:text-blue-600">
        Choose Asset
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>
      <p className="text-[10px] text-gray-400">PNG or JPG supported</p>
    </div>
  );
}