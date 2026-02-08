"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Rnd } from "react-rnd";
import { domToPng } from "modern-screenshot";
import AppLayout from "./AppLayout";

const PX_PER_FOOT = 25;
const DB_NAME = "StageDesignerDB_V2";
const STORE_NAME = "ProjectGallery";

const FLOOR_TEXTURES = [
  { id: 'grid', label: 'Grid', color: '#ffffff', pattern: true },
  { id: 'wood', label: 'Wood', color: '#78350f', pattern: false },
  { id: 'concrete', label: 'Concrete', color: '#64748b', pattern: false },
  { id: 'dark', label: 'Stage Black', color: '#111827', pattern: false },
];

const STAGE_TEMPLATES = [
  { id: 'concert', label: 'Concert', width: 40, height: 25, wall: 8, floor: 'dark' },
  { id: 'theater', label: 'Theater', width: 50, height: 30, wall: 12, floor: 'dark' },
  { id: 'conference', label: 'Conference', width: 60, height: 15, wall: 8, floor: 'concrete' },
  { id: 'fashion', label: 'Fashion Show', width: 80, height: 20, wall: 6, floor: 'dark' },
  { id: 'wedding', label: 'Wedding', width: 50, height: 40, wall: 10, floor: 'wood' },
  { id: 'exhibition', label: 'Exhibition', width: 100, height: 50, wall: 8, floor: 'grid' },
];

const LIGHTING_PRESETS = [
  { id: 'none', label: 'None', color: 'transparent', intensity: 0 },
  { id: 'warm', label: 'Warm White', color: 'rgba(255, 200, 87, 0.15)', intensity: 0.15 },
  { id: 'cool', label: 'Cool Blue', color: 'rgba(59, 130, 246, 0.15)', intensity: 0.15 },
  { id: 'dramatic', label: 'Dramatic Red', color: 'rgba(239, 68, 68, 0.2)', intensity: 0.2 },
  { id: 'ambient', label: 'Ambient Purple', color: 'rgba(139, 92, 246, 0.15)', intensity: 0.15 },
];

const CAMERA_PRESETS = [
  { id: 'aerial', label: '🛸 Aerial', rotX: -60, rotZ: 0, zoom: 1 },
  { id: 'frontal', label: '📹 Frontal', rotX: 0, rotZ: 0, zoom: 1 },
  { id: 'perspective', label: '🎭 Perspective', rotX: -35, rotZ: 20, zoom: 0.85 },
  { id: 'isometric', label: '📐 Isometric', rotX: -45, rotZ: 45, zoom: 0.9 },
  { id: 'side', label: '➡️ Side', rotX: 0, rotZ: 90, zoom: 1 },
];

const HEADER_PATTERN = { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 8px)' };

// --- INDEXEDDB ENGINE ---
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveProjectToDB = async (project) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(project);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const getAllProjects = async () => {
  const db = await initDB();
  return new Promise((resolve) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
  });
};

const deleteProjectFromDB = async (id) => {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
  });
};

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((r) => (image.onload = r));
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return canvas.toDataURL("image/png");
}

