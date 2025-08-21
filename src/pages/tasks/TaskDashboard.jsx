import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Card, Select, Input, Button, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";

const { Option } = Select;

const TaskDashboard = () => {
  const [selectedView, setSelectedView] = useState("Table");
  const [tableData, setTableData] = useState(defaultData);

  const taskStats = [
    {
      label: "Overdue",
      value: 32,
      color: "red",
      icon: <CloseCircleOutlined />,
      border: "border-l-4 border-b-4 border-red-500 ",
    },
    {
      label: "Pending",
      value: 0,
      color: "red",
      icon: <ExclamationCircleOutlined />,
      border: "border-l-4 border-b-4 border-orange-300",
    },
    {
      label: "In Progress",
      value: 0,
      color: "orange",
      icon: <SyncOutlined spin />,
      border: "border-l-4 border-b-4 border-orange-300",
    },
    {
      label: "Completed",
      value: 0,
      color: "green",
      icon: <CheckCircleOutlined />,
      border: "border-l-4 border-b-4 border-green-400",
    },
    {
      label: "In Time",
      value: 0,
      color: "green",
      icon: <ClockCircleOutlined />,
      border: "border-l-4 border-b-4 border-green-300",
    },
    {
      label: "Delayed",
      value: 0,
      color: "red",
      icon: <ClockCircleOutlined />,
      border: "border-l-4 border-b-4 border-red-400",
    },
  ];

  const tasks = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "All Time",
    "Custom",
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Task Dashboard" }]} />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {tasks.map((label, i) => (
            <Button
              key={i}
              type={label === "This Week" ? "primary" : "default"}
              className={`rounded-full px-4 ${
                label === "This Week"
                  ? "bg-primary text-white border-none"
                  : "bg-gray-100 text-[#000000a6] font-medium"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {taskStats.map((stat, index) => (
            <Card
              key={index}
              className={`flex-1 min-w-[150px] shadow-sm rounded-lg border ${stat.border}`}
              bodyStyle={{ padding: "12px", textAlign: "center" }}
            >
              <div className="flex justify-center items-center gap-2 mb-2 text-lg">
                <span className={`text-${stat.color}-500`}>{stat.icon}</span>
                <span className="font-medium">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Select placeholder="Assigned To" className="w-40">
            <Option value="user1">User 1</Option>
            <Option value="user2">User 2</Option>
          </Select>

          <Select placeholder="Category" className="w-40">
            <Option value="cat1">Category 1</Option>
            <Option value="cat2">Category 2</Option>
          </Select>

          <Select placeholder="Frequency" className="w-40">
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
          </Select>

          <Input.Search placeholder="Search..." className="w-56" />

          <Button>Clear</Button>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          <Button
            type={selectedView === "Table" ? "primary" : "default"}
            className="rounded-full px-6"
            onClick={() => setSelectedView("Table")}
            classNames="btn btn-primary"
          >
            Table
          </Button>
          <Button
            type={selectedView === "Bar Chart" ? "primary" : "default"}
            className="rounded-full px-6"
            onClick={() => setSelectedView("Bar Chart")}
            classNames="btn bg-primary"
          >
            Bar Chart
          </Button>
        </div>

        <TableComponent
          columns={columns}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export { TaskDashboard };
