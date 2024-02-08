import React from "react";
import UIChartCard from "./UIChartCard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Stack } from "@mui/material";

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
          <Stack 
            spacing={2} 
            direction="column" 
            alignItems="center" 
            justifyContent="center" 
            sx={{ height: "100%" }}
          >
            <h5>No data to display</h5>
          </Stack>
        ) : (
          <Doughnut data-testId={props.dataTestId} options={options} data={data} />
        )}
      </div>
    </UIChartCard>
  );
};

export default UIPieChartCard;
