import { useEffect, useState, useRef } from "react";
import { BookMarked } from "lucide-react";
import LibraryManager from "../components/LibraryManager";

type DockPosition =
  | "top-right-outside"
  | "inside-right"
  | "top-center"
  | "bottom-center"
  | "left-center"
  | "right-center";

interface FloatingUIProps {
  activeInput: HTMLElement | null;
  onInject: (text: string) => void;
  onToggle?: (open: boolean) => void;
}

export default function FloatingUI({ activeInput, onInject, onToggle }: FloatingUIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dockPosition, setDockPosition] = useState<DockPosition>("top-right-outside");
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragCoords, setDragCoords] = useState<{ left: number; top: number } | null>(null);
  const [snapTarget, setSnapTarget] = useState<string | null>(null);

  const dragStartPos = useRef<{ clientX: number; clientY: number; btnX: number; btnY: number } | null>(null);
  const btnSize = 36;

  // Load saved dock position on mount
  useEffect(() => {
    chrome.storage?.local?.get(["dockPosition"], (res) => {
      if (res?.dockPosition) {
        setDockPosition(res.dockPosition as DockPosition);
      }
    });
  }, []);

  // Update rect on activeInput change, and listen for scroll/resize
  useEffect(() => {
    if (!activeInput) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      setRect(activeInput.getBoundingClientRect());
    };

    updateRect();

    // Scroll & Resize listeners to keep positioning absolute relative to viewport
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    // Poller to detect layout adjustments or changes
    const interval = setInterval(updateRect, 800);

    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
      clearInterval(interval);
    };
  }, [activeInput]);

  const toggleOpen = (open: boolean) => {
    setIsOpen(open);
    if (onToggle) onToggle(open);
  };

  // Predefined snap targets relative to the input rect
  const getTargets = (inputRect: DOMRect) => {
    return [
      { id: "top-center", x: inputRect.left + inputRect.width / 2, y: inputRect.top - 26 },
      { id: "bottom-center", x: inputRect.left + inputRect.width / 2, y: inputRect.bottom + 26 },
      { id: "left-center", x: inputRect.left - 26, y: inputRect.top + inputRect.height / 2 },
      { id: "right-center", x: inputRect.right + 26, y: inputRect.top + inputRect.height / 2 },
      { id: "top-right-outside", x: inputRect.right - 6, y: inputRect.top - 26 },
      { id: "inside-right", x: inputRect.right - 26, y: inputRect.top + inputRect.height / 2 }
    ];
  };

  // Calculate static position of the button when NOT dragging
  const getButtonCoords = (inputRect: DOMRect, pos: DockPosition) => {
    switch (pos) {
      case "top-center":
        return {
          left: inputRect.left + inputRect.width / 2 - btnSize / 2,
          top: inputRect.top - btnSize - 8
        };
      case "bottom-center":
        return {
          left: inputRect.left + inputRect.width / 2 - btnSize / 2,
          top: inputRect.bottom + 8
        };
      case "left-center":
        return {
          left: inputRect.left - btnSize - 8,
          top: inputRect.top + inputRect.height / 2 - btnSize / 2
        };
      case "right-center":
        return {
          left: inputRect.right + 8,
          top: inputRect.top + inputRect.height / 2 - btnSize / 2
        };
      case "top-right-outside":
        return {
          left: inputRect.right - btnSize + 12,
          top: inputRect.top - btnSize - 8
        };
      case "inside-right":
      default:
        return {
          left: inputRect.right - btnSize - 8,
          top: inputRect.top + (inputRect.height - btnSize) / 2
        };
    }
  };

  // Start dragging handler
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Only left click
    if (!rect) return;

    e.preventDefault();
    const currentCoords = getButtonCoords(rect, dockPosition);

    dragStartPos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      btnX: currentCoords.left,
      btnY: currentCoords.top
    };

    setIsDragging(true);
    setDragCoords({ left: currentCoords.left, top: currentCoords.top });
    setSnapTarget(null);
  };

  // Global mousemove and mouseup listeners
  useEffect(() => {
    if (!isDragging || !dragStartPos.current || !rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartPos.current!.clientX;
      const dy = e.clientY - dragStartPos.current!.clientY;
      const newX = dragStartPos.current!.btnX + dx;
      const newY = dragStartPos.current!.btnY + dy;

      setDragCoords({ left: newX, top: newY });

      // Find the closest snap target
      const targetsList = getTargets(rect);
      let closestTarget = null;
      let minDistance = Infinity;

      // Button center
      const btnCenterX = newX + btnSize / 2;
      const btnCenterY = newY + btnSize / 2;

      for (const t of targetsList) {
        const dist = Math.hypot(btnCenterX - t.x, btnCenterY - t.y);
        if (dist < minDistance) {
          minDistance = dist;
          closestTarget = t;
        }
      }

      // Snapping threshold of 45px
      if (closestTarget && minDistance < 45) {
        setSnapTarget(closestTarget.id);
      } else {
        setSnapTarget(null);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      const dx = e.clientX - dragStartPos.current!.clientX;
      const dy = e.clientY - dragStartPos.current!.clientY;

      // If movement is less than 5px, it's a simple click!
      if (Math.hypot(dx, dy) < 5) {
        toggleOpen(true);
      } else if (snapTarget) {
        setDockPosition(snapTarget as DockPosition);
        chrome.storage?.local?.set({ dockPosition: snapTarget });
      }

      setDragCoords(null);
      setSnapTarget(null);
      dragStartPos.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, rect, snapTarget]);

  // If the library manager is open, render it in the bottom-right corner
  if (isOpen) {
    return (
      <div
        style={{ pointerEvents: "auto" }}
        className="absolute bottom-5 right-5 flex h-[580px] w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#09090b] text-zinc-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <LibraryManager
          isFloating={true}
          onClose={() => toggleOpen(false)}
          onInject={onInject}
        />
      </div>
    );
  }

  // Hide the floating button if there is no input focused or detected
  if (!rect) return null;

  // Determine actual coordinates to render the button
  const finalCoords = isDragging && dragCoords
    ? (snapTarget ? getButtonCoords(rect, snapTarget as DockPosition) : dragCoords)
    : getButtonCoords(rect, dockPosition);

  // Render the target docking circles if currently dragging
  const snapTargets = isDragging ? getTargets(rect) : [];

  return (
    <>
      {/* Dock Target Indicator Dots */}
      {snapTargets.map((target) => {
        const active = snapTarget === target.id;
        return (
          <div
            key={target.id}
            style={{
              left: `${target.x}px`,
              top: `${target.y}px`,
              transform: "translate(-50%, -50%)",
              width: active ? "18px" : "14px",
              height: active ? "18px" : "14px",
              backgroundColor: active ? "#8b5cf6" : "#ffffff",
              borderColor: active ? "#ffffff" : "#8b5cf6",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "9999px",
              boxShadow: active ? "0 0 10px rgba(139, 92, 246, 0.8)" : "0 0 4px rgba(139, 92, 246, 0.4)",
              position: "absolute",
              zIndex: active ? 2147483647 : 2147483646,
              pointerEvents: "auto",
              cursor: "pointer",
              transition: "all 0.15s ease-out"
            }}
            onClick={() => {
              setDockPosition(target.id as DockPosition);
              chrome.storage?.local?.set({ dockPosition: target.id });
            }}
          />
        );
      })}

      {/* Floating PromptBook Button */}
      <button
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: `${finalCoords.left}px`,
          top: `${finalCoords.top}px`,
          width: `${btnSize}px`,
          height: `${btnSize}px`,
          pointerEvents: "auto",
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "left 0.18s cubic-bezier(0.16, 1, 0.3, 1), top 0.18s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        className="group flex items-center justify-center rounded-full bg-violet-600 text-white shadow-xl hover:scale-105 active:scale-95"
        title="Drag to reposition, Click to open PromptBook Library"
      >
        <BookMarked size={18} className="transition-transform group-hover:rotate-6" />
        <div className="absolute -inset-0.5 rounded-full bg-violet-600 opacity-15 group-hover:animate-ping" />
      </button>
    </>
  );
}
