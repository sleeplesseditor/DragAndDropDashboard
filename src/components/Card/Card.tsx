
import * as React from 'react';
import CardContent from './CardContent';
import './Card.scss';
import useDragAndDrop from "@helpers/useDragAndDrop";

const CARD_WIDTH = 400;
const CARD_HEIGHT = 320;
const GAUGE_CARD_WIDTH = 560;

export function getCardDimensions(title: string) {
  return {
    width: title === "Live Price Gauge" ? GAUGE_CARD_WIDTH : CARD_WIDTH,
    height: CARD_HEIGHT,
  };
}

let zCounter = 1;

function Card({
  onRemove,
  onDragStart,
  onDragEnd,
  title,
  x,
  y,
}: {
  onRemove?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (event: PointerEvent) => void;
  title: string;
  x: number;
  y: number;
}) {
  const [zIndex, setZIndex] = React.useState(1);
  const { width, height } = getCardDimensions(title);

  const { triggerRef, nodeRef } = useDragAndDrop({
    onDragStart: () => {
      zCounter += 1;
      setZIndex(zCounter);
      onDragStart?.();
    },
    onDragEnd: (event) => onDragEnd?.(event),
  });

  return (
    <div
      className="draggable-card__container"
      ref={nodeRef}
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex,
      }}
    >
      <div
        className="draggable-card__header"
        ref={triggerRef}
      >
        <span></span>
        <span className="draggable-card__title">{title}</span>
        <span 
          className="draggable-card__close-btn"
          onClick={onRemove}
          role="button"
          title="Remove Chart"
        >
            X
        </span>
      </div>
      <CardContent 
        chartType={title}
      />
    </div>
  );
}

export default Card;