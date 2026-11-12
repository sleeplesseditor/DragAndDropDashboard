import * as React from 'react';
import Card from "@components/Card/Card";
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
  const selectionBarRef = React.useRef<HTMLElement>(null);
  const [cards, setCards] = React.useState<PlacedCard[]>([]);
  const [isCardDragging, setIsCardDragging] = React.useState(false);

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

  function handleCardDragEnd(id: string, event: PointerEvent) {
    setIsCardDragging(false);
    if (event.type !== "pointerup") return;

    const selectionBar = selectionBarRef.current;
    if (!selectionBar) return;

    const bounds = selectionBar.getBoundingClientRect();
    if (
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom
    ) {
      removeCard(id);
    }
  }

  return (
    <div className="app__container">
        <div className="app__title">FINNHUB DASHBOARD</div>
        <div className="app__content">
            <SelectionBar
                canvasRef={canvasRef}
                onDrop={handlePaletteDrop}
                selectionBarRef={selectionBarRef}
                usedTypes={usedTypes}
            />
            <main
                className="main-canvas"
                ref={canvasRef}
                style={{
                    overflow: isCardDragging ? "visible" : "hidden",
                    zIndex: isCardDragging ? 2 : undefined,
                }}
            >
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        onDragStart={() => setIsCardDragging(true)}
                        onDragEnd={(event) => handleCardDragEnd(card.id, event)}
                        onRemove={() => removeCard(card.id)}
                        title={card.type}
                        x={card.x}
                        y={card.y}
                    />
                ))}
            </main>
        </div>
    </div>
  );
}

export default App;