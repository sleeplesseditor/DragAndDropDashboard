import * as React from 'react';
import Header from '@components/Header/Header';
import Card, { getCardDimensions } from "@components/Card/Card";
import SelectionBar, { type CardType } from '@components/SelectionBar/SelectionBar';
import { useSelector } from 'react-redux';
import type { RootState } from "@modules/redux/store";
import { isMarketOpen } from '@helpers/marketHelpers';
import './index.scss';

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

  const activeExchange = useSelector((state: RootState) => state.selection.exchange);
  const [now, setNow] = React.useState(() => new Date());

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

      const { width, height } = getCardDimensions(type);
      const x = Math.min(
        Math.max(0, clientX - bounds.left - width / 2),
        Math.max(0, bounds.width - width)
      );
      const y = Math.min(
        Math.max(0, clientY - bounds.top - height / 2),
        Math.max(0, bounds.height - height)
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

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

const marketOpen = isMarketOpen(activeExchange, now);

  return (
    <div className="app__container">
        <Header />
        <div className="app__content">
            <SelectionBar
                canvasRef={canvasRef}
                onDrop={handlePaletteDrop}
                selectionBarRef={selectionBarRef}
                usedTypes={usedTypes}
            />
            {marketOpen === false && (
              <div className="market-closed-overlay" role="status">
                <strong>{activeExchange} market is closed</strong>
                <span>Live data updates are unavailable outside trading hours.</span>
              </div>
            )}
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