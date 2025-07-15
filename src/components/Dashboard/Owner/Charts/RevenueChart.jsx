import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { useState } from "react";

const RevenueChart = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("pastMonth"); // Default to 'pastMonth'

  let filteredData = data; // Default to full data

  const handlePeriodChange = (event) => {

    setSelectedPeriod(event.target.value);
  };
  if (selectedPeriod === "pastMonth") {
    // Filter data for the past month
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().substring(0, 7); // Get YYYY-MM
    filteredData = data.filter((entry) => entry.x >= lastMonthStr);
  } else if (selectedPeriod === "pastYear") {
    // Filter data for the past year
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const lastYearStr = lastYear.toISOString().substring(0, 7); // Get YYYY-MM
    filteredData = data.filter((entry) => entry.x >= lastYearStr);
  } else if (selectedPeriod === "pastWeek") {
    // Filter data for the past week
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekStr = lastWeek.toISOString().substring(0, 10); // Get YYYY-MM-DD
    filteredData = data.filter((entry) => entry.x >= lastWeekStr);
  }

  return (
    <>
      <div>
        <label htmlFor="period">Select Period: </label>
        <select
          id="period"
          value={selectedPeriod}
          onChange={handlePeriodChange}
        >
          <option value="pastMonth">Past Month</option>
          <option value="pastYear">Past Year</option>
          <option value="pastWeek">Past Week</option>
        </select>
      </div>
      <div style={{ height: "400px" }}>
        <ResponsiveLine
          curve="cardinal"
          enableArea={true}
          data={filteredData}
          margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
          xScale={{ type: "time", format: "%Y-%m-%d" }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: "%b %d",
            tickValues: "every 1 week",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Amount",
            legendOffset: -60,
            legendPosition: "middle",
          }}
          colors={{ scheme: "category10" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableSlices="x"
          enableGridX={false}
          enableGridY={true}
        />
      </div>
    </>
  );
};

export default RevenueChart;
