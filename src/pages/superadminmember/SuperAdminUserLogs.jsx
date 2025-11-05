import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Card } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

export default function SuperAdminUserLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch or mock API data
    const mockLogs = [
      {
        id: 1,
        userName: "John Doe",
        action: "Created a new Event ‘Wedding Ceremony’",
        module: "Event",
        timestamp: "05 Nov 2025, 12:31 PM",
      },
      {
        id: 2,
        userName: "Sarah Kapoor",
        action: "Updated quotation for client ‘Mr. Sharma’",
        module: "Quotation",
        timestamp: "05 Nov 2025, 12:10 PM",
      },
      {
        id: 3,
        userName: "Ravi Kumar",
        action: "Logged into the system",
        module: "Authentication",
        timestamp: "05 Nov 2025, 11:45 AM",
      },
      {
        id: 4,
        userName: "Anjali Singh",
        action: "Deleted supplier ‘Floral Heaven’",
        module: "Supplier",
        timestamp: "04 Nov 2025, 06:22 PM",
      },
    ];
    setLogs(mockLogs);
  }, []);

  return (
    <Container>
      <Breadcrumbs items={[{ title: "Super Admin" }, { title: "User Logs" }]} />

      <div className="min-h-screen  rounded-lg mt-3">
        <div className="space-y-4">
          {logs.map((log) => (
            <Card
              key={log.id}
              className="rounded-2xl shadow-sm border border-primary bg-white hover:shadow-md transition-all duration-200"
              bodyStyle={{ padding: "16px 20px" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                    <UserOutlined className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{log.userName}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ClockCircleOutlined className="text-[10px]" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-medium text-white bg-primary px-3 py-1 rounded-full border border-[#EAD9BF]">
                  {log.module}
                </span>
              </div>

              <div className="border-t border-gray-100 my-3" />

              <p className="text-sm text-gray-700 leading-relaxed">
                {log.action}
              </p>
            </Card>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm">
              No logs available.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
