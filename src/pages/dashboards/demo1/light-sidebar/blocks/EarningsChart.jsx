import { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchEarningsChart = () => {
  return axios.get(`${import.meta.env.VITE_APP_API_URL}/sales/index`);
};

const EarningsChart = () => {
  const [charData, setCharData] = useState([31, 40, 28, 51, 42, 109, 100, 85, 95, 70, 80, 90]);
  const categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  useEffect(() => {
    fetchEarningsChart()
      .then(value => setCharData(value.data))
      .catch(error => console.error('Error fetching chart data:', error));
  }, []);

  // Calculate max value dynamically
  const maxValue = Math.ceil(Math.max(...charData) / 20) * 20;

  const options = {
    series: [
      {
        name: "series1",
        data: charData ?? [],
      },
    ],
    chart: {
      height: 250,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: ["var(--tw-primary)"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "var(--tw-gray-500)",
          fontSize: "12px",
        },
      },
      crosshairs: {
        position: "front",
        stroke: {
          color: "var(--tw-primary)",
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: false,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: maxValue,
      tickAmount: 5,
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "var(--tw-gray-500)",
          fontSize: "12px",
        },
        formatter: (defaultValue) => {
          return `$${defaultValue}K`;
        },
      },
    },
    tooltip: {
      enabled: true,
      custom({ series, seriesIndex, dataPointIndex, w }) {
        const number = parseInt(series[seriesIndex][dataPointIndex]) * 1000;
        const month = w.globals.seriesX[seriesIndex][dataPointIndex];
        const monthName = categories[month];
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        const formattedNumber = formatter.format(number);
        return `
          <div class="flex flex-col gap-2 p-3.5">
            <div class="font-medium text-2sm text-gray-600">${monthName}, 2024 Sales</div>
            <div class="flex items-center gap-1.5">
              <div class="font-semibold text-md text-gray-900">${formattedNumber}</div>
              <span class="badge badge-outline badge-success badge-xs">+24%</span>
            </div>
          </div>
          `;
      },
    },
    markers: {
      size: 0,
      colors: "var(--tw-primary-light)",
      strokeColors: "var(--tw-primary)",
      strokeWidth: 4,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: 8,
        sizeOffset: 0,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.25,
        opacityTo: 0,
      },
    },
    grid: {
      borderColor: "var(--tw-gray-200)",
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Earnings</h3>

        <div className="flex items-center gap-5">
          
    <Select defaultValue="1">
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="1">All</SelectItem>
              <SelectItem value="lite">Lite</SelectItem>
              <SelectItem value="elite">Elite</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="1">
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="1">1 month</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="card-body flex flex-col justify-end items-stretch grow px-3 py-1">
        <ApexChart
          id="earnings_chart"
          options={options}
          series={options.series}
          type="area"
          height="250"
        />
      </div>
    </div>
  );
};

export { EarningsChart };