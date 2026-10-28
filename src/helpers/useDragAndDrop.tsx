import * as React from 'react';

type Position = { x: number; y: number };

function useDragAndDrop({
  disabled = false,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  disabled?: boolean;
  onDragStart?: (event: PointerEvent) => void;
  onDrag?: (event: PointerEvent, position: Position) => void;
  onDragEnd?: (event: PointerEvent, position: Position) => void;
}) {
  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
  const [nodeElement, setNodeElement] = React.useState<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });

  const [dragState, setDragState] = React.useState({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    initialPosition: { x: 0, y: 0 },
  });

  const hasDragged = React.useRef(false);
  const initialTransform = React.useRef("");

  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      if (disabled || !nodeElement) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setDragState({
        isDragging: true,
        dragOffset: { x: event.clientX, y: event.clientY },
        initialPosition: position,
      });

      hasDragged.current = false;

      const target = event.target as HTMLElement;
      target.setPointerCapture(event.pointerId);
      onDragStart?.(event);
    },
    [disabled, nodeElement, position, onDragStart]
  );

  const handlePointerMove = React.useCallback(
    (event: PointerEvent) => {
      if (!dragState.isDragging || !nodeElement) {
        return;
      }

      const deltaX = event.clientX - dragState.dragOffset.x;
      const deltaY = event.clientY - dragState.dragOffset.y;

      const newPosition = {
        x: dragState.initialPosition.x + deltaX,
        y: dragState.initialPosition.y + deltaY,
      };

      hasDragged.current = true;

      setPosition(newPosition);
      onDrag?.(event, newPosition);
    },
    [dragState.isDragging, dragState.dragOffset, dragState.initialPosition, nodeElement, onDrag]
  );

  const handlePointerUp = React.useCallback(
    (event: PointerEvent) => {
      event.stopPropagation();

      if (!dragState.isDragging) {
        return;
      }

      setDragState((prev) => ({ ...prev, isDragging: false }));

      const target = event.target as HTMLElement;
      target.releasePointerCapture(event.pointerId);
      onDragEnd?.(event, position);
    },
    [dragState.isDragging, position, onDragEnd]
  );

  const reset = React.useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      initialPosition: { x: 0, y: 0 },
    });

    if (nodeElement) {
      nodeElement.style.transform = initialTransform.current || "";
    }
  }, [nodeElement]);

  React.useEffect(() => {
    if (!triggerElement) {
      return;
    }

    const handleClick = (event: Event) => {
      if (hasDragged.current) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    };

    triggerElement.addEventListener("pointerdown", handlePointerDown);
    triggerElement.addEventListener("click", handleClick, true);

    return () => {
      triggerElement.removeEventListener("pointerdown", handlePointerDown);
      triggerElement.removeEventListener("click", handleClick, true);
    };
  }, [triggerElement, handlePointerDown]);

  React.useEffect(() => {
    if (!dragState.isDragging) {
      return;
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragState.isDragging, handlePointerMove, handlePointerUp]);

  React.useEffect(() => {
    if (!nodeElement) {
      return;
    }

    if (!initialTransform.current) {
      const computedStyle = window.getComputedStyle(nodeElement);
      initialTransform.current = computedStyle.transform !== "none" ? computedStyle.transform : "";
    }

    const dragTransform = `translate(${position.x}px, ${position.y}px)`;

    nodeElement.style.transform = initialTransform.current
      ? `${initialTransform.current} ${dragTransform}`
      : dragTransform;
  }, [nodeElement, position]);

  React.useEffect(() => {
    if (!nodeElement) {
      return;
    }

    const originalWillChange = nodeElement.style.willChange;
    nodeElement.style.willChange = "transform";

    return () => {
      nodeElement.style.willChange = originalWillChange;
    };
  }, [nodeElement]);

  React.useEffect(() => {
    if (!triggerElement) {
      return;
    }

    const originalCursor = triggerElement.style.cursor;
    const originalTouchAction = triggerElement.style.touchAction;

    triggerElement.style.touchAction = "none";

    if (!disabled) {
      triggerElement.style.cursor = dragState.isDragging ? "grabbing" : "grab";
    }

    return () => {
      triggerElement.style.cursor = originalCursor;
      triggerElement.style.touchAction = originalTouchAction;
    };
  }, [triggerElement, disabled, dragState.isDragging]);

  return {
    triggerRef: setTriggerElement,
    nodeRef: setNodeElement,
    isDragging: dragState.isDragging,
    position,
    reset,
  };
}


export default useDragAndDrop;