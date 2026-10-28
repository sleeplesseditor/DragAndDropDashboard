
import * as React from 'react';
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
      ref={nodeRef}
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: w,
        height: h,
        background: "white",
        color: "#111",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
        userSelect: "none",
        zIndex,
      }}
    >
      <div
        ref={triggerRef}
        style={{
          height: 36,
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f3f4f6",
          fontSize: 14,
          cursor: "grab",
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{isDragging ? "dragging" : "drag"}</span>
      </div>

      <div style={{ padding: 12, fontSize: 14 }}>
        <button
          onClick={reset}
          style={{
            padding: "6px 10px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            background: "white",
            color: "#111",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Card;