// import React from 'react';
// import { Layout, Menu } from 'antd';
// import {
//     PieChartOutlined,
//     DesktopOutlined,
//     FileOutlined,
// } from '@ant-design/icons';

// const { Header, Content, Footer, Sider } = Layout;

// const AppLayout = () => {
//     return (
//         <Layout style={{ minHeight: '100vh' }}>
//             <Sider collapsible>
//                 <div className="logo" />
//                 <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
//                     <Menu.Item key="1" icon={<PieChartOutlined />}>
//                         Dashboard
//                     </Menu.Item>
//                     <Menu.Item key="2" icon={<DesktopOutlined />}>
//                         Analiza
//                     </Menu.Item>
//                     <Menu.Item key="3" icon={<FileOutlined />}>
//                         Raporty
//                     </Menu.Item>
//                 </Menu>
//             </Sider>
//             <Layout className="site-layout">
//                 <Header style={{ padding: 0, }}>
//                     {/* Tutaj logo i tytuł */}
//                     <h1 style={{ marginLeft: '20px' }}>ZanieczySzczanie.pl</h1>
//                 </Header>
//                 <Content style={{ margin: '16px' }}>
//                     <div style={{ padding: 24, minHeight: 360 }}>
//                         {/* Tutaj będzie główna zawartość strony */}
//                         Twoje dane i analizy pojawią się tutaj.
//                     </div>
//                 </Content>
//                 <Footer style={{ textAlign: 'center' }}>
//                     @2024 Jan Mańczak | Marcin Grabowski
//                 </Footer>
//             </Layout>
//         </Layout>
//     );
// };

// export default AppLayout

import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import ComponentC from './ComponentC';
import { Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import {
    PieChartOutlined,
    DesktopOutlined,
    FileOutlined,
} from '@ant-design/icons';
import { Content, Footer, Header } from 'antd/es/layout/layout';

const AppLayout = () => {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<PieChartOutlined />}>
                            <Link to="/component-a">Lista stacji</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<DesktopOutlined />}>
                            <Link to="/component-b">Analiza</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<FileOutlined />}>
                            <Link to="/component-c">Raporty</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    {/* <Header style={{ padding: 0 }}>
                        <h1 style={{ marginLeft: '20px' }}>Zanieczyszczanie.pl</h1>
                    </Header> */}
                    <Content style={{ margin: '16px', color: 'white' }}>
                        <div style={{ padding: 24, minHeight: 360 }}>
                            <Routes>
                                <Route path="/component-a" element={<ComponentA />} />
                                <Route path="/component-b" element={<ComponentB />} />
                                <Route path="/component-c" element={<ComponentC />} />
                            </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        @2024 Jan Mańczak | Marcin Grabowski
                    </Footer>
                </Layout>
            </Layout>
        </Router>
    );
};

export default AppLayout;