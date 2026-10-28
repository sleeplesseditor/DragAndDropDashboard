import Card from "@components/Card";
import { createRoot } from "react-dom/client";
import './index.css';

function App() {
  return (
    <main
      style={{
        height: "100vh",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        background: "#0b0f17",
      }}
    >
      <Card title="Card A" leftPct={4} topPct={10} />
      <Card title="Card B" leftPct={20} topPct={30} />
      <Card title="Card C" leftPct={36} topPct={50} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);