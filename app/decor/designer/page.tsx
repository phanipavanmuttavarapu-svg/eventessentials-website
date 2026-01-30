"use client";

import StageCanvas from "@/components/StageCanvas";

export default function DecorDesigner() {
  return (
    <div className="p-6">
      {/* Canvas Container */}
      <div className="flex justify-center bg-gray-50 p-4 rounded-lg overflow-auto">
        <StageCanvas />
      </div>
    </div>
  );
}
