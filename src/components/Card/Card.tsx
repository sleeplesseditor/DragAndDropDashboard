
import * as React from 'react';
import './Card.scss';
import useDragAndDrop from "@helpers/useDragAndDrop";

let zCounter = 1;

function Card({
  title,
  x,
  y,
  onRemove,
}: {
  title: string;
  x: number;
  y: number;
  onRemove?: () => void;
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
       left: x,
        top: y,
        width: 200,
        height: 130,
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
        {onRemove && (
          <button
            className="draggable-card__reset-button"
            onClick={() => onRemove()}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;