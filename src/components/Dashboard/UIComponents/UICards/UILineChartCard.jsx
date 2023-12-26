import React from "react";
import UICard from "./UICard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { uiGreen, uiGrey2 } from "../../../../constants";
import UIProgressPrompt from "../UIProgressPrompt";

const UILineChartCard = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          display: true, // Show x-axis labels
        },
      },
      y: {
        display: false, // Hide y-axis
      },
    },
  };

  //Create labels for the past 12 months including the current month
  const currentMonth = new Date().getMonth();
  const labels = [];
  for (let i = 0; i < 7; i++) {
    labels.push(
      new Date(new Date().getFullYear(), currentMonth - i, 1).toLocaleString(
        "default",
        { month: "long" }
      )
    );
  }
  labels.reverse();

  const data = {
    labels: props.labels,
    datasets: [
      //   {
      //     label: "Expenses",
      //     data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      //     borderColor: "rgb(255, 99, 132)",
      //     backgroundColor: "rgba(255, 99, 132, 0.5)",
      //     // pointRadius: 1, // Set point radius to 0 to remove points
      //     tension: 0.4, // Adjust tension for curve, default is 0.4
      //   },
      {
        label: "Revenue",
        // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        data: props.data,
        borderColor: uiGreen,
        backgroundColor: uiGreen,
        // pointRadius: 1, // Set point radius to 0 to remove points
        tension: 0.4, // Adjust tension for curve, default is 0.4
      },
    ],
  };
  return props.isLoading ? (
    <UIProgressPrompt
      style={{ background: "white", color: uiGrey2 }}
      title="Hang Tight!"
      message="Fetching your data for ya. Give us a sec..."
    />
  ) : (
    <UICard
      title={props.title}
      info={props.info}
      cardStyle={props.cardStyle}
      infoStyle={props.infoStyle}
      titleStyle={props.titleStyle}
      dropDownOptions={props.dropDownOptions}
      onDropdownChange={props.onDropdownChange}
    >
      <div style={{ width: "100%", height: props.height, padding: "10px 0" }}>
        <Line options={options} data={data} />
      </div>
    </UICard>
  );
};

export default UILineChartCard;
