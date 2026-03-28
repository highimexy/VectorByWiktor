import { useRef, useState } from "react";
import * as THREE from "three";
import UploadedScene from "./scenes/UploadedScene";
import SceneControls, { type MaterialType } from "./scenes/SceneControls";
import ControlsHint from "./ControlsHint";
import { useGifExport, type GifQuality, type GifResolution, type GifFps, type GifDuration } from "../utils/useGifExport";

interface UploadedModelViewerProps {
  scene: THREE.Group;
  fileName: string;
  onBack: () => void;
  onNewFiles: (files: File[]) => void;
}

export default function UploadedModelViewer({ scene, fileName, onBack, onNewFiles }: UploadedModelViewerProps) {
  const [bgColor, setBgColor] = useState("#0d0d1a");
  const [material, setMaterial] = useState<MaterialType>("original");
  const [autoRotate, setAutoRotate] = useState(true);
  const [gifTransparent, setGifTransparent] = useState(false);
  const [gifQuality, setGifQuality] = useState<GifQuality>("medium");
  const [gifResolution, setGifResolution] = useState<GifResolution>(480);
  const [gifFps, setGifFps] = useState<GifFps>(25);
  const [gifDuration, setGifDuration] = useState<GifDuration>(5);
  const [rotateSpeed, setRotateSpeed] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseName = fileName.replace(/\.(gltf|glb)$/i, "");

  const { exportGif, isRecording, phase: recordPhase, progress: recordProgress } =
    useGifExport(containerRef, `${baseName}.gif`, bgColor, gifTransparent, gifQuality, gifResolution, gifFps, gifDuration);

  const handleScreenshot = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${baseName}.png`;
    link.click();
  };

  const handleNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onNewFiles(files);
    e.target.value = "";
  };

  return (
    <div ref={containerRef} className="fixed inset-0">
      <UploadedScene
        scene={scene}
        bgColor={bgColor}
        materialType={material}
        autoRotate={autoRotate}
        rotateSpeed={rotateSpeed}
      />

      {/* Top-left: back + filename */}
      <div className="fixed left-4 top-4 z-50 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 text-sm text-white/80 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Karuzela
        </button>
        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50 backdrop-blur-md">
          {fileName}
        </span>
      </div>

      {/* Top-right: upload new + scene controls */}
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 text-sm text-white/80 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Nowy model
          <input type="file" accept=".gltf,.glb,.bin,.png,.jpg,.jpeg,.webp" multiple onChange={handleNewFile} hidden />
        </label>

        <SceneControls
          bgColor={bgColor}
          onBgColorChange={setBgColor}
          material={material}
          onMaterialChange={setMaterial}
          autoRotate={autoRotate}
          onAutoRotateChange={setAutoRotate}
          onScreenshot={handleScreenshot}
          onExportGif={exportGif}
          isRecording={isRecording}
          recordPhase={recordPhase}
          recordProgress={recordProgress}
          gifTransparent={gifTransparent}
          onGifTransparentChange={setGifTransparent}
          gifQuality={gifQuality}
          onGifQualityChange={setGifQuality}
          gifResolution={gifResolution}
          onGifResolutionChange={setGifResolution}
          gifFps={gifFps}
          onGifFpsChange={setGifFps}
          gifDuration={gifDuration}
          onGifDurationChange={setGifDuration}
          rotateSpeed={rotateSpeed}
          onRotateSpeedChange={setRotateSpeed}
        />
      </div>

      <ControlsHint />
    </div>
  );
}
