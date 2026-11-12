import * as React from "react";
import useDragAndDrop from "@helpers/useDragAndDrop";
import './SelectionBar.scss'

export type CardType = "CandleStick" | "B" | "C";

type SelectionBarProps = {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (type: CardType, clientX: number, clientY: number) => void;
selectionBarRef: React.RefObject<HTMLElement | null>;
  usedTypes: ReadonlySet<CardType>;
};

function PaletteCard({
  disabled,
  onDrop,
type,
}: {
  disabled: boolean;
  onDrop: SelectionBarProps["onDrop"];
type: CardType;
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
        {type} {disabled ? "(added)" : isDragging ? "(dragging)" : "(drag)"}
      </div>
    </div>
  );
}


const cardTypes: CardType[] = ["CandleStick", "B", "C"];

const SelectionBar = ({ selectionBarRef, usedTypes, onDrop }: SelectionBarProps) => {
  return (
    <aside
        className="selection-bar__container"
        ref={selectionBarRef}
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