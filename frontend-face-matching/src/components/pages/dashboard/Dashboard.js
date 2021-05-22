import React, { useEffect, useState } from "react";
import { Statistic, Row, Col, Typography, Button } from "antd";
import axios from "../../../configs/axios";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

const { Title } = Typography;

function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const dashboards = await axios.get("/dashboards");
      setStats(dashboards.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <Row justify="space-around">
        <Col span={10}>
          <div
            style={{
              borderRadius: "5px",
              boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#F8F8F8",
              marginTop: "20px",
              padding: "20px 0",
            }}
          >
            <Statistic
              title={<Title level={3}>จำนวนโรงพยาบาลที่เข้าร่วม</Title>}
              value={stats.number_of_hospitals}
            />
          </div>
        </Col>
        <Col span={10}>
          <div
            style={{
              borderRadius: "5px",
              boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#F8F8F8",
              marginTop: "20px",
              padding: "20px 0",
            }}
          >
            <Statistic
              title={<Title level={3}>จำนวนผู้ช่วยเหลือโรงพยาบาล</Title>}
              value={stats.number_of_makers}
            />
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={10}>
          <div
            style={{
              borderRadius: "5px",
              boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#F8F8F8",
              marginTop: "60px",
              width: "100%",
              padding: "20px 0",
            }}
          >
            <Pie
              options={{
                legend: {
                  labels: {
                    fontFamily: "Arial",
                    fontSize: 20,
                    fontColor: "black",
                  },
                },
              }}
              data={{
                labels: [
                  "จำนวนที่อยู่ในระหว่างดำเนินการ",
                  "จำนวนที่ส่งเรียบร้อยแล้ว",
                ],
                datasets: [
                  {
                    data: [
                      stats.request_amount + stats.reserve_amount,
                      stats.delivered_amount,
                    ],
                    backgroundColor: ["#FF6384", "#36A2EB"],
                    hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                  },
                ],
              }}
            />
          </div>
        </Col>
      </Row>
      <Row justify="space-around" style={{ marginTop: "35px" }}>
        <Col span={10}>
          <Link to="/requests">
            <div
              style={{
                borderRadius: "5px",
                boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
                backgroundColor: "#F8F8F8",
                marginTop: "80px",
                width: "100%",
                padding: "20px 20px",
                fontSize: "20px",
              }}
            >
              ส่งคำขอ
            </div>
          </Link>
        </Col>
        <Col span={10}>
          <Link to="/login">
            <div
              style={{
                borderRadius: "5px",
                boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
                backgroundColor: "#F8F8F8",
                marginTop: "80px",
                width: "100%",
                padding: "20px 20px",
                fontSize: "20px",
              }}
            >
              เข้าร่วมเป็น Makers
            </div>
          </Link>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
