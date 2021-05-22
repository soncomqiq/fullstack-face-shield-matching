import React, { useState, useEffect } from "react";
import {
  Form,
  notification,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Select,
} from "antd";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Axios from "../../../configs/axios";

const { Title } = Typography;

const layout = {
  labelCol: { xs: 24, sm: 24, md: 10, lg: 10, xl: 10, xxl: 9 },
  wrapperCol: { xs: 24, sm: 24, md: 14, lg: 14, xl: 14, xxl: 15 },
};

const openNotification = (type, placement = "topRight") => {
  if (type === "success") {
    notification.success({
      message: `การลงทะเบียนสำเร็จ`,
      placement,
    });
  } else {
    notification.error({
      message: `การลงทะเบียนล้มเหลว`,
      placement,
    });
  }
};

function RegisterPage(props) {
  const [form] = Form.useForm();
  const [geographiesList, setGeographiesList] = useState([]);
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [subDistrictsList, setSubDistrictsList] = useState([]);
  const [geographyId, setGeographyId] = useState(0);
  const [provinceId, setProvinceId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [pdsId, setPdsId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        `/sub-districts/?province_id=${provinceId}&district_id=${districtId}`
      );
      setSubDistrictsList(result.data);
    };

    form.setFieldsValue({
      SubDistricts: "โปรดเลือกอำเภอ/แขวง",
    });

    fetchData();
  }, [districtId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(`/districts/?province_id=${provinceId}`);
      setSubDistrictsList([]);
      setDistrictsList(result.data);
    };

    form.setFieldsValue({
      Districts: "โปรดเลือกตำบล/เขต",
      SubDistricts: "",
    });

    fetchData();
  }, [provinceId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(`/provinces?region_id=${geographyId}`);
      setProvincesList(result.data);
    };

    form.setFieldsValue({
      Provinces: "โปรดเลือกจังหวัด",
      Districts: "",
      SubDistricts: "",
    });

    fetchData();
  }, [geographyId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(`/regions`);
      setGeographiesList(result.data);
    };

    form.setFieldsValue({
      Regions: "โปรดเลือกภูมิภาค",
      Provinces: "",
      Districts: "",
      SubDistricts: "",
    });

    fetchData();
  }, []);

  function renderList(
    labelNameTH,
    labelNameEN,
    renderList,
    fieldValue = "name"
  ) {
    let englishLabel = labelNameEN;

    if (labelNameEN === "Sub-districts") labelNameEN = "SubDistricts";

    const jsxRender = renderList.map((item) => (
      <Select.Option key={item.id} value={item.id}>
        {item[fieldValue]}
      </Select.Option>
    ));

    return (
      <Form.Item
        label={`${labelNameTH} (${englishLabel})`}
        name={labelNameEN}
        defaultValue={renderList[0] && renderList[0].id}
        rules={[{ required: true, message: `โปรดกรอก${labelNameTH}` }]}
      >
        <Select onChange={(value) => onChangeId(value, labelNameEN)}>
          {jsxRender}
        </Select>
      </Form.Item>
    );
  }

  function onChangeId(value, labelNameEN) {
    switch (labelNameEN) {
      case "Regions":
        setGeographyId(value);
      case "Provinces":
        setProvinceId(value);
        break;
      case "Districts":
        setDistrictId(value);
        break;
      case "SubDistricts":
        setPdsId(value);
        break;
      default:
      // Do nothing
    }
  }

  const onFinish = async (values) => {
    console.log(values);
    const body = {
      region_id: geographyId,
      pds_id: pdsId,
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      line_id: values.line_id,
      nick_name: values.nick_name,
      password: values.password,
      phone_no: values.phone_no,
    };

    try {
      await axios.post("/makers/register", body);
      openNotification("success");
      props.history.push("/login");
    } catch (ex) {
      console.log(ex);
      openNotification("error");
    }
  };

  return (
    <Row justify="center">
      <Col xs={23} sm={18} md={18} lg={14} xl={12} xxl={10}>
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
              Register as makers
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
                form={form}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="อีเมล์ (Username)"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  label="ชื่อจริง (First name)"
                  name="first_name"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  label="นามสกุล (Last name)"
                  name="last_name"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  label="ชื่อเล่น (Nick Name)"
                  name="nick_name"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  label="ไลน์ไอดี (Line ID)"
                  name="line_id"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                {renderList("ภูมิภาค", "Regions", geographiesList, "region")}
                {renderList("จังหวัด", "Provinces", provincesList, "province")}
                {renderList(
                  "อำเภอ/เขต",
                  "Districts",
                  districtsList,
                  "district"
                )}
                {renderList(
                  "ตำบล/แขวง",
                  "Sub-districts",
                  subDistrictsList,
                  "sub_district"
                )}
                <Form.Item
                  label="เบอร์โทรศัพท์ (Phone Number)"
                  name="phone_no"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  label="รหัสผ่าน (Password)"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  label="ยืนยันรหัสผ่าน (Confirm Password)"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
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
                      Register
                    </Button>
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

export default withRouter(RegisterPage);
