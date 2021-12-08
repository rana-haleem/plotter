import React from "react";
import BarChart from "./components/BarChart";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <BarChart />
      </div>
    </DndProvider>
  );
};
export default App;