export default function StageDesigner() {
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState("New Design");
  const [widthFt, setWidthFt] = useState(30);
  const [heightFt, setHeightFt] = useState(15);
  const [wallFt, setWallFt] = useState(6);
  const [floorTexture, setFloorTexture] = useState(FLOOR_TEXTURES[1]);
  const [showSpotlights, setShowSpotlights] = useState(true);
  
  const [library, setLibrary] = useState([]);
  const [items, setItems] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastAutoSave, setLastAutoSave] = useState(null);

  // Editor states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [brushSize, setBrushSize] = useState(25);
  const [brushColor, setBrushColor] = useState("#22c55e");
  const [isRestore, setIsRestore] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [canvasRedoStack, setCanvasRedoStack] = useState([]);

  // New Features
  const [gridSnap, setGridSnap] = useState(false);
  const [snapSize, setSnapSize] = useState(25);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [lightingPreset, setLightingPreset] = useState(LIGHTING_PRESETS[0]);
  const [cameraPreset, setCameraPreset] = useState(CAMERA_PRESETS[1]);
  const [rotX, setRotX] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [resizingInfo, setResizingInfo] = useState({ id: null, w: 0, h: 0 });
  const [lightingIntensity, setLightingIntensity] = useState(lightingPreset.intensity || 0);
  const [isDragging3D, setIsDragging3D] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0, z: 0 });

  const maskRef = useRef(null);
  const stageRef = useRef(null);
  const stageContainerRef = useRef(null);

  const stageWidth = widthFt * PX_PER_FOOT;
  const stageHeight = heightFt * PX_PER_FOOT;
  const extraDim = wallFt * PX_PER_FOOT;

  const refreshGallery = async () => {
    const projs = await getAllProjects();
    setSavedProjects(projs.sort((a, b) => b.timestamp - a.timestamp));
  };

  useEffect(() => { refreshGallery(); }, []);

  // sync intensity when preset changes
  useEffect(() => {
    setLightingIntensity(lightingPreset.intensity || 0);
  }, [lightingPreset]);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const parseRGB = (rgba) => {
    if (!rgba || rgba === 'transparent') return null;
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    return `${m[1]}, ${m[2]}, ${m[3]}`;
  };

  const lightingColorFor = (preset, intensity) => {
    if (!preset || preset.color === 'transparent') return null;
    const rgb = parseRGB(preset.color);
    if (!rgb) return preset.color;
    return `rgba(${rgb}, ${clamp(intensity, 0, 1)})`;
  };

  // Listen for images selected from the Decor page and start the crop workflow
  useEffect(() => {
    const handler = (e) => {
      const src = e?.detail?.src || e?.detail?.url;
      if (!src) return;

      // Try to fetch the image and convert to dataURL to avoid CORS canvas issues
      (async () => {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result);
            setCroppedPreview(null);
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          console.warn('Could not fetch remote image, falling back to URL', err);
          setImageSrc(src);
          setCroppedPreview(null);
        }
      })();
    };

    window.addEventListener('decor:imageSelected', handler);
    return () => window.removeEventListener('decor:imageSelected', handler);
  }, []);

  const filteredProjects = savedProjects.filter(p => 
    p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (isSilent = false) => {
    const id = projectId || Date.now().toString();
    const newProject = {
      id,
      projectName,
      widthFt,
      heightFt,
      wallFt,
      floorTexture,
      showSpotlights,
      library,
      items,
      timestamp: Date.now()
    };
    await saveProjectToDB(newProject);
    if (!projectId) setProjectId(id);
    refreshGallery();
    if (!isSilent) alert("Project saved successfully!");
    setLastAutoSave(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (items.length > 0 || library.length > 0) {
        handleSave(true);
      }
    }, 300000); 
    return () => clearInterval(timer);
  }, [projectId, projectName, widthFt, heightFt, wallFt, floorTexture, showSpotlights, library, items]);

  const handleDuplicate = async (proj, e) => {
    e.stopPropagation();
    const newId = Date.now().toString();
    const duplicatedProject = {
      ...proj,
      id: newId,
      projectName: `${proj.projectName} (Copy)`,
      timestamp: Date.now()
    };
    await saveProjectToDB(duplicatedProject);
    refreshGallery();
  };

  const loadProject = (proj) => {
    setProjectId(proj.id);
    setProjectName(proj.projectName);
    setWidthFt(proj.widthFt);
    setHeightFt(proj.heightFt);
    setWallFt(proj.wallFt);
    setFloorTexture(proj.floorTexture);
    setShowSpotlights(proj.showSpotlights);
    setLibrary(proj.library || []);
    setItems(proj.items || []);
    setHistory([]);
    setRedoStack([]);
  };

  const handleNew = () => {
    if (confirm("Create new project? Unsaved changes will be lost.")) {
      setProjectId(null);
      setProjectName("New Design");
      setItems([]);
      setLibrary([]);
      setHistory([]);
      setLastAutoSave(null);
    }
  };

  const handleDeleteProj = async (id, e) => {
    e.stopPropagation();
    if (confirm("Delete this project permanently?")) {
      await deleteProjectFromDB(id);
      if (projectId === id) handleNew();
      refreshGallery();
    }
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- CANVAS UNDO LOGIC ---
  const saveCanvasState = () => {
    if (!maskRef.current) return;
    const currentState = maskRef.current.toDataURL();
    // Only save if it's different from the last state
    if (canvasHistory.length > 0 && canvasHistory[canvasHistory.length - 1] === currentState) return;
    setCanvasHistory((prev) => [...prev, currentState]);
    setCanvasRedoStack([]);
  };

  const undo = () => {
    if (croppedPreview) {
      // Logic for Mask Editor Undo
      if (canvasHistory.length <= 1) return; // Keep original image
      const poppedState = canvasHistory[canvasHistory.length - 1];
      setCanvasRedoStack((prev) => [poppedState, ...prev]);
      
      const prevState = canvasHistory[canvasHistory.length - 2];
      const img = new Image();
      img.src = prevState;
      img.onload = () => {
        const ctx = maskRef.current.getContext("2d");
        ctx.clearRect(0, 0, maskRef.current.width, maskRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      setCanvasHistory((prev) => prev.slice(0, -1));
    } else {
      // Logic for Main Stage Undo
      if (history.length === 0) return;
      setRedoStack((prev) => [items, ...prev]);
      setItems(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (croppedPreview) {
      // Logic for Mask Editor Redo
      if (canvasRedoStack.length === 0) return;
      const nextState = canvasRedoStack[0];
      setCanvasHistory((prev) => [...prev, nextState]);
      const img = new Image();
      img.src = nextState;
      img.onload = () => {
        const ctx = maskRef.current.getContext("2d");
        ctx.clearRect(0, 0, maskRef.current.width, maskRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      setCanvasRedoStack((prev) => prev.slice(1));
    } else {
      // Logic for Main Stage Redo
      if (redoStack.length === 0) return;
      setHistory((prev) => [...prev, items]);
      setItems(redoStack[0]);
      setRedoStack((prev) => prev.slice(1));
    }
  };

  const pushToHistory = (newItems) => {
    setHistory((prev) => [...prev, items]);
    setItems(newItems);
    setRedoStack([]);
  };

  const applyTemplate = (template) => {
    setWidthFt(template.width);
    setHeightFt(template.height);
    setWallFt(template.wall);
    setFloorTexture(FLOOR_TEXTURES.find(t => t.id === template.floor));
  };

  const resetView = () => {
    setRotX(0);
    setRotZ(0);
    setCameraZoom(1);
    setCameraPreset(CAMERA_PRESETS[1]);
  };

  const applyCamera = (preset) => {
    setCameraPreset(preset);
    setRotX(preset.rotX);
    setRotZ(preset.rotZ);
    setCameraZoom(preset.zoom);
  };

  const toggleGroupSelection = (id) => {
    setSelectedGroup(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { 
        setImageSrc(r.result); 
        setCroppedPreview(null); 
    };
    r.readAsDataURL(file);
  };

  const exportStageAsImage = async () => {
    if (!stageRef.current) return;
    try {
      const dataUrl = await domToPng(stageRef.current, { quality: 1 });
      const link = document.createElement("a");
      link.download = `${projectName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error("Export failed", err); }
  };

  const saveCrop = async () => {
    const img = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedPreview(img);
    setCanvasHistory([img]); // Start history with base crop
    setCanvasRedoStack([]);
  };

  const draw = (e) => {
    if (!drawing || !maskRef.current) return;
    const canvas = maskRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || e.touches?.[0].clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches?.[0].clientY) - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    
    ctx.globalCompositeOperation = isRestore ? "destination-out" : "source-over";
    if (!isRestore) ctx.fillStyle = brushColor;
    
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const finalizeCrop = () => {
    const finalImg = maskRef.current.toDataURL("image/png");
    setLibrary((p) => [...p, { id: Date.now(), src: finalImg }]);
    setCroppedPreview(null); 
    setImageSrc(null);
    setCanvasHistory([]);
    setCanvasRedoStack([]);
  };

  const addItem = (src) => {
    const newItem = { id: Date.now(), src, x: extraDim + 50, y: 50, w: 200, h: 150, z: items.length + 1, locked: false };
    pushToHistory([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const toggleLock = (id) => {
    pushToHistory(items.map(item => item.id === id ? { ...item, locked: !item.locked } : item));
  };

  const moveLayer = (id, action) => {
    const otherZs = items.filter(i => i.id !== id).map(i => i.z);
    const maxZ = otherZs.length ? Math.max(...otherZs) : 0;
    const minZ = otherZs.length ? Math.min(...otherZs) : 0;
    setItems(items.map(i => i.id === id ? { ...i, z: action === 'front' ? maxZ + 1 : minZ - 1 } : i));
  };

  const duplicateItem = (item) => {
    const newItem = { ...item, id: Date.now() + Math.random(), x: item.x + 20, y: item.y + 20, z: items.length + 1, locked: false };
    pushToHistory([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const handleClearLibrary = () => {
    if (library.length === 0) return;
    if (confirm("Clear all items from the library? This cannot be undone.")) {
      setLibrary([]);
    }
  };

  useEffect(() => {
    if (croppedPreview && maskRef.current) {
      const ctx = maskRef.current.getContext("2d");
      const img = new Image();
      img.src = croppedPreview;
      img.onload = () => {
        maskRef.current.width = img.width; 
        maskRef.current.height = img.height;
        ctx.clearRect(0, 0, maskRef.current.width, maskRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [croppedPreview]);

  // 3D Drag Rotation Controls
  const handleStageMouseDown = (e) => {
    if (e.target !== stageContainerRef.current) return;
    setIsDragging3D(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragRotation({ x: rotX, z: rotZ });
  };

  const handleStageMouseMove = (e) => {
    if (!isDragging3D) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const sensitivity = 0.5;
    
    setRotX(dragRotation.x - deltaY * sensitivity);
    setRotZ(dragRotation.z + deltaX * sensitivity);
  };

  const handleStageMouseUp = () => {
    setIsDragging3D(false);
  };

  useEffect(() => {
    if (isDragging3D) {
      window.addEventListener('mousemove', handleStageMouseMove);
      window.addEventListener('mouseup', handleStageMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleStageMouseMove);
        window.removeEventListener('mouseup', handleStageMouseUp);
      };
    }
  }, [isDragging3D, dragStart, dragRotation, rotX, rotZ]);

  const redXStyle = "absolute bg-[#ff0000] text-white w-7 h-7 rounded-full text-xs flex items-center justify-center shadow-lg border-2 border-white font-bold transition-all active:scale-90 z-[70] cursor-pointer";

  // Header Left Section
  const headerLeftContent = (
    <>
      <div className="flex flex-col min-w-0 pr-2 md:pr-3 border-r border-gray-200">
        <h1 className="text-sm md:text-lg font-black tracking-tighter uppercase italic leading-none" style={{color: 'var(--ee-primary, #1E40AF)'}}>STAGE 3D</h1>
        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
          className="text-[9px] md:text-[10px] font-bold text-gray-600 bg-gray-50 px-1.5 md:px-2 py-1 rounded border-none outline-none focus:ring-1 ring-blue-400 uppercase tracking-widest mt-1 truncate max-w-[80px] md:max-w-[120px]"
          placeholder="PROJ"
        />
      </div>
      <button 
        onClick={undo} 
        disabled={croppedPreview ? canvasHistory.length <= 1 : history.length === 0}
        className={`text-[10px] md:text-[11px] font-bold border px-2.5 md:px-3 py-1 rounded active:bg-gray-100 shadow-sm transition-opacity ${(croppedPreview ? canvasHistory.length <= 1 : history.length === 0) ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
      >
        ↶
      </button>
      <button 
        onClick={redo} 
        disabled={croppedPreview ? canvasRedoStack.length === 0 : redoStack.length === 0}
        className={`text-[10px] md:text-[11px] font-bold border px-2.5 md:px-3 py-1 rounded active:bg-gray-100 shadow-sm transition-opacity ${(croppedPreview ? canvasRedoStack.length === 0 : redoStack.length === 0) ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
      >
        ↷
      </button>
      <button 
        onClick={() => handleSave()} 
        className="text-[10px] md:text-[11px] font-bold bg-green-500 text-white px-2.5 md:px-3 py-1 rounded hover:bg-green-600 transition-colors shadow-md"
      >
        Save
      </button>
      <button onClick={handleNew} className="text-[10px] md:text-[11px] font-bold border border-blue-200 text-blue-600 px-2.5 md:px-3 py-1 rounded active:bg-blue-50" style={HEADER_PATTERN}>New</button>
    </>
  );
  // Header Right Section - Controls
  const headerRightContent = (
    <>
      <select
        value={cameraPreset.id}
        onChange={(e) => {
          const p = CAMERA_PRESETS.find(x => x.id === e.target.value);
          if (p) applyCamera(p);
        }}
        className="bg-red-50 border border-red-200 rounded px-2 md:px-2.5 py-1 text-[8px] md:text-[9px] font-bold text-red-600 outline-none shrink-0"
      >
        {CAMERA_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>

      <select
        value={lightingPreset.id}
        onChange={(e) => {
          const p = LIGHTING_PRESETS.find(x => x.id === e.target.value);
          if (p) setLightingPreset(p);
        }}
        className="bg-yellow-50 border border-yellow-300 rounded px-2 md:px-2.5 py-1 text-[8px] md:text-[9px] font-bold text-yellow-700 outline-none shrink-0"
      >
        {LIGHTING_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>
      {lightingPreset && lightingPreset.id !== 'none' && (
        <div className="hidden sm:flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm shrink-0">
          <button onClick={() => setLightingIntensity(clamp(lightingIntensity - 0.05, 0, 1))} className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px]">−</button>
          <input type="range" min="0" max="1" step="0.01" value={lightingIntensity} onChange={(e) => setLightingIntensity(Number(e.target.value))} className="w-12 h-0.5" />
          <button onClick={() => setLightingIntensity(clamp(lightingIntensity + 0.05, 0, 1))} className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px]">+</button>
          <span className="text-[7px] font-bold text-gray-700 px-0.5">{Math.round(lightingIntensity * 100)}%</span>
        </div>
      )}

      <label className="hidden sm:flex items-center gap-0.5 text-[8px] bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 shrink-0">
        <input type="checkbox" checked={gridSnap} onChange={(e) => setGridSnap(e.target.checked)} className="w-3 h-3" />
        <span className="font-bold">Grid</span>
        {gridSnap && (
          <input type="range" min="10" max="100" step="5" value={snapSize} onChange={(e) => setSnapSize(+e.target.value)} className="w-10 h-0.5" />
        )}
      </label>

      <div className="hidden lg:flex items-center gap-0.5 text-[7px] md:text-[8px] font-bold text-gray-600 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 shrink-0" style={HEADER_PATTERN}>
        <label className="flex items-center gap-0.5">W<input type="number" value={widthFt} onChange={e => setWidthFt(+e.target.value)} className="w-6 md:w-8 border rounded px-1 py-0.5 text-center text-[7px]" /></label>
        <label className="flex items-center gap-0.5">H<input type="number" value={heightFt} onChange={e => setHeightFt(+e.target.value)} className="w-6 md:w-8 border rounded px-1 py-0.5 text-center text-[7px]" /></label>
        <label className="flex items-center gap-0.5">Wall<input type="number" value={wallFt} onChange={e => setWallFt(+e.target.value)} className="w-6 md:w-7 border rounded px-1 py-0.5 text-center text-[7px]" /></label>
        <select value={floorTexture.id} onChange={(e) => setFloorTexture(FLOOR_TEXTURES.find(t => t.id === e.target.value))} className="bg-white border rounded px-1 py-0.5 text-[7px]">
          {FLOOR_TEXTURES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
      <button onClick={exportStageAsImage} className="px-3 md:px-4 py-1 md:py-1.5 bg-blue-600 text-white rounded-full text-[9px] md:text-[10px] font-bold shadow-md hover:bg-blue-700 transition-all whitespace-nowrap shrink-0">Download</button>
    </>
  );
  // Sidebar Content
  const sidebarContent = (
    <>
      {/* removed: templates, camera, lighting, grid, group sections - header controls used instead */}
          
          <section className="bg-blue-50/50 p-3 md:p-4 rounded-2xl border border-blue-100 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Project Gallery</h3>
                <span className="text-[8px] md:text-[9px] text-gray-400 font-bold">{savedProjects.length} Designs</span>
            </div>
            
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-[10px] md:text-[11px] p-2 border rounded-lg bg-white outline-none focus:ring-1 ring-blue-400"
            />

            <div className="flex flex-col gap-2 max-h-40 md:max-h-56 overflow-y-auto pr-1">
              {filteredProjects.map(proj => (
                <div 
                  key={proj.id} 
                  onClick={() => loadProject(proj)}
                  className={`group flex flex-col p-2 rounded-lg text-[9px] md:text-xs cursor-pointer border transition-all ${projectId === proj.id ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 'bg-white border-gray-100 hover:border-blue-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold truncate w-32">{proj.projectName}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleDuplicate(proj, e)} title="Duplicate" className="hover:text-yellow-400">📄</button>
                        <button onClick={(e) => handleDeleteProj(proj.id, e)} className="hover:text-red-400">✕</button>
                    </div>
                  </div>
                  <span className={`text-[8px] md:text-[9px] mt-1 ${projectId === proj.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {formatTime(proj.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[9px] md:text-xs font-bold text-blue-600 uppercase tracking-widest">New Asset</label>
            <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-6 md:p-8 bg-gray-50 flex flex-col items-center justify-center hover:bg-blue-50 transition-all cursor-pointer">
              <input type="file" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm mb-2 md:mb-3 text-blue-600 text-xl md:text-2xl group-hover:scale-110 transition-transform">+</div>
              <span className="text-xs md:text-sm font-bold text-gray-700">Upload Image</span>
            </div>

            {/* CROP WORKFLOW */}
            {imageSrc && !croppedPreview && (
              <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-900 relative shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-2 px-1">
                  <button onClick={saveCrop} className="text-[9px] font-black text-slate-900 uppercase hover:text-blue-600 transition-colors">CROP & EDIT</button>
                  <button onClick={() => setImageSrc(null)} className="text-[9px] font-bold text-red-500 uppercase">Cancel</button>
                </div>
                <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200 relative">
                  <Cropper 
                    image={imageSrc} 
                    crop={crop} 
                    zoom={zoom} 
                    aspect={undefined} 
                    onCropChange={setCrop} 
                    onZoomChange={setZoom} 
                    onCropComplete={(_, p) => setCroppedAreaPixels(p)} 
                  />
                </div>
              </div>
            )}
          </section>

          {/* MASK WORKFLOW */}
          {croppedPreview && (
            <section className="bg-white border p-3 md:p-4 rounded-2xl space-y-3 md:space-y-4 shadow-xl border-gray-200 relative">
              <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">
                <span className="text-blue-600">Mask Editor</span>
                <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 p-0" />
              </div>
              <div className="relative border-2 border-gray-100 rounded-xl overflow-hidden shadow-inner bg-slate-50">
                <canvas 
                    ref={maskRef} 
                    onMouseDown={() => { setDrawing(true); }} 
                    onMouseMove={draw} 
                    onMouseUp={() => { setDrawing(false); saveCanvasState(); }} 
                    onMouseLeave={() => { if(drawing) { setDrawing(false); saveCanvasState(); } }} 
                    className="h-40 md:h-48 w-full cursor-crosshair object-contain bg-transparent" 
                />
              </div>
              <div className="space-y-3">
                <input type="range" min="2" max="150" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg accent-blue-600" />
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setIsRestore(true)} className={`py-2 rounded-xl text-[9px] font-bold border flex items-center justify-center gap-1 transition-all ${isRestore ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-400'}`}>Eraser</button>
                  <button onClick={() => setIsRestore(false)} className={`py-2 rounded-xl text-[9px] font-bold border flex items-center justify-center gap-1 transition-all ${!isRestore ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-400'}`}>Brush</button>
                </div>
              </div>
              <button onClick={finalizeCrop} className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-md uppercase tracking-widest hover:bg-blue-700">Add To Library</button>
            </section>
          )}

          <div className="border-t pt-4 md:pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">LIBRARY</h3>
              <button 
                onClick={handleClearLibrary}
                className="text-[8px] md:text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tighter"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {library.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-gray-50 border rounded-xl p-2 hover:border-blue-400 transition-all shadow-sm">
                   <img src={item.src} className="w-full h-full object-contain cursor-pointer" onClick={() => addItem(item.src)} />
                   <button onClick={(e) => { e.stopPropagation(); setLibrary(l => l.filter(i => i.id !== item.id))}} className={`${redXStyle} -top-2 -right-2 opacity-0 group-hover:opacity-100`}>✕</button>
                </div>
              ))}
            </div>
          </div>
    </>  
  );

  // Main Canvas Content
  const canvasContent = (
    <div className="flex items-center justify-center w-full h-full" style={{minWidth: 0, minHeight: 0, padding: '0.25rem'}}>
            <div 
              ref={stageRef} 
              style={{ 
                width: stageWidth + (extraDim * 2), 
                height: stageHeight + extraDim, 
                perspective: '1500px',
                transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${cameraZoom})`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out',
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'hidden',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} 
              className="relative" 
              onClick={() => {
                setSelectedId(null);
                setSelectedGroup([]);
              }}
            >
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center" style={{overflow: 'hidden'}}>
              <div className="flex items-start">
                <div style={{ width: extraDim, height: stageHeight, transform: 'rotateY(60deg) translateX(20px)', transformOrigin: 'right', backgroundColor: '#9ca3af', backfaceVisibility: 'hidden' }} className="border-r border-gray-600 opacity-90 shadow-2xl" />
                <div style={{ 
                  width: stageWidth, 
                  height: stageHeight, 
                  backgroundColor: '#ffffff',
                  backgroundImage: (() => {
                    const c = lightingColorFor(lightingPreset, lightingIntensity);
                    return c ? `linear-gradient(rgba(0,0,0,0), ${c})` : 'none';
                  })()
                }} className="border border-gray-300 shadow-md z-[0] overflow-hidden relative" />
                <div style={{ width: extraDim, height: stageHeight, transform: 'rotateY(-60deg) translateX(-20px)', transformOrigin: 'left', backgroundColor: '#9ca3af', backfaceVisibility: 'hidden' }} className="border-l border-gray-600 opacity-90 shadow-2xl" />
              </div>
              
              <div style={{ 
                width: stageWidth, 
                height: extraDim, 
                transform: 'rotateX(75deg) translateY(-30px)', 
                transformOrigin: 'top', 
                backgroundColor: floorTexture.color,
                backgroundImage: floorTexture.pattern ? `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)` : 'none',
                backgroundSize: '25px 25px',
                opacity: 0.8
              }} className="border-t border-gray-500 shadow-inner relative" />
            </div>

            {/* GRID OVERLAY */}
            {gridSnap && (
              <div 
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, transparent calc(100% - 1px), #dbdbdb 100%),
                    linear-gradient(90deg, transparent calc(100% - 1px), #dbdbdb 100%)
                  `,
                  backgroundSize: `${snapSize}px ${snapSize}px`,
                  opacity: 0.3
                }}
              />
            )}

            <div className="absolute inset-0 z-10">
                  {items.sort((a, b) => a.z - b.z).map((i) => {
                const isGrouped = selectedGroup.includes(i.id);
                return (
                  <Rnd
                    key={i.id} 
                    bounds="parent" 
                    size={{ width: i.w, height: i.h }} 
                    position={{ 
                      x: gridSnap ? Math.round(i.x / snapSize) * snapSize : i.x, 
                      y: gridSnap ? Math.round(i.y / snapSize) * snapSize : i.y 
                    }} 
                    style={{ zIndex: i.z }}
                    disableDragging={i.locked} 
                    enableResizing={!i.locked}
                    onDragStart={() => { 
                      setSelectedId(i.id); 
                      setIsDragging(true); 
                    }}
                    onDragStop={(e, d) => { 
                      const newX = gridSnap ? Math.round(d.x / snapSize) * snapSize : d.x;
                      const newY = gridSnap ? Math.round(d.y / snapSize) * snapSize : d.y;
                      pushToHistory(items.map(item => item.id === i.id ? { ...item, x: newX, y: newY } : item)); 
                      setIsDragging(false); 
                    }}
                    onResizeStart={() => { setResizingInfo({ id: i.id, w: i.w, h: i.h }); }}
                    onResize={(e, direction, ref, delta, pos) => { setResizingInfo({ id: i.id, w: ref.offsetWidth, h: ref.offsetHeight }); }}
                    onResizeStop={(e, d, ref, delta, pos) => { 
                      pushToHistory(items.map(item => item.id === i.id ? { ...item, w: ref.offsetWidth, h: ref.offsetHeight, ...pos } : item)); 
                      setIsDragging(false); 
                      setResizingInfo({ id: null, w: 0, h: 0 });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (e.ctrlKey || e.metaKey) {
                        toggleGroupSelection(i.id);
                      } else {
                        setSelectedId(i.id);
                      }
                    }}
                    >
                    <div className={`relative w-full h-full border-2 transition-all ${selectedId === i.id || isGrouped ? 'border-blue-500 ring-4 ring-blue-500/10 z-[1000]' : 'border-transparent'} ${isGrouped ? 'ring-4 ring-purple-400/30 border-purple-500' : ''}`}>
                      <img src={i.src} className={`w-full h-full object-contain pointer-events-none ${i.locked ? 'opacity-70' : 'opacity-100'}`} />
                      {(selectedId === i.id || resizingInfo.id === i.id) && (() => {
                        const wPx = resizingInfo.id === i.id ? resizingInfo.w : i.w;
                        const hPx = resizingInfo.id === i.id ? resizingInfo.h : i.h;
                        const wFt = Math.round((wPx / PX_PER_FOOT) * 10) / 10;
                        const hFt = Math.round((hPx / PX_PER_FOOT) * 10) / 10;
                        return (
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-lg font-bold">
                            {wFt} x {hFt} ft
                          </div>
                        );
                      })()}
                      {selectedId === i.id && (
                        <div className="absolute -top-10 left-0 flex gap-1 bg-black text-white p-1 rounded-lg text-[8px] md:text-[9px] z-[9999] font-bold uppercase shadow-xl items-center" style={{whiteSpace: 'nowrap'}}>
                          <button className="px-2 py-1" onClick={(e) => { e.stopPropagation(); toggleLock(i.id); }}>{i.locked ? 'Unlock' : 'Lock'}</button>
                          <button className="px-2 py-1" onClick={(e) => { e.stopPropagation(); moveLayer(i.id, 'front'); }}>Top</button>
                          <button className="px-2 py-1" onClick={(e) => { e.stopPropagation(); moveLayer(i.id, 'back'); }}>Bottom</button>
                          <button className="px-2 py-1 text-blue-300" onClick={(e) => { e.stopPropagation(); duplicateItem(i); }}>Clone</button>
                          <button onClick={(e) => { e.stopPropagation(); pushToHistory(items.filter(item => item.id !== i.id)); }} className="px-2 py-1 text-red-500">✕</button>
                        </div>
                      )}
                    </div>
                  </Rnd>
                );
              })}
            </div>
          </div>
    </div>
  );

  return (
    <AppLayout 
      title="Stage Designer"
      headerLeft={headerLeftContent}
      headerRight={headerRightContent}
      sidebar={sidebarContent}
    >
      {canvasContent}
    </AppLayout>
  );
}