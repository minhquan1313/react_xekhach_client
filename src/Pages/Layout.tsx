import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserContext";
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
import { Avatar, Col, Layout, Menu, Row, Space, theme } from "antd";
import React, { useContext, useEffect, useState } from "react";
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
    key: "/booking",
    icon: UploadOutlined,
    label: "Đặt vé",
    pathname: "/booking",
  },
  {
    key: "/tickets",
    icon: BarChartOutlined,
    label: "Vé của tôi",
    pathname: "/tickets",
  },
  {
    key: "6",
    icon: CloudOutlined,
    label: "5",
  },
  {
    key: "7",
    icon: AppstoreOutlined,
    label: "6",
  },
  {
    key: "8",
    icon: TeamOutlined,
    label: "7",
  },
  {
    key: "9",
    icon: ShopOutlined,
    label: "8",
  },
];

function MyLayout() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [collapsed, setCollapsed] = useState((window as any).innerWidth < 900);
  const [collapseClicked, setCollapseClicked] = useState(false);

  const onCollapse: SiderProps["onCollapse"] = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);

    setCollapseClicked(true);
  };

  useEffect(() => {
    const f = () => {
      // console.log((window as any).innerWidth);

      if (!collapseClicked) {
        if ((window as any).innerWidth < 900) {
          setCollapsed(true);
        } else {
          setCollapsed(false);
        }
      }
    };

    window.addEventListener("resize", f);

    return () => {
      window.removeEventListener("resize", f);
    };
  }, [collapseClicked]);

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
        // theme="light"
        collapsed={collapsed}
        onCollapse={onCollapse}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/"]}
          selectedKeys={siderObj
            .map((x) => x.key)
            .filter((x) => {
              if (x == "/") return pathname == x;

              return pathname.startsWith(x);
            })}
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
  const { user, isLogging, logout } = useContext(UserContext);

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Row
        justify={"space-between"}
        style={{ padding: "0 12px" }}>
        <Col></Col>
        <Col>
          {user ? (
            <Space>
              <Avatar
                size="default"
                src={user.avatar}
                icon={<UserOutlined />}
              />

              <MyButton>
                {user.lastName} {user.firstName}
              </MyButton>
              <MyButton onClick={logout}>Đăng xuất</MyButton>
            </Space>
          ) : (
            <MyButton
              loading={isLogging}
              to="/login">
              {isLogging ? "Đang đăng nhập" : "Đăng nhập"}
            </MyButton>
          )}
        </Col>
      </Row>
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
