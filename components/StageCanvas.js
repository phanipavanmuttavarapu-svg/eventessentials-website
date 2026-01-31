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
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const maskRef = useRef(null);
  const stageRef = useRef(null);

  const stageWidth = widthFt * PX_PER_FOOT;
  const stageHeight = heightFt * PX_PER_FOOT;

  const pushToHistory = (newItems) => {
    setHistory((prev) => [...prev, items]);
    setItems(newItems);
    setRedoStack([]); 
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [items, ...prev]);
    setItems(previous);
    setHistory((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, items]);
    setItems(next);
    setRedoStack((prev) => prev.slice(1));
  };

  useEffect(() => {
    const checkImports = () => {
      const importedData = localStorage.getItem("designer_imports");
      if (importedData) {
        const urls = JSON.parse(importedData);
        if (urls.length > 0) {
          const newAssets = urls.map(url => ({ id: Date.now() + Math.random(), src: url }));
          setLibrary(prev => [...prev, ...newAssets]);
          localStorage.removeItem("designer_imports");
        }
      }
    };
    checkImports();
    window.addEventListener('storage', checkImports);
    return () => window.removeEventListener('storage', checkImports);
  }, []);

  const exportStageAsImage = async () => {
    if (!stageRef.current) return;
    try {
      const dataUrl = await domToPng(stageRef.current, { quality: 1, features: { font: false } });
      const link = document.createElement("a");
      link.download = `StageDesign-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error("Export failed", err); }
  };

  const saveProject = () => {
    const projectData = { widthFt, heightFt, library, items };
    localStorage.setItem("stage_project_save", JSON.stringify(projectData));
    alert("Project saved locally!");
  };

  const loadProject = () => {
    const saved = localStorage.getItem("stage_project_save");
    if (saved) {
      const { widthFt, heightFt, library, items: loadedItems } = JSON.parse(saved);
      setWidthFt(widthFt); setHeightFt(heightFt); setLibrary(library); 
      pushToHistory(loadedItems);
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
        canvas.width = img.width; canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [croppedPreview]);

  const draw = (e) => {
    if (!drawing || !maskRef.current) return;
    if (e.cancelable) e.preventDefault();
    const canvas = maskRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = isRestore ? "source-over" : "destination-out";
    ctx.beginPath(); ctx.arc(x, y, brushSize, 0, Math.PI * 2); ctx.fill();
  };

  const finalizeCrop = () => {
    const finalImg = maskRef.current.toDataURL("image/png");
    setLibrary((p) => [...p, { id: Date.now(), src: finalImg }]);
    setCroppedPreview(null); setImageSrc(null);
  };

  const moveLayer = (id, action) => {
    const newItems = [...items];
    const index = newItems.findIndex(i => i.id === id);
    if (index === -1) return;
    const currentItem = newItems[index];
    const otherZs = newItems.filter(i => i.id !== id).map(i => i.z);
    const minZ = otherZs.length ? Math.min(...otherZs) : 0;
    const maxZ = otherZs.length ? Math.max(...otherZs) : 0;
    let newZ = currentItem.z;
    if (action === 'front') newZ = maxZ + 1;
    else if (action === 'back') newZ = minZ - 1;
    pushToHistory(newItems.map(i => i.id === id ? { ...i, z: newZ } : i));
  };

  const duplicateItem = (item) => {
    const newItem = { ...item, id: Date.now() + Math.random(), x: item.x + 20, y: item.y + 20, z: Math.max(...items.map(i => i.z), 0) + 1 };
    pushToHistory([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const addItem = (src) => {
    const newItem = { id: Date.now(), src, x: 50, y: 50, w: 120, h: 90, z: items.length + 1 };
    pushToHistory([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const updateItem = (id, patch) => {
    const updated = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setItems(updated);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans" onClick={() => setSelectedId(null)}>
      <header className="w-full bg-white border-b px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center shadow-sm z-30 gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          <h1 className="text-lg md:text-xl font-black text-blue-600 tracking-tighter uppercase italic">Stage Designer</h1>
          <div className="flex gap-1 md:gap-2">
            <button onClick={undo} disabled={history.length === 0} className="text-[10px] md:text-xs font-bold border px-3 py-2 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-all">Undo</button>
            <button onClick={redo} disabled={redoStack.length === 0} className="text-[10px] md:text-xs font-bold border px-3 py-2 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-all">Redo</button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1" />
            <button onClick={saveProject} className="text-[10px] md:text-xs font-bold border px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Save</button>
            <button onClick={loadProject} className="text-[10px] md:text-xs font-bold border px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Load</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500">
            W: <input type="number" value={widthFt} onChange={e => setWidthFt(+e.target.value)} className="w-10 md:w-12 border rounded p-1 text-center" />
            H: <input type="number" value={heightFt} onChange={e => setHeightFt(+e.target.value)} className="w-10 md:w-12 border rounded p-1 text-center" />
          </div>
          <button onClick={exportStageAsImage} className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] md:text-xs font-bold shadow-md hover:bg-blue-700 transition-all">
            Download
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <aside className="w-full md:w-[320px] bg-gray-50 border-b md:border-r p-4 md:p-5 overflow-x-auto md:overflow-y-auto flex flex-row md:flex-col gap-6" onClick={(e) => e.stopPropagation()}>
          <section className="min-w-[200px] md:min-w-0 space-y-3">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">New Asset</label>
            
            <div className="group relative">
              <input 
                type="file" 
                onChange={onUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-6 bg-white group-hover:bg-blue-50 group-hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 text-xl font-bold">+</span>
                </div>
                <span className="text-[11px] font-bold text-gray-700 group-hover:text-blue-700">Upload Image</span>
                <span className="text-[9px] text-gray-400 uppercase font-bold">PNG, JPG or SVG</span>
              </div>
            </div>

            {imageSrc && !croppedPreview && (
              <div className="space-y-2 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="relative h-32 md:h-40 w-full border rounded-lg overflow-hidden">
                  <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, p) => setCroppedAreaPixels(p)} />
                </div>
                <button onClick={saveCrop} className="w-full bg-blue-600 text-white py-2 rounded text-[10px] font-bold shadow-sm">Process Asset</button>
              </div>
            )}
          </section>

          {croppedPreview && (
            <section className="min-w-[200px] md:min-w-0 bg-white border border-gray-200 p-3 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Precision Mask</label>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-bold text-gray-400 uppercase">Brush</span>
                   <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-16 h-1 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>
              <div className="relative h-24 md:h-32 bg-gray-50 rounded-lg overflow-hidden flex justify-center border border-gray-100">
                <canvas 
                    ref={maskRef} 
                    onMouseDown={() => setDrawing(true)} onMouseUp={() => setDrawing(false)} onMouseMove={draw} 
                    onTouchStart={(e) => { setDrawing(true); draw(e); }} 
                    onTouchEnd={() => setDrawing(false)} onTouchMove={draw}
                    style={{ touchAction: 'none' }}
                    className="h-full w-auto cursor-crosshair" 
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsRestore(!isRestore)} className={`w-full py-2 rounded text-[10px] font-bold border transition-colors ${isRestore ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                   {isRestore ? "Drawing" : "Erasing"}
                </button>
                <button onClick={() => finalizeCrop()} className="w-full bg-blue-600 text-white py-2 rounded text-[10px] font-bold hover:bg-blue-700 shadow-sm uppercase tracking-wide">Add To Lib</button>
              </div>
            </section>
          )}

          <div className="min-w-[200px] md:min-w-0 border-t pt-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Library Assets</h3>
              <div className="flex md:grid md:grid-cols-2 gap-2">
                {library.map((item) => (
                  <div key={item.id} className="group shrink-0 relative w-16 h-16 md:w-auto md:aspect-square bg-white border border-gray-200 rounded-lg p-1 hover:border-blue-400 cursor-pointer overflow-hidden transition-all shadow-sm">
                     <img src={item.src} className="w-full h-full object-contain" onClick={() => addItem(item.src)} />
                     <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setLibrary(l => l.filter(i => i.id !== item.id))} className="bg-red-500 text-white p-1 text-[8px] rounded-bl-lg">✕</button>
                     </div>
                  </div>
                ))}
              </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-12 flex items-start md:items-center justify-start md:justify-center bg-gray-100">
          <div 
            ref={stageRef}
            style={{ 
              width: stageWidth, 
              height: stageHeight,
              backgroundColor: '#fff',
            }}
            className="relative shadow-2xl shrink-0 overflow-hidden border border-gray-300"
            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
          >
            {/* GRID OVERLAY - Always Visible */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-0" 
                 style={{ 
                   backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
                   backgroundSize: `${PX_PER_FOOT}px ${PX_PER_FOOT}px` 
                 }} 
            />
            
            {/* TILED LOGO WATERMARK - Always Visible */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[1] select-none"
                 style={{
                   backgroundImage: 'url("/logo.png")',
                   backgroundSize: '20px auto',
                   backgroundRepeat: 'repeat'
                 }}
            />

            {items.sort((a, b) => a.z - b.z).map((i) => (
              <Rnd
                key={i.id}
                bounds="parent"
                size={{ width: i.w, height: i.h }}
                position={{ x: i.x, y: i.y }}
                style={{ zIndex: i.z }}
                onDragStart={() => setSelectedId(i.id)}
                onDragStop={(e, d) => {
                  const updated = items.map(item => item.id === i.id ? { ...item, x: d.x, y: d.y } : item);
                  pushToHistory(updated);
                }}
                onResizeStop={(e, d, ref, delta, pos) => {
                  const updated = items.map(item => item.id === i.id ? { ...item, w: ref.offsetWidth, h: ref.offsetHeight, ...pos } : item);
                  pushToHistory(updated);
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedId(i.id); }}
              >
                <div className={`relative w-full h-full border transition-all ${selectedId === i.id ? 'border-blue-500 ring-4 ring-blue-500/10 z-[1000]' : 'border-transparent'}`}>
                  {selectedId === i.id && (
                    <>
                      {/* TOOLBAR */}
                      <div className="absolute -top-11 left-0 flex gap-1 bg-black text-white p-1 rounded-lg text-[9px] z-[9999] shadow-xl font-bold uppercase tracking-tight">
                        <button className="px-2 py-1 hover:bg-gray-800 rounded" onClick={(e) => { e.stopPropagation(); moveLayer(i.id, 'front'); }}>Top</button>
                        <button className="px-2 py-1 hover:bg-gray-800 rounded" onClick={(e) => { e.stopPropagation(); moveLayer(i.id, 'back'); }}>Bottom</button>
                        <button className="px-2 py-1 text-blue-300 hover:bg-gray-800 rounded" onClick={(e) => { e.stopPropagation(); duplicateItem(i); }}>Clone</button>
                        <button className="px-2 py-1 text-red-400 hover:bg-gray-800 rounded" onClick={(e) => { e.stopPropagation(); pushToHistory(items.filter(item => item.id !== i.id)); }}>✕</button>
                      </div>

                      {/* DIMENSIONS (Width/Height) */}
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black whitespace-nowrap shadow-lg ring-2 ring-white">
                        W: {(i.w / PX_PER_FOOT).toFixed(1)}ft
                      </div>
                      <div className="absolute top-1/2 -right-14 -translate-y-1/2 rotate-90 bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black whitespace-nowrap shadow-lg ring-2 ring-white">
                        H: {(i.h / PX_PER_FOOT).toFixed(1)}ft
                      </div>
                    </>
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