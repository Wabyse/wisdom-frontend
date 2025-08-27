import { useState } from "react";

export function useHoverFollow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const onEnter = () => setShow(true);
  const onLeave = () => setShow(false);
  const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  return { show, pos, onEnter, onLeave, onMove };
}
