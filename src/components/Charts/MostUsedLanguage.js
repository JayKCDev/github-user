import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const MostUsedLanguage = (props) => {
  // STEP 2 - Chart Data
  const { data } = props;
  // STEP 3 - Creating the JSON object to store the chart configurations
  const chartConfigs = {
    type: "pie3d", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        theme: "candy",
        animation: "1",
        alphaAnimation: "0",
        animateClockwise: "1",
        enableSmartLabels: "1",
        animationDuration: "3",
        pieRadius: "45%",
        //Set the chart caption
        caption: "Most used Programming Languages",
      },
      // Chart Data
      data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default MostUsedLanguage;
