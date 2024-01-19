import React from "react";
import logo from "./logo.svg";
import "./App.css";
import TimeFetcher from "./components/TimeFetcher";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import AppLayout from "./components/AppLayout";
function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          // colorPrimary: "orange",
          borderRadius: 20,
        },
      }}
    >
      <AppLayout />
      {/* <TimeFetcher /> */}
    </ConfigProvider>
  );
}

export default App;
