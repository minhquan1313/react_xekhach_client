import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserContext";
import { preloadImage } from "@/Utils/preloadImage";
import {
  BarChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps, SiderProps } from "antd";
import {
  Avatar,
  Col,
  Layout,
  Menu,
  Row,
  Space,
  Spin,
  Tooltip,
  message,
  theme,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API;

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
];

function MyLayout() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [collapsed, setCollapsed] = useState(window.innerWidth < 900);
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
        if (window.innerWidth < 900) {
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
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

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
          style={
            {
              // margin: "24px 16px 0",
              // overflow: "initial",
              // background: colorBgContainer,
            }
          }>
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
  const { user, isLogging, logout, setUserAvatar } = useContext(UserContext);
  const [isUploading, setIsUploading] = useState(false);
  const [isImagePreloaded, setIsImagePreloaded] = useState(true);

  const imageUploadSubmit = async (e: HTMLInputElement): Promise<void> => {
    const file = e.files?.[0];

    if (!user || !file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id.toString());

    setIsUploading(true);
    setIsImagePreloaded(false);
    const res = await fetch(`${API}/avatar/`, {
      method: "POST",
      body: formData,
    });

    console.log({ res });
    const data = (await res.json()) as { url?: string };

    const { url } = data;
    console.log({ url });

    if (url) {
      message.success(`Tải ảnh thành công`);

      preloadImage(url, () => {
        setIsImagePreloaded(true);
        setUserAvatar(url);
      });
    } else {
      message.error(`Tải ảnh thất bại, thử lại sau`);
    }

    setIsUploading(false);
  };

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Row
        justify={"space-between"}
        style={{ padding: "0 12px" }}>
        <Col></Col>
        <Col>
          {user ? (
            <Space>
              <Spin spinning={isUploading || isLogging || !isImagePreloaded}>
                <Tooltip title="Bấm để thay avatar">
                  <Avatar
                    size="large"
                    src={user.avatar}
                    icon={<UserOutlined />}
                    onClick={() => {
                      (() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";

                        input.onchange = () => imageUploadSubmit(input);

                        input.click();
                      })();
                    }}
                  />
                </Tooltip>
              </Spin>

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
        <p>Xe khách Bình Hưng - Made by MTB@2023</p>
      </div>
    </div>
  );
}
export default MyLayout;
