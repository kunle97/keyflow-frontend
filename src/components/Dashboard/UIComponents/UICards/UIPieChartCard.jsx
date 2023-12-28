import React from "react";
import UICard from "./UICard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const UIPieChartCard = (props) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  console.log("Piechart data",props.data);
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: props.datasetLabel,
        data: props.data,
        backgroundColor: props.colors,
        borderWidth: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Hide the legend
        position: props.legendPosition ? props.legendPosition : "bottom",
        labels: {
          font: {
            size: 20, // Change legend text size
          },
          // Insert mroe css here
        },
      },
      title: {
        display: false,
      },
    },
  };
  return (
    <UICard
      info={props.info}
      title={props.title}
      cardStyle={props.cardStyle}
      infoStyle={props.infoStyle}
      titleStyle={props.titleStyle}
      dropDownOptions={props.dropDownOptions}
      onDropdownChange={props.onDropdownChange}
    >
      <div
        style={{
          width: "100%",
          height: props.height,
          ...props.chartContainerStyles,
        }}
      >
        {props.data.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <h6>No data to display</h6>
          </div>
        ) : (
          <Doughnut options={options} data={data} />
        )}
      </div>
    </UICard>
  );
};

export default UIPieChartCard;
