import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Select,
  Typography,
  Input,
  Button,
  InputNumber,
  Divider,
  notification,
  Modal,
  Table,
} from "antd";
import Axios from "../../../configs/axios";
import "./RequestPage.css";
import axios from "../../../configs/axios";
import { withRouter } from "react-router-dom";
import moment from "moment";

const { Title, Text } = Typography;
const layout = {
  labelCol: { xs: 24, sm: 9, md: 8, lg: 9, xl: 8, xxl: 8 },
  wrapperCol: { xs: 24, sm: 15, md: 16, lg: 15, xl: 16, xxl: 16 },
};

function RequestPage(props) {
  const [form] = Form.useForm();
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [subDistrictsList, setSubDistrictsList] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [geographyId, setGeographyId] = useState(0);
  const [provinceId, setProvinceId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [pdsId, setPdsId] = useState(0);
  const [hospitalId, setHospitalId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);
  const [isShow, setIsShow] = useState({
    hospital: false,
    department: false,
  });
  const [currentAddedValue, setCurrentAddedValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [fieldAddedValue, setFieldAddedValue] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [hospitalNameApi, setHospitalNameApi] = useState("");

  useEffect(() => {
    if (departmentId === -1) {
      setIsShow((prevIsShow) => ({
        hospital: prevIsShow.hospital,
        department: true,
      }));
    } else {
      setIsShow((prevIsShow) => ({
        hospital: prevIsShow.hospital,
        department: false,
      }));
    }
  }, [departmentId]);

  useEffect(() => {
    const fetchData = async () => {
      const hospital = await Axios.get(`/hospitals/${hospitalId}`);
      const requestlist = await Axios.get(
        `/requests?hospital_id=${hospitalId}`
      );

      setHospitalNameApi(hospital.data.hospital);
      setRequestList(requestlist.data);
    };

    if (hospitalId === -1) {
      setIsShow((prevIsShow) => ({
        hospital: true,
        department: prevIsShow.department,
      }));
      setRequestList([]);
      setHospitalNameApi("");
    } else {
      setIsShow((prevIsShow) => ({
        hospital: false,
        department: prevIsShow.department,
      }));
      fetchData();
    }
  }, [hospitalId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(`/hospitals?pds_id=${pdsId}`);
      setRequestList([]);
      setHospitalsList(result.data);
      setIsShow((prevIsShow) => ({
        hospital: false,
        department: prevIsShow.department,
      }));
    };

    form.setFieldsValue({
      Hospitals: "โปรดเลือกโรงพยาบาล",
    });

    fetchData();
  }, [pdsId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        `/sub-districts/?province_id=${provinceId}&district_id=${districtId}`
      );
      setHospitalsList([]);
      setRequestList([]);
      setSubDistrictsList(result.data);
      setIsShow((prevIsShow) => ({
        hospital: false,
        department: prevIsShow.department,
      }));
    };

    form.setFieldsValue({
      SubDistricts: "โปรดเลือกอำเภอ/แขวง",
      Hospitals: "",
    });

    fetchData();
  }, [districtId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(`/districts/?province_id=${provinceId}`);
      setHospitalsList([]);
      setSubDistrictsList([]);
      setRequestList([]);
      setDistrictsList(result.data);
      setIsShow((prevIsShow) => ({
        hospital: false,
        department: prevIsShow.department,
      }));
    };

    form.setFieldsValue({
      Districts: "โปรดเลือกตำบล/เขต",
      SubDistricts: "",
      Hospitals: "",
    });

    fetchData();
  }, [provinceId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(`/provinces?region_id=${geographyId}`);
      const departments = await Axios.get(`/departments`);
      setDepartmentsList(departments.data);
      setRequestList([]);
      setProvincesList(result.data);
      setIsShow((prevIsShow) => ({
        hospital: false,
        department: prevIsShow.department,
      }));
    };

    form.setFieldsValue({
      Provinces: "โปรดเลือกจังหวัด",
      Districts: "",
      SubDistricts: "",
      Hospitals: "",
      Departments: "โปรดเลือกแผนก",
    });

    fetchData();
  }, []);

  function onChangeId(value, labelNameEN) {
    switch (labelNameEN) {
      case "Provinces":
        setProvinceId(value);
        break;
      case "Districts":
        setDistrictId(value);
        break;
      case "SubDistricts":
        setPdsId(value);
        break;
      case "Hospitals":
        setHospitalId(value);
        break;
      case "Departments":
        setDepartmentId(value);
        break;
      default:
      // Do nothing
    }
  }

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

    if (pdsId && labelNameEN === "Hospitals") {
      jsxRender.push(
        <Select.Option key={-1} value={-1}>
          อื่น ๆ (โปรดกรอกเพิ่มเติม)
        </Select.Option>
      );
    }

    if (labelNameEN === "Departments") {
      jsxRender.push(
        <Select.Option key={-1} value={-1}>
          อื่น ๆ (โปรดกรอกเพิ่มเติม)
        </Select.Option>
      );
    }

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

  async function onFinish(values) {
    const body = {
      province_id: values.Provinces,
      district_id: values.Districts,
      sub_district_id: values.SubDistricts,
      amount: values.amount,
      department_id: values.Departments,
      name: values.name,
      line_id: values.lineId,
      hospital_id: values.Hospitals,
    };

    if (values.Hospitals === -1) {
      body.hospital_name = values.specificHospital;
    }

    if (values.Departments === -1) {
      body.department_name = values.specificDepartment;
    }

    try {
      await axios.post("/requests", body);
      notification.success({
        message: "ส่ง Request สำเร็จ",
        description: `การส่ง Request Face-Shield ของคุณ ${values.name} สำเร็จ`,
      });
      props.history.push("/");
    } catch (ex) {
      notification.error({
        message: "เกิดข้อผิดพลาดขึ้น",
        description: "การส่ง Request Face-Shield ไม่สำเร็จ",
      });
    }
  }

  const handleOk = (e) => {
    console.log(e);
    setVisible(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
  };

  const comfirm = (name, value) => {
    if (!value) return;
    setFieldAddedValue(name);
    setCurrentAddedValue(value);
    setVisible(true);
  };

  const columns = [
    {
      title: "ชื่อผู้ขอ",
      dataIndex: "MedicalStaff",
      key: "MedicalStaff",
      render: (MedicalStaff) => (
        <div key={MedicalStaff.id}>{MedicalStaff.name}</div>
      ),
    },
    {
      title: "แผนก",
      dataIndex: "MedicalStaff",
      key: "MedicalStaff",
      render: (MedicalStaff) => (
        <div key={MedicalStaff.Department.id}>
          {MedicalStaff.Department.department}
        </div>
      ),
    },
    {
      title: "จำนวนการขอทั้งหมด",
      render: (text, record) => (
        <div>
          {record.request_amount +
            record.reserve_amount +
            record.delivered_amount}
        </div>
      ),
    },
    {
      title: "จำนวนที่เหลือ",
      dataIndex: "request_amount",
      key: "request_amount",
    },
    {
      title: "จำนวนที่จองแล้ว",
      dataIndex: "reserve_amount",
      key: "reserve_amount",
    },
    {
      title: "จำนวนที่ส่งแล้ว",
      dataIndex: "delivered_amount",
      key: "delivered_amount",
    },
    {
      title: "ส่งคำขอไปเมื่อ",
      key: "createdAt",
      render: (createdAt) => (
        <div key={createdAt}>
          {moment(createdAt).format("DD MMM YYYY HH:mm:ss")}
        </div>
      ),
    },
  ];

  return (
    <Row justify="center" style={{ padding: "auto" }}>
      <Col xs={23} sm={23} md={23} lg={14} xl={14} xxl={12}>
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
              แบบฟอร์มสำหรับขออุปกรณ์
            </Title>
          </Row>
          <Divider
            style={{ marginTop: "10px", backgroundColor: "#D0D0D0" }}
          ></Divider>
          <Row justify="center">
            <Col span={20}>
              <Form
                {...layout}
                onFinish={onFinish}
                style={{ width: "100%" }}
                form={form}
                defaultValue={{
                  Provinces: "",
                  Districts: "",
                  SubDistricts: "",
                  Hospitals: "",
                  Departments: "",
                }}
              >
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
                {renderList(
                  "โรงพยาบาล",
                  "Hospitals",
                  hospitalsList,
                  "hospital"
                )}
                {hospitalNameApi && requestList.length > 0 ? (
                  <div
                    style={{
                      borderRadius: "5px",
                      boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
                      backgroundColor: "#F8F8F8",
                      marginTop: "20px",
                      marginBottom: "30px",
                    }}
                  >
                    <Row
                      style={{ width: "100%", paddingTop: "10px" }}
                      justify="center"
                    >
                      <Title level={3}>
                        คำร้องขอทั้งหมดของ
                        <Text type="danger">
                          <strong>{hospitalNameApi}</strong>
                        </Text>
                      </Title>
                      <Col>
                        <Table dataSource={requestList} columns={columns} />
                      </Col>
                    </Row>
                  </div>
                ) : null}
                {isShow.hospital ? (
                  <Form.Item
                    label={
                      <Text type="danger">อื่น ๆ (โปรดกรอกเพิ่มเติม)</Text>
                    }
                    name="specificHospital"
                    rules={[
                      { required: true, message: "โปรดกรอกชื่อโรงพยาบาล" },
                    ]}
                  >
                    <Input
                      onChange={(e) => setCurrentAddedValue(e.target.value)}
                      onBlur={(e) => comfirm("โรงพยาบาล", e.target.value)}
                    />
                  </Form.Item>
                ) : null}
                {renderList(
                  "แผนก",
                  "Departments",
                  departmentsList,
                  "department"
                )}
                {isShow.department ? (
                  <Form.Item
                    label={
                      <Text type="danger">อื่น ๆ (โปรดกรอกเพิ่มเติม)</Text>
                    }
                    name="specificDepartment"
                    rules={[{ required: true, message: "โปรดกรอกชื่อแผนก" }]}
                  >
                    <Input
                      onChange={(e) => setCurrentAddedValue(e.target.value)}
                      onBlur={(e) => comfirm("แผนก", e.target.value)}
                    />
                  </Form.Item>
                ) : null}
                <Form.Item
                  label="ชื่อผู้ขอ"
                  name="name"
                  rules={[{ required: true, message: "โปรดกรอกชื่อ" }]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  name="lineId"
                  label="Line ID"
                  rules={[{ required: true, message: "โปรดกรอกชื่อ Line ID" }]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="จำนวนที่ขอ (ไม่เกิน 100)"
                  rules={[
                    { required: true, message: "โปรดกรอกจำนวนที่ขอ" },
                    {
                      type: "number",
                      min: 1,
                      max: 100,
                      message: "โปรดกรอกจำนวนระหว่าง 1 ถึง 100",
                    },
                  ]}
                >
                  <InputNumber
                    className="input-request"
                    style={{ width: "100%", borderRadius: "5px" }}
                  />
                </Form.Item>
                <br />
                <Button
                  style={{
                    fontSize: "20px",
                    width: "100%",
                    height: "auto",
                    marginBottom: "20px",
                  }}
                  htmlType="submit"
                  type="primary"
                >
                  ส่งคำขออุปกรณ์
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
      <Modal
        title={`เพิ่ม${fieldAddedValue}ลงระบบ`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          คุณแน่ใจว่าต้องการเพิ่ม{fieldAddedValue}ชื่อ
          <Text type="danger">
            <strong>{currentAddedValue}</strong>
          </Text>
          ลงระบบ
        </p>
      </Modal>
    </Row>
  );
}

export default withRouter(RequestPage);
