import MyButton from "@/Components/MyButton";
import { TUserRegister, UserContext } from "@/Contexts/UserContext";
import { Col, Form, Input, Row, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TFieldType = {
  username: string;
  password: string;
  lastName?: string;
  firstName: string;
};

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, store, isLogging, register } = useContext(UserContext);
  const [loginFail, setLoginFail] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values: TFieldType) => {
    setLoginFail(false);
    const u: TUserRegister = values;
    setLoading(true);
    (async () => {
      const d = await register(u);
      setLoading(false);

      if (d) {
        // login success
        // if (remember) {
        store(u);
        // }
      } else {
        setLoginFail(true);
        //login fail
      }
    })();

    console.log("Success:", values);
  };

  useEffect(() => {
    if (!user) return;

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
            Đăng ký
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
              label="Họ và tên đệm"
              name="lastName">
              <Input />
            </Form.Item>

            <Form.Item<TFieldType>
              label="Tên"
              name="firstName"
              rules={[{ required: true, message: "Tên  không bỏ trống" }]}>
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
              <Space.Compact block>
                <MyButton
                  block
                  loading={isLogging}
                  type="default"
                  to="/login">
                  Đăng nhập
                </MyButton>
                <MyButton
                  block
                  type="primary"
                  loading={loading}
                  danger={loginFail}
                  htmlType="submit">
                  Đăng ký
                </MyButton>
              </Space.Compact>
              {loginFail && (
                <Typography.Paragraph
                  style={{ width: "100%", textAlign: "center", marginTop: 12 }}>
                  Đăng ký thất bại
                </Typography.Paragraph>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
