import * as React from "react";
import useDragAndDrop from "@helpers/useDragAndDrop";
import './SelectionBar.scss'

export type CardType = "A" | "B" | "C";

type SelectionBarProps = {
  usedTypes: ReadonlySet<CardType>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (type: CardType, clientX: number, clientY: number) => void;
};

function PaletteCard({
  type,
  disabled,
  onDrop,
}: {
  type: CardType;
  disabled: boolean;
  onDrop: SelectionBarProps["onDrop"];
}) {
  const { triggerRef, nodeRef, isDragging, reset } = useDragAndDrop({
    disabled,
    onDragEnd: (event) => {
      // The hook also calls onDragEnd for pointercancel; don't place on a cancelled drag.
      if (event.type !== "pointercancel") {
        onDrop(type, event.clientX, event.clientY);
      }
      reset();
    },
  });

  return (
    <div
        className={`selection-bar__palette-card${disabled ? "--disabled" : ""}`}
        ref={nodeRef}
    >
      <div ref={triggerRef}>
        Card {type} {disabled ? "(added)" : isDragging ? "(dragging)" : "(drag)"}
      </div>
    </div>
  );
}


const cardTypes: CardType[] = ["A", "B", "C"];

const SelectionBar = ({ usedTypes, onDrop }: SelectionBarProps) => {
  return (
    <aside
        className="selection-bar__container"
    >
        <h2>Cards</h2>
        {cardTypes.map((type) => (
            <PaletteCard
                key={type}
                type={type}
                disabled={usedTypes.has(type)}
                onDrop={onDrop}
            />
        ))}
    </aside>
  );
}

export default SelectionBar;