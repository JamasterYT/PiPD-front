import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import TimeFetcher from "./components/TimeFetcher";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import AppLayout from "./components/AppLayout";
import { Station } from "./components/ComponentA";
import { baseURL } from "./utils/constants";
import { Input } from "antd";
const { Search } = Input;
function App() {
  const [stations, setStations] = useState<Station[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('/api/gios-data');
        const response = await fetch(`${baseURL}/gios-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, // Use the dark algorithm for a modern look
        token: {
          borderRadius: 999, // Fully rounded borders for a modern feel
          fontFamily: "Roboto, sans-serif", // Clean and widely supported font
          colorText: "#e6f7ff", // Light text color for contrast on dark backgrounds
          colorPrimary: "#1890ff", // A bright blue for primary buttons and accents
          colorBgContainer: "#001529", // Dark background for containers
          // You can customize additional tokens as needed
        },
      }}
    >
      <AppLayout stations={stations} />
      {/* <TimeFetcher /> */}
    </ConfigProvider>
  );
}

export default App;
