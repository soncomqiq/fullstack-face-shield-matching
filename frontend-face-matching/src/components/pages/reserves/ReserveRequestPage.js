import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "../../../configs/axios";
import {
  Row,
  Col,
  List,
  Divider,
  Input,
  Button,
  InputNumber,
  Form,
  notification,
} from "antd";

function ReserveRequestPage(props) {
  const [request, setRequest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(`/requests/${props.match.params.id}`);
      setRequest(request.data);
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    notification.success({
      message: `จองคำขอหมายเลย ${request.id} จำนวน ${values.reserve_amount} เรียบร้อย`,
    });

    await axios.post(`/reserves?request_id=${Number(request.id)}`, {
      reserve_amount: values.reserve_amount,
    });

    props.history.push("/reserve-list");
  };

  return (
    <Row justify="center">
      <Col span={20}>
        <div
          style={{
            borderRadius: "5px",
            boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
            backgroundColor: "#F8F8F8",
            marginTop: "20px",
            marginBottom: "30px",
            padding: "20px 0",
            fontSize: "20px",
          }}
        >
          <Row>
            <Col xs={24} md={6}>
              <strong>โรงพยาบาล</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.MedicalStaff?.Hospital.hospital}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={6}>
              <strong>แผนก</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.MedicalStaff?.Department.department}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={6}>
              <strong>ชื่อผู้ขอ</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.MedicalStaff?.name}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={6}>
              <strong>Line ID ผู้ขอ</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.MedicalStaff?.line_id}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={6}>
              <strong>จำนวนที่ขอ(เหลือ)</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.request_amount}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={6}>
              <strong>จำนวนที่กำลังถูกส่ง</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.reserve_amount}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={6}>
              <strong>จำนวนที่ถูกส่งเรียบร้อยแล้ว</strong>
            </Col>
            <Col xs={24} md={18}>
              {request.delivered_amount}
            </Col>
            <Col xs={24}>
              <Divider />
            </Col>
          </Row>
          <Row justify="space-around">
            <Form onFinish={onFinish}>
              <Form.Item
                name="reserve_amount"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    max: Number(request.request_amount),
                    message: `คุณสามารถจองได้ตั้งแต่ 1 - ${request.request_amount} ชิ้น`,
                  },
                ]}
              >
                <InputNumber width="100%" />
              </Form.Item>
              <Button htmlType="submit" style={{ width: "100%" }}>
                จอง
              </Button>
            </Form>
          </Row>
        </div>
      </Col>
    </Row>
  );
}

export default withRouter(ReserveRequestPage);
