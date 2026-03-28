import ShipScene from "../scenes/ShipScene";
import type { MaterialType } from "../scenes/SceneControls";

interface ShipSlideProps {
  bgColor: string;
  materialType: MaterialType;
  autoRotate: boolean;
  rotateSpeed: number;
}

export default function ShipSlide({ bgColor, materialType, autoRotate, rotateSpeed }: ShipSlideProps) {
  return (
    <div className="h-full w-full">
      <ShipScene bgColor={bgColor} materialType={materialType} autoRotate={autoRotate} rotateSpeed={rotateSpeed} />
    </div>
  );
}
