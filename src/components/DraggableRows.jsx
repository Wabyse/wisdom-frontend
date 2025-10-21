// components/DraggableRows.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function DraggableRows({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  // We only pass attributes/listeners to the child "handle"
  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === "function"
        ? children({ listeners, attributes })
        : children}
    </div>
  );
}