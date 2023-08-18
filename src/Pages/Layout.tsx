import MyButton from "@/Components/MyButton";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps, SiderProps } from "antd";
import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const siderObj = [
  {
    key: "/",
    icon: UserOutlined,
    label: import.meta.env.VITE_APP_NAME,
    pathname: "/",
  },
  {
    key: "/trips",
    icon: VideoCameraOutlined,
    label: "Tìm chuyến",
    pathname: "/trips",
  },
  {
    key: 4,
    icon: UploadOutlined,
    label: "3",
  },
  {
    key: 5,
    icon: BarChartOutlined,
    label: "4",
  },
  {
    key: 6,
    icon: CloudOutlined,
    label: "5",
  },
  {
    key: 7,
    icon: AppstoreOutlined,
    label: "6",
  },
  {
    key: 8,
    icon: TeamOutlined,
    label: "7",
  },
  {
    key: 9,
    icon: ShopOutlined,
    label: "8",
  },
];

function MyLayout() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse: SiderProps["onCollapse"] = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const siderItems: MenuProps["items"] = siderObj.map(
    ({ icon, label, pathname, key }) => ({
      key,
      icon: React.createElement(icon),
      label,
      onClick: pathname
        ? () => {
            navigate({
              pathname,
            });
          }
        : undefined,
    })
  );
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/"]}
          selectedKeys={[pathname]}
          items={siderItems}
        />
      </Sider>
      <Layout>
        <MyHeader />
        <Content
          style={{
            margin: "24px 16px 0",
            // overflow: "initial",
            background: colorBgContainer,
          }}>
          <Outlet />
          {/* <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
            }}>
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? "more" : "..."}
                  <br />
                </React.Fragment>
              ))
            }
          </div> */}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {/* Ant Design ©2023 Created by Ant UED */}
          <MyFooter />
        </Footer>
      </Layout>
    </Layout>
  );
}

function MyHeader() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <MyButton
        to="/"
        display="inline">
        Bình Hưng
      </MyButton>
      <MyButton to="/login">Login</MyButton>
    </Header>
  );
}
function MyFooter() {
  return (
    <div>
      <div>
        <p>Footer</p>
      </div>
    </div>
  );
}
export default MyLayout;
