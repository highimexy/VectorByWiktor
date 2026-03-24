import type { ComponentType } from "react";
import ThreeSlide from "../components/slides/ThreeSlide";
import BlenderSlide from "../components/slides/BlenderSlide";
import GsapSlide from "../components/slides/GsapSlide";

export type Project = {
  id: string;
  title: string;
  tag: string;
  component: ComponentType;
};

export const ALL_PROJECTS: Project[] = [
  { id: "three",   title: "3D Logo",      tag: "Three.js", component: ThreeSlide   },
  { id: "blender", title: "3D Modeling",  tag: "Blender",  component: BlenderSlide },
  { id: "gsap",    title: "Animations",   tag: "GSAP",     component: GsapSlide    },
];
