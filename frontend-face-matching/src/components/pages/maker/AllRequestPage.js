import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Tag, Table, Row, Col, Divider } from "antd";
import jwtDecode from "jwt-decode";
import LocalStorageService from "../../../services/LocalStorageService";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "ชื่อโรงพยาบาล",
    dataIndex: "MedicalStaff",
    render: (MedicalStaff) => (
      <div key={MedicalStaff.id + MedicalStaff.Hospital.hospital}>
        {MedicalStaff.Hospital.hospital}
      </div>
    ),
  },
  {
    title: "แผนก",
    dataIndex: "MedicalStaff",
    render: (MedicalStaff) => (
      <div key={MedicalStaff.id}>{MedicalStaff.Department.department}</div>
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
    title: "จังหวัด",
    dataIndex: "MedicalStaff",
    render: (MedicalStaff) => (
      <div key={MedicalStaff.id}>
        {MedicalStaff.Hospital.ProvinceDistrictSubdistrict.province}
      </div>
    ),
  },
  {
    title: "Action",
    render: (text, record) => (
      <span key={record.id}>
        <Link to={`/reserves/${record.id}`}>
          <Button>Reserve</Button>
        </Link>
      </span>
    ),
  },
];

function AllRequestPage() {
  const [pageNumberRequest, setPageNumberRequest] = useState(1);
  const [pageNumberUrgent, setPageNumberUrgent] = useState(1);
  const [pageNumberRegion, setPageNumberRegion] = useState(1);
  const [pageSizeRequest, setPageSizeRequest] = useState(10);
  const [pageSizeUrgent, setPageSizeUrgent] = useState(10);
  const [pageSizeRegion, setPageSizeRegion] = useState(10);
  const [requestList, setRequestList] = useState([]);
  const [urgentRequestList, setUrgentRequestList] = useState([]);
  const [regionRequestList, setRegionRequestList] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [loadingRegion, setLoadingRegion] = useState(true);
  const [loadingUrgent, setLoadingUrgent] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("/makers/check-token");
      const requests = await axios.get(
        `/requests/?page_size=${pageSizeRequest}&page=${pageNumberRequest}`
      );

      setRequestList({
        requests: requests.data.requests,
        totalRequests: requests.data.totalRequests,
      });
      setLoadingRequest(false);
    };

    fetchData();
  }, [pageNumberRequest, pageSizeRequest]);

  useEffect(() => {
    const fetchData = async () => {
      const urgentRequests = await axios.get(
        `/requests/?page_size=${pageSizeUrgent}&page=${pageNumberUrgent}&urgent=1`
      );

      setUrgentRequestList({
        requests: urgentRequests.data.requests,
        totalRequests: urgentRequests.data.totalRequests,
      });
      setLoadingUrgent(false);
    };

    fetchData();
  }, [pageNumberUrgent, pageSizeUrgent]);

  useEffect(() => {
    const fetchData = async () => {
      const user = jwtDecode(LocalStorageService.getAccessToken());
      const regionRequests = await axios.get(
        `/requests/?page_size=${pageSizeRegion}&page=${pageNumberRegion}&region_id=${user.region_id}`
      );

      setRegionRequestList({
        requests: regionRequests.data.requests,
        totalRequests: regionRequests.data.totalRequests,
      });
      setLoadingRegion(false);
    };

    fetchData();
  }, [pageNumberRegion, pageSizeRegion]);

  function onChange(pageNumber, type) {
    switch (type) {
      case "urgent":
        setPageNumberUrgent(pageNumber.current);
        setPageSizeUrgent(pageNumber.pageSize);
        break;
      case "region":
        setPageNumberRegion(pageNumber.current);
        setPageSizeRegion(pageNumber.pageSize);
        break;
      case "request":
        setPageNumberRequest(pageNumber.current);
        setPageSizeRequest(pageNumber.pageSize);
        break;
      default:
      // Do Nothing
    }
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      <Row justify="center">
        <Col span={23}>
          <div
            style={{
              borderRadius: "5px",
              boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#F8F8F8",
              marginTop: "20px",
              padding: "0 5px 0 0",
              border: "2px solid red",
            }}
          >
            <div
              style={{
                marginTop: "15px",
                marginLeft: "15px",
                fontSize: "25px",
                display: "flex",
                alignItems: "start",
                color: "red",
              }}
            >
              โรงพยาบาลที่ต้องการความช่วยเหลือด่วน
            </div>
            <Divider style={{ backgroundColor: "red", marginBottom: "0" }} />
            <Table
              loading={loadingUrgent}
              style={{ borderRadius: "5px" }}
              columns={columns}
              dataSource={urgentRequestList.requests}
              pagination={{
                defaultCurrent: pageNumberUrgent,
                total: urgentRequestList.totalRequests,
              }}
              onChange={(pageNumber) => onChange(pageNumber, "urgent")}
            />
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={23}>
          <div
            style={{
              borderRadius: "5px",
              boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#F8F8F8",
              marginTop: "20px",
              padding: "0 5px 0 0",
              border: "2px solid black",
            }}
          >
            <div
              style={{
                marginTop: "15px",
                marginLeft: "15px",
                fontSize: "25px",
                display: "flex",
                alignItems: "start",
                color: "black",
              }}
            >
              โรงพยาบาลที่อยู่พื้นที่ใกล้เคียงกับคุณ
            </div>
            <Divider style={{ backgroundColor: "black", marginBottom: "0" }} />
            <Table
              loading={loadingRegion}
              style={{ borderRadius: "5px" }}
              columns={columns}
              dataSource={regionRequestList.requests}
              pagination={{
                defaultCurrent: pageNumberRegion,
                total: regionRequestList.totalRequests,
              }}
              onChange={(pageNumber) => onChange(pageNumber, "region")}
            />
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={23}>
          <div
            style={{
              borderRadius: "5px",
              boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#F8F8F8",
              marginTop: "20px",
              padding: "0 5px 0 0",
              border: "2px solid blue",
            }}
          >
            <div
              style={{
                marginTop: "15px",
                marginLeft: "15px",
                fontSize: "25px",
                display: "flex",
                alignItems: "start",
                color: "blue",
              }}
            >
              โรงพยาบาลที่ขอทั้งหมด
            </div>
            <Divider style={{ backgroundColor: "blue", marginBottom: "0" }} />
            <Table
              loading={loadingRequest}
              style={{ borderRadius: "5px" }}
              columns={columns}
              dataSource={requestList.requests}
              pagination={{
                defaultCurrent: pageNumberRequest,
                total: requestList.totalRequests,
              }}
              onChange={(pageNumber) => onChange(pageNumber, "request")}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AllRequestPage;
