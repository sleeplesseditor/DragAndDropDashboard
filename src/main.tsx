import * as React from 'react';
import Card from "@components/Card/Card";
import { createRoot } from "react-dom/client";
import SelectionBar, { type CardType } from '@components/SelectionBar/SelectionBar';
import './index.scss';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 130;

type PlacedCard = {
  id: string;
  type: CardType;
  x: number;
  y: number;
};

function App() {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [cards, setCards] = React.useState<PlacedCard[]>([]);

  const usedTypes = new Set(cards.map((card) => card.type));

  function handlePaletteDrop(type: CardType, clientX: number, clientY: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const bounds = canvas.getBoundingClientRect();

      // Ignore drops outside the canvas.
      if (
        clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom
      ) {
        return;
      }

      const x = Math.min(
        Math.max(0, clientX - bounds.left - CARD_WIDTH / 2),
        Math.max(0, bounds.width - CARD_WIDTH)
      );
      const y = Math.min(
        Math.max(0, clientY - bounds.top - CARD_HEIGHT / 2),
        Math.max(0, bounds.height - CARD_HEIGHT)
      );

      const id = crypto.randomUUID();

      // This state-level check prevents duplicates even if a stale sidebar item is dragged.
      setCards((current) =>
        current.some((card) => card.type === type)
          ? current
          : [...current, { id, type, x, y }]
      );
  }

  function removeCard(id: string) {
    setCards((current) => current.filter((card) => card.id !== id));
  }

  return (
    <div className="app">
      <SelectionBar
        usedTypes={usedTypes}
        canvasRef={canvasRef}
        onDrop={handlePaletteDrop}
      />
      <main
        className="main-canvas"
        ref={canvasRef}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            title={`Card ${card.type}`}
            x={card.x}
            y={card.y}
            onRemove={() => removeCard(card.id)}
          />
        ))}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);