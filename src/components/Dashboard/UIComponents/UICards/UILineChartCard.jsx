import React from "react";
import UIChartCard from "./UIChartCard";
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
import { uiGreen, uiGrey2, uiRed } from "../../../../constants";
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

  //UPDATED DATA Variable
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "Revenue",
        data: props.data.map((monthData) => monthData.totalRevenue),
        borderColor: uiGreen,
        backgroundColor: uiGreen,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: props.data.map((monthData) => monthData.totalExpense),
        borderColor: uiRed,
        backgroundColor: uiRed,
        tension: 0.4,
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
    <UIChartCard
      title={props.title}
      info={props.info}
      cardStyle={props.cardStyle}
      infoStyle={props.infoStyle}
      titleStyle={props.titleStyle}
      dropDownOptions={props.dropDownOptions}
      onDropdownChange={props.onDropdownChange}
      chartHeaderMode={true}
    >
      <div data-testId={props.dataTestId} style={{ width: "100%", height: props.height, padding: "10px 0" }}>
        <Line data-testId="ui-line-chart" options={options} data={data} />
      </div>
    </UIChartCard>
  );
};

export default UILineChartCard;
