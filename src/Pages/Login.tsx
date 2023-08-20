import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserContext";
import { Checkbox, Col, Form, Input, Row, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TFieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, store, isLogging, login } = useContext(UserContext);
  const [loginFail, setLoginFail] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values: TFieldType) => {
    setLoginFail(false);
    const { username, password, remember } = values;

    if (username && password) {
      const u = {
        username,
        password,
      };
      setLoading(true);
      (async () => {
        const d = await login(u);

        setLoading(false);
        if (d) {
          // login success
          if (remember) {
            store(u);
          }
        } else {
          setLoginFail(true);
          //login fail
        }
      })();
    }

    console.log("Success:", values);
  };

  useEffect(() => {
    if (!user) return;

    console.log({ location });

    if (location.key != "default") {
      navigate(-1);
    } else navigate({ pathname: "/" });
  });

  return (
    <div style={{ position: "relative" }}>
      <Row
        justify={"center"}
        align={"middle"}
        style={{ height: "100vh" }}>
        <Col
          xs={{ span: 18 }}
          md={{ span: 12 }}
          lg={{ span: 10 }}
          xxl={{ span: 6 }}>
          <Typography.Title style={{ textAlign: "center" }}>
            Đăng nhập
          </Typography.Title>
          <Form
            name="basic"
            labelCol={{ xs: { span: 7 } }}
            wrapperCol={{ span: 20 }}
            onChange={() => {
              setLoginFail(false);
            }}
            disabled={loading || isLogging}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item<TFieldType>
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Tên đăng nhập không bỏ trống" },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<TFieldType>
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Mật khẩu không bỏ trống" }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item<TFieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Ghi nhớ</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
              <Space.Compact block>
                <MyButton
                  block
                  loading={loading || isLogging}
                  type="primary"
                  danger={loginFail}
                  htmlType="submit">
                  Đăng nhập
                </MyButton>
                <MyButton
                  block
                  type="default"
                  to="/register">
                  Đăng ký
                </MyButton>
              </Space.Compact>
              {loginFail && (
                <Typography.Paragraph
                  style={{ width: "100%", textAlign: "center", marginTop: 12 }}>
                  Đăng nhập thất bại
                </Typography.Paragraph>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
