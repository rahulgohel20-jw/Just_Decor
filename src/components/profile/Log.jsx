import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { ClockCircleOutlined, LoginOutlined, LogoutOutlined, ReloadOutlined } from "@ant-design/icons";
import { GetUserlogs } from "@/services/apiServices";
import { Spin, Empty, message } from "antd";
import dayjs from "dayjs";

export default function Log() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const fetchUserLogs = async () => {
    try {
      setLoading(true);
      
      // Get user email from localStorage
      const userData = localStorage.getItem("userData");
      if (!userData) {
        message.error("User not found");
        return;
      }
      
      const user = JSON.parse(userData);
      const userEmail = user.email;

      const response = await GetUserlogs(userEmail);
      console.log("log",response.data.data)
      
      if (response?.data?.success) {
        const apiLogs = response.data.data;
        
        // Transform API logs to match component format
        const formattedLogs = apiLogs.map((log) => ({
          id: log.id,
          date: dayjs(log.createAt).format("DD/MM/YYYY"),
          time: dayjs(log.createAt).format("hh:mm A"),
          eventType: log.eventType,
          description: log.description,
          ipAddress: log.ipAddress,
          user: log.user,
          isActive: log.isActive,
          highlight: log.eventType === "logout" || log.eventType === "AUTO-LOGOUT",
          createAt: log.createAt, // Keep original timestamp for sorting
        }));

        // Sort logs in descending order (newest first)
        const sortedLogs = formattedLogs.sort((a, b) => 
          new Date(b.createAt) - new Date(a.createAt)
        );

        setLogs(sortedLogs);
      } else {
        message.error("Failed to fetch user logs");
      }
    } catch (error) {
      console.error("Error fetching user logs:", error);
      message.error("Failed to fetch user logs");
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "login":
        return <LoginOutlined className="text-green-600" />;
      case "logout":
        return <LogoutOutlined className="text-red-600" />;
      case "auto-logout":
        return <ClockCircleOutlined className="text-yellow-700" />;
      default:
        return <ReloadOutlined className="text-sm text-red-500 " />;
    }
  };

  const getEventColor = (eventType, highlight) => {
    if (highlight) return "border-red-500 text-red-500";
    if (eventType === "login") return "border-green-500 text-green-500";
    if (eventType === "logout" || eventType === "AUTO-LOGOUT") return "border-red-500 text-red-500";
    return "border-[#28375F] text-[#28375F]";
  };

  return (
    <Container>
      

      <div className="bg-white rounded-md border border-gray-200 shadow-sm">
        

        {/* Timeline section */}
        <div className="relative pl-9 py-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Empty description="No logs found" />
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={log.id} className="relative flex items-start mb-8">
                {/* Date and time */}
                <div className="w-40 text-sm font-semibold text-gray-700">
                  {log.date} <br /> {log.time}
                </div>

                {/* Circle icon */}
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-dotted bg-white ${getEventColor(
                    log.eventType,
                    log.highlight
                  )}`}
                >
                  {typeof getEventIcon(log.eventType) === "string" ? (
                    <span className="text-lg">{getEventIcon(log.eventType)}</span>
                  ) : (
                    getEventIcon(log.eventType)
                  )}
                  {index !== logs.length - 1 && (
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gray-300"></div>
                  )}
                </div>

                {/* Log details */}
                <div className="ml-6">
                  <div className="mb-1">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        log.eventType === "login"
                          ? "bg-green-100 text-green-700"
                          : log.eventType === "logout"
                          ? "bg-red-100 text-red-700"
                          : log.eventType === "auto-logout"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {log.eventType}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      log.highlight ? "text-red-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    {log.description }
                  </p>
                  {log.ipAddress && (
                    <p className="text-sm font-semibold text-green-700 mt-1">
                      IP Address: {log.ipAddress}
                    </p>
                  )}
                  {log.user && (
                    <p className="text-sm text-gray-800">
                      User: {log.user}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}