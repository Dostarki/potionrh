import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";

function GameFrame() {
  const ref = new URLSearchParams(window.location.search).get("ref");
  const api = process.env.REACT_APP_BACKEND_URL || "";
  const src = `/game.html?api=${encodeURIComponent(api)}${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`;
  return (
    <iframe
      data-testid="game-frame"
      title="PotionRH"
      src={src}
      allow="clipboard-write; web-share"
      style={{ display: "block", width: "100%", height: "100%", border: 0, background: "#3fcde6" }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameFrame />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
