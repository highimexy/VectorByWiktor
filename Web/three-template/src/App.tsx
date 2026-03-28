import { useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import Carousel from "./components/Carousel";
import UploadedModelViewer from "./components/UploadedModelViewer";
import { PanelProvider } from "./context/PanelContext";

async function loadGltfFiles(files: File[]): Promise<THREE.Group> {
  const modelFile = files.find((f) => /\.(gltf|glb)$/i.test(f.name));
  if (!modelFile) throw new Error("Nie znaleziono pliku .gltf / .glb");

  const createdUrls: string[] = [];

  try {
    if (modelFile.name.toLowerCase().endsWith(".glb")) {
      const url = URL.createObjectURL(modelFile);
      createdUrls.push(url);
      const gltf = await new GLTFLoader().loadAsync(url);
      return gltf.scene;
    }

    // .gltf: patch all external URIs to blob URLs before loading
    const fileMap = new Map(files.map((f) => [f.name, f]));
    const gltfJson = JSON.parse(await modelFile.text());

    const replaceUris = (obj: unknown): unknown => {
      if (Array.isArray(obj)) return obj.map(replaceUris);
      if (obj && typeof obj === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
          if (key === "uri" && typeof val === "string" && !val.startsWith("data:") && !val.startsWith("blob:")) {
            const fileName = val.split("/").pop() ?? val;
            const depFile = fileMap.get(fileName) ?? fileMap.get(val);
            if (depFile) {
              const blobUrl = URL.createObjectURL(depFile);
              createdUrls.push(blobUrl);
              result[key] = blobUrl;
            } else {
              result[key] = val;
            }
          } else {
            result[key] = replaceUris(val);
          }
        }
        return result;
      }
      return obj;
    };

    const patched = replaceUris(gltfJson);
    const mainUrl = URL.createObjectURL(
      new Blob([JSON.stringify(patched)], { type: "model/gltf+json" })
    );
    createdUrls.push(mainUrl);

    const gltf = await new GLTFLoader().loadAsync(mainUrl);
    return gltf.scene;
  } finally {
    // Safe to revoke — Three.js already uploaded everything to GPU
    createdUrls.forEach((u) => URL.revokeObjectURL(u));
  }
}

type LoadState = "idle" | "loading" | "error";

export default function App() {
  const [uploadedModel, setUploadedModel] = useState<{ scene: THREE.Group; fileName: string } | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const sceneKey = useRef(0);

  const loadFiles = async (files: File[]) => {
    setLoadState("loading");
    try {
      const scene = await loadGltfFiles(files);
      sceneKey.current += 1;
      setUploadedModel({ scene, fileName: files.find((f) => /\.(gltf|glb)$/i.test(f.name))!.name });
      setLoadState("idle");
    } catch (err) {
      console.error(err);
      setLoadState("error");
      setTimeout(() => setLoadState("idle"), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) loadFiles(files);
    e.target.value = "";
  };

  const handleBack = () => setUploadedModel(null);

  return (
    <PanelProvider key={sceneKey.current}>
      {uploadedModel ? (
        <UploadedModelViewer
          scene={uploadedModel.scene}
          fileName={uploadedModel.fileName}
          onBack={handleBack}
          onNewFiles={loadFiles}
        />
      ) : (
        <>
          <Carousel />

          <label className="fixed bottom-4 right-4 z-50 flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 text-sm text-white/80 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Wgraj model
            <input type="file" accept=".gltf,.glb,.bin,.png,.jpg,.jpeg,.webp" multiple onChange={handleFileChange} hidden />
          </label>
        </>
      )}

      {loadState === "loading" && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="text-sm text-white/70">Ładowanie modelu…</span>
          </div>
        </div>
      )}
      {loadState === "error" && (
        <div className="fixed bottom-4 left-1/2 z-200 -translate-x-1/2 rounded-xl border border-red-500/30 bg-red-900/40 px-4 py-2.5 text-sm text-red-300 backdrop-blur-md">
          Nie udało się załadować modelu
        </div>
      )}
    </PanelProvider>
  );
}
