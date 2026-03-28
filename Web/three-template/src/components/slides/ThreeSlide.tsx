import ThreeScene from "../scenes/ThreeScene";
import type { MaterialType } from "../scenes/SceneControls";

interface ThreeSlideProps {
  bgColor: string;
  materialType: MaterialType;
  autoRotate: boolean;
  rotateSpeed: number;
}

export default function ThreeSlide({ bgColor, materialType, autoRotate, rotateSpeed }: ThreeSlideProps) {
  return (
    <div className="h-full w-full">
      <ThreeScene bgColor={bgColor} materialType={materialType} autoRotate={autoRotate} rotateSpeed={rotateSpeed} />
    </div>
  );
}
