import React from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  notification,
} from "antd";
import axios from "../../../configs/axios";
import LocalStorageService from "../../../services/LocalStorageService";
import { Link } from "react-router-dom";
import querystring from "querystring";

const { Title } = Typography;

const layout = {
  labelCol: { xs: 24, sm: 5, md: 4, lg: 5, xl: 5, xxl: 5 },
  wrapperCol: { xs: 24, sm: 19, md: 20, lg: 19, xl: 19, xxl: 19 },
};

export default function LoginPage(props) {
  const onFinish = async ({ username, password }) => {
    try {
      const result = await axios.post("/makers/login", { username, password });
      LocalStorageService.setToken(result.data);
      props.setRole("maker");
      notification.success({
        message: `เข้าสู่ระบบสำเร็จ`,
        placement: "topRight",
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: `เข้าสู่ระบบล้มเหลว`,
        placement: "topRight",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row justify="center">
      <Col xs={23} sm={18} md={18} lg={14} xl={10} xxl={8}>
        <div
          style={{
            borderRadius: "5px",
            boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
            backgroundColor: "#F8F8F8",
            marginTop: "20px",
          }}
        >
          <Row justify="center">
            <Title level={2} style={{ marginTop: "25px" }}>
              Login as makers
            </Title>
          </Row>
          <Divider
            style={{ marginTop: "10px", backgroundColor: "#D0D0D0" }}
          ></Divider>
          <Row justify="center">
            <Col span={22}>
              <Form
                style={{ width: "100%" }}
                className="App"
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item style={{ width: "100%", justifyContent: "center" }}>
                  <Row justify="center">
                    <Button
                      style={{
                        fontSize: "20px",
                        width: "100%",
                        height: "auto",
                        marginBottom: "5px",
                      }}
                      type="primary"
                      htmlType="submit"
                    >
                      Login
                    </Button>
                    หรือ&nbsp;<Link to="/register">ลงทะเบียน</Link>
                  </Row>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
