import type { ComponentType } from "react";
import ThreeSlide from "../components/slides/ThreeSlide";
import OesySlide from "../components/slides/OesySlide";
import ShipSlide from "../components/slides/ShipSlide";

export type Project = {
  id: string;
  title: string;
  tag: string;
  component: ComponentType<{ isActive?: boolean }>;
};

export const ALL_PROJECTS: Project[] = [
  { id: "three", title: "3D Logo", tag: "Three.js", component: ThreeSlide },
  { id: "oesy",  title: "OESY",    tag: "Blender",  component: OesySlide  },
  { id: "ship",  title: "Ship",    tag: "Blender",  component: ShipSlide  },
];
