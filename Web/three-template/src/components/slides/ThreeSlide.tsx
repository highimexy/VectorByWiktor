import { useRef, useState } from "react";
import ThreeScene from "../scenes/ThreeScene";
import SceneControls, { type MaterialType } from "../scenes/SceneControls";
import { useGifExport, type GifQuality, type GifResolution, type GifFps, type GifDuration } from "../../utils/useGifExport";

export default function ThreeSlide() {
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
  const { exportGif, isRecording, phase: recordPhase, progress: recordProgress } =
    useGifExport(containerRef, "three.gif", bgColor, gifTransparent, gifQuality, gifResolution, gifFps, gifDuration);

  const handleScreenshot = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "three-scene.png";
    a.click();
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <ThreeScene bgColor={bgColor} materialType={material} autoRotate={autoRotate} rotateSpeed={rotateSpeed} />
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
  );
}
