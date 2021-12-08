import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./Bar.css";
import Column from "./Column";
import { useDrop } from "react-dnd";
import initialData from "./initialData";
import ErrorComponent from "./ErrorComponent";

const LineChart = () => {
  const [columnss, setColumnData] = useState([]);
  const [chartData, setChartData] = useState("");
  const [optionsData, setChartOptions] = useState("");
  const [dimensionBoard, setDimensionBoard] = useState([]);
  const [measureBoard, setMeasureBoard] = useState([]);
  const [hasError, setHasError] = useState(false);

  const getColumns = async () => {
    const columns = [];
    await axios
      .get("https://plotter-task.herokuapp.com/columns")
      .then((response) => {
        for (const dataObj of response.data) {
          columns.push(dataObj.name);
        }
        setColumnData(columns);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setChartData(initialData);
    getColumns();
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "column",
    drop: (item) => addColToDimension(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [{ isOver2 }, drop2] = useDrop(() => ({
    accept: "column",
    drop: (item) => addColToMeasure(item.id),
    collect: (monitor) => ({
      isOver2: !!monitor.isOver(),
    }),
  }));

  const addColToDimension = (name) => {
    setDimensionBoard([name]);
  };

  const addColToMeasure = (name) => {
    setMeasureBoard([name]);
  };

  useEffect(() => {
    if (dimensionBoard && measureBoard != "") {
      try {
        axios
          .post("https://plotter-task.herokuapp.com/data", {
            measures: measureBoard,
            dimension: dimensionBoard[0],
          })
          .then(
            (response) => {
              setChartOptions({
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: dimensionBoard[0],
                    },
                  },
                  y: {
                    display: true,
                    title: {
                      display: true,
                      text: measureBoard,
                    },
                  },
                },
              });
              setChartData({
                labels: response.data[0].values,
                datasets: [
                  {
                    label: measureBoard,
                    data: response.data[1].values,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              });
            },
            (error) => {
              console.log(error);
            }
          );
      } catch {
        setHasError(true);
      }
    }
  }, [dimensionBoard, measureBoard]);

  return (
    <div>
      {hasError && <ErrorComponent></ErrorComponent>}
      <h2>Plotter</h2>
      {!hasError && (
        <div className="container">
          <div className="columns">
            <span>Columns</span>
            {columnss &&
              columnss.map((item, i) => (
                <Column key={i} id={item} item={item}></Column>
              ))}
          </div>
          <div className="BarContainer" style={{ height: "400px" }}>
            <div className={isOver ? "board dropping" : "board"} ref={drop}>
              {dimensionBoard &&
                dimensionBoard?.map((column) => {
                  return <Column id={column} item={column}></Column>;
                })}
              <button
                disabled={dimensionBoard != "" ? false : true}
                onClick={() => setDimensionBoard("")}
              >
                Clear
              </button>
            </div>
            <div className={isOver2 ? "board dropping" : "board"} ref={drop2}>
              {measureBoard &&
                measureBoard?.map((column) => {
                  return <Column id={column} item={column}></Column>;
                })}
              <button
                disabled={measureBoard != "" ? false : true}
                onClick={() => setMeasureBoard("")}
              >
                Clear
              </button>
            </div>
            <Line
              data={chartData ? chartData : initialData}
              options={optionsData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
