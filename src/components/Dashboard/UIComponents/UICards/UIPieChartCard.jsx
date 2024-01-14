import React from "react";
import UIChartCard from "./UIChartCard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const UIPieChartCard = (props) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
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
    <UIChartCard
      info={props.info}
      title={props.title}
      cardStyle={props.cardStyle}
      infoStyle={props.infoStyle}
      titleStyle={props.titleStyle}
      dropDownOptions={props.dropDownOptions}
      onDropdownChange={props.onDropdownChange}
      chartHeaderMode={true}
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
          <Doughnut data-testId={props.dataTestId} options={options} data={data} />
        )}
      </div>
    </UIChartCard>
  );
};

export default UIPieChartCard;
