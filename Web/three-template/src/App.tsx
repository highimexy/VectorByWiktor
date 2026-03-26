import Carousel from "./components/Carousel";
import { PanelProvider } from "./context/PanelContext";

export default function App() {
  return (
    <PanelProvider>
      <Carousel />
    </PanelProvider>
  );
}
