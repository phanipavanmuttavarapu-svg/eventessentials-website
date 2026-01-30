"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Rnd } from "react-rnd";
import { domToPng } from "modern-screenshot";

const PX_PER_FOOT = 20; 

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((r) => (image.onload = r));
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return canvas.toDataURL("image/png");
}

export default function StageDesigner() {
  const [widthFt, setWidthFt] = useState(40);
  const [heightFt, setHeightFt] = useState(15);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [library, setLibrary] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [brushSize, setBrushSize] = useState(25);
  const [isRestore, setIsRestore] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const maskRef = useRef(null);
  const stageRef = useRef(null);

  const stageWidth = widthFt * PX_PER_FOOT;
  const stageHeight = heightFt * PX_PER_FOOT;

  const exportStageAsImage = async () => {
    if (!stageRef.current) return;
    try {
      const dataUrl = await domToPng(stageRef.current, {
        quality: 1,
        features: { font: false }
      });
      const link = document.createElement("a");
      link.download = `stage-design-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed.");
    }
  };

  const downloadAsset = (src, id) => {
    const link = document.createElement("a");
    link.download = `asset-${id}.png`;
    link.href = src;
    link.click();
  };

  const saveProject = () => {
    const projectData = { widthFt, heightFt, library, items };
    localStorage.setItem("stage_project_save", JSON.stringify(projectData));
    alert("Project saved locally!");
  };

  const loadProject = () => {
    const saved = localStorage.getItem("stage_project_save");
    if (saved) {
      const { widthFt, heightFt, library, items } = JSON.parse(saved);
      setWidthFt(widthFt); setHeightFt(heightFt); setLibrary(library); setItems(items);
    }
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { setImageSrc(r.result); setCroppedPreview(null); };
    r.readAsDataURL(file);
  };

  const saveCrop = async () => {
    const img = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedPreview(img);
  };

  useEffect(() => {
    if (croppedPreview && maskRef.current) {
      const canvas = maskRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = croppedPreview;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [croppedPreview]);

  const draw = (e) => {
    if (!drawing || !maskRef.current) return;
    const canvas = maskRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = isRestore ? "source-over" : "destination-out";
    ctx.beginPath(); ctx.arc(x, y, brushSize, 0, Math.PI * 2); ctx.fill();
  };

  const finalizeCrop = () => {
    const finalImg = maskRef.current.toDataURL("image/png");
    setLibrary((p) => [...p, { id: Date.now(), src: finalImg }]);
    setCroppedPreview(null); setImageSrc(null);
  };

  /* ---------- UPDATED: Layering Logic ---------- */
  const moveLayer = (id, action) => {
    setItems(prev => {
      const currentItem = prev.find(i => i.id === id);
      if (!currentItem) return prev;
      
      const otherZs = prev.filter(i => i.id !== id).map(i => i.z);
      const minZ = otherZs.length ? Math.min(...otherZs) : 0;
      const maxZ = otherZs.length ? Math.max(...otherZs) : 0;

      let newZ = currentItem.z;
      if (action === 'front') newZ = maxZ + 1;
      // We set it to minZ - 1 so it stays behind other images but inside the stage
      else if (action === 'back') newZ = minZ - 1;
      
      return prev.map(i => i.id === id ? { ...i, z: newZ } : i);
    });
  };

  /* ---------- NEW: Duplicate Logic ---------- */
  const duplicateItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      x: item.x + 20, // Offset so user sees it
      y: item.y + 20,
      z: Math.max(...items.map(i => i.z), 0) + 1
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const addItem = (src) => {
    const newItem = { id: Date.now(), src, x: 50, y: 50, w: 120, h: 90, z: items.length + 1 };
    setItems((p) => [...p, newItem]);
    setSelectedId(newItem.id);
  };

  const updateItem = (id, patch) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans" onClick={() => setSelectedId(null)}>
      <header className="w-full bg-white border-b px-8 py-3 flex justify-between items-center shadow-sm z-30" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-black text-blue-600 tracking-tighter">STAGE DESIGNER</h1>
          <div className="flex gap-2">
            <button onClick={saveProject} className="text-xs font-bold border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Save</button>
            <button onClick={loadProject} className="text-xs font-bold border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Load</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            W (FT): <input type="number" value={widthFt} onChange={e => setWidthFt(+e.target.value)} className="w-12 border rounded p-1 text-center" />
            H (FT): <input type="number" value={heightFt} onChange={e => setHeightFt(+e.target.value)} className="w-12 border rounded p-1 text-center" />
          </div>
          <button onClick={exportStageAsImage} className="px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-700">
            Download Image
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[320px] bg-gray-50 border-r p-5 overflow-y-auto flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
          <section className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase">New Asset</label>
            <input type="file" onChange={onUpload} className="text-xs w-full" />
            {imageSrc && !croppedPreview && (
              <div className="space-y-2">
                <div className="relative h-40 w-full border rounded-lg overflow-hidden">
                  <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, p) => setCroppedAreaPixels(p)} />
                </div>
                <button onClick={saveCrop} className="w-full bg-blue-600 text-white py-2 rounded text-xs font-bold">Process Image</button>
              </div>
            )}
          </section>

          {croppedPreview && (
            <section className="bg-gray-900 p-3 rounded-xl space-y-3">
              <div className="relative h-32 bg-gray-800 rounded-lg overflow-hidden flex justify-center">
                <canvas ref={maskRef} onMouseDown={() => setDrawing(true)} onMouseUp={() => setDrawing(false)} onMouseMove={draw} className="h-full w-auto cursor-crosshair" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsRestore(false)} className={`flex-1 py-1 text-[9px] font-bold rounded ${!isRestore ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}>Erase</button>
                <button onClick={() => setIsRestore(true)} className={`flex-1 py-1 text-[9px] font-bold rounded ${isRestore ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>Restore</button>
              </div>
              <button onClick={finalizeCrop} className="w-full bg-blue-500 text-white py-2 rounded text-xs font-bold">Add to Library</button>
            </section>
          )}

          <div className="border-t pt-4">
             <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3">Library</h3>
             <div className="grid grid-cols-2 gap-2">
               {library.map((item) => (
                 <div key={item.id} className="group relative aspect-square bg-white border rounded-lg p-1 hover:border-blue-400 cursor-pointer overflow-hidden">
                    <img src={item.src} className="w-full h-full object-contain" onClick={() => addItem(item.src)} />
                    <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => downloadAsset(item.src, item.id)} className="bg-blue-500 text-white p-1 text-[10px]" title="Download">💾</button>
                      <button onClick={() => setLibrary(l => l.filter(i => i.id !== item.id))} className="bg-red-500 text-white p-1 text-[10px]" title="Delete">✕</button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-12 flex items-center justify-center bg-gray-100">
          <div 
            ref={stageRef}
            style={{ width: stageWidth, height: stageHeight }}
            className="relative bg-white shadow-2xl shrink-0 overflow-hidden"
            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
          >
            {/* Grid with pointer-events-none ensures items are always clickable regardless of Z-Index */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: `${PX_PER_FOOT}px ${PX_PER_FOOT}px` }} />
            
            {items.sort((a, b) => a.z - b.z).map((i) => (
              <Rnd
                key={i.id}
                bounds="parent"
                size={{ width: i.w, height: i.h }}
                position={{ x: i.x, y: i.y }}
                style={{ zIndex: i.z }}
                onDragStart={() => setSelectedId(i.id)}
                onDragStop={(e, d) => updateItem(i.id, { x: d.x, y: d.y })}
                onResizeStop={(e, d, ref, delta, pos) => updateItem(i.id, { w: ref.offsetWidth, h: ref.offsetHeight, ...pos })}
                onClick={(e) => { e.stopPropagation(); setSelectedId(i.id); }}
              >
                <div className={`relative w-full h-full border transition-all ${selectedId === i.id ? 'border-blue-500' : 'border-transparent'}`}>
                  {selectedId === i.id && (
                    <div className="absolute -top-8 left-0 flex gap-1 bg-black text-white p-1 rounded text-[10px] z-[9999]">
                      <button onClick={(e) => { e.stopPropagation(); moveLayer(i.id, 'front'); }}>Top</button>
                      <button onClick={(e) => { e.stopPropagation(); moveLayer(i.id, 'back'); }}>Bottom</button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateItem(i); }} className="text-blue-300">Duplicate</button>
                      <button onClick={(e) => { e.stopPropagation(); setItems(p => p.filter(item => item.id !== i.id)); }} className="text-red-400">Delete</button>
                    </div>
                  )}
                  <img src={i.src} className="w-full h-full object-contain pointer-events-none" />
                </div>
              </Rnd>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}