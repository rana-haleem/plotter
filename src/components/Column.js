import React from "react";
import { useDrag } from "react-dnd";

function Column({ id, item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "column",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  return (
    <div className="item" ref={drag} style={{ border: isDragging ? "5px solid pink" : "0px" }}>
        {item}
    </div>
  );
}

export default Column;
