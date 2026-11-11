
import * as React from 'react';
import './Card.scss';
import useDragAndDrop from "@helpers/useDragAndDrop";

let zCounter = 1;

function Card({
  title,
  leftPct = 0,
  topPct = 0,
  w = 200,
  h = 130,
}: {
  title: string;
  leftPct?: number;
  topPct?: number;
  w?: number;
  h?: number;
}) {
  const [zIndex, setZIndex] = React.useState(1);

  const { triggerRef, nodeRef, isDragging, reset } = useDragAndDrop({
    onDragStart: () => {
      zCounter += 1;
      setZIndex(zCounter);
    },
  });

  return (
    <div
      className="draggable-card__container"
      ref={nodeRef}
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: w,
        height: h,
        zIndex,
      }}
    >
      <div
        className="draggable-card__header"
        ref={triggerRef}
      >
        <span>{title}</span>
        <span className="draggable-card__drag-indicator">
          {isDragging ? "dragging" : "drag"}
        </span>
      </div>

      <div style={{ padding: 12, fontSize: 14 }}>
        <button
          className="draggable-card__reset-button"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Card;