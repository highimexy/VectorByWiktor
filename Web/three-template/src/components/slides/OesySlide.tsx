import OesyScene from "../scenes/OesyScene";
import type { MaterialType } from "../scenes/SceneControls";

interface OesySlideProps {
  bgColor: string;
  materialType: MaterialType;
  autoRotate: boolean;
  rotateSpeed: number;
}

export default function OesySlide({ bgColor, materialType, autoRotate, rotateSpeed }: OesySlideProps) {
  return (
    <div className="h-full w-full">
      <OesyScene bgColor={bgColor} materialType={materialType} autoRotate={autoRotate} rotateSpeed={rotateSpeed} />
    </div>
  );
}
