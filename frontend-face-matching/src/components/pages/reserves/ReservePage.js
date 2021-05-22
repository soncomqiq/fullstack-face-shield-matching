import React, { useEffect, useState } from "react";
import { Table, Col, Row, Typography, Button, Modal, Tag } from "antd";
import { Link } from "react-router-dom";
import axios from "../../../configs/axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { confirm } = Modal;

function ReservePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/reserves`);
      setData(result.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "หมายเลขการจอง",
      dataIndex: "id",
    },
    {
      title: "หมายเลข Request",
      dataIndex: "request_id",
      render: (id) => <Link to={`/reserves/${id}`}>{id}</Link>,
    },
    {
      title: "จำนวนที่จอง",
      dataIndex: "amount",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      render: (status) => {
        let color;
        if (status === "CANCELED") {
          color = "volcano";
        } else if (status === "RESERVE") {
          color = "geekblue";
        } else {
          color = "green";
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      render: (text, record) => (
        <Row justify="space-around">
          <Button
            disabled={record.status !== "RESERVE"}
            onClick={() => showConfirm(record.id)}
            style={{
              backgroundColor:
                record.status === "RESERVE" ? "#28A745" : "#F5F5F5",
              color: record.status === "RESERVE" ? "#FFFFFF" : "#B8B8B8",
            }}
          >
            ทำการส่งเรียบร้อย
          </Button>
          <Button
            disabled={record.status !== "RESERVE"}
            onClick={() => showDeleteConfirm(record.id)}
            type="danger"
          >
            ยกเลิกการจอง
          </Button>
        </Row>
      ),
    },
  ];

  function showConfirm(id) {
    confirm({
      title: (
        <Text style={{ color: "green" }}>
          คุณต้องการจะยืนยันการส่งหมายเลข {id} ?
        </Text>
      ),
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await axios.put(`/reserves/${id}`);
        window.location.reload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  function showDeleteConfirm(id) {
    confirm({
      title: <Text type="danger">คุณแน่ใจว่าจะยกเลิกการจองหมายเลข {id} ?</Text>,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await axios.delete(`/reserves/${id}`);
        window.location.reload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

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
            padding: "20px 20px",
            fontSize: "20px",
          }}
        >
          <Title level={3}>การจองทั้งหมดของคุณ</Title>
          <Table loading={loading} columns={columns} dataSource={data} />
        </div>
      </Col>
    </Row>
  );
}

export default ReservePage;
