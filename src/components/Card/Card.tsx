
import * as React from 'react';
import './Card.scss';
import useDragAndDrop from "@helpers/useDragAndDrop";

let zCounter = 1;

function Card({
  title,
  x,
  y,
  onRemove,
  onDragStart,
  onDragEnd,
}: {
  title: string;
  x: number;
  y: number;
  onRemove?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (event: PointerEvent) => void;
}) {
  const [zIndex, setZIndex] = React.useState(1);

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
      </div>

      <div style={{ padding: 12, fontSize: 14 }}>
        {onRemove && (
          <button
            className="draggable-card__reset-button"
            onClick={() => onRemove()}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;