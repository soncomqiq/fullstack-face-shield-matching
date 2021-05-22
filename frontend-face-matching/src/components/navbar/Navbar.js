import React from "react";
import { Menu, notification } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import LocalStorageService from "../../services/LocalStorageService";

const { SubMenu } = Menu;

function Navbar(props) {
  const handleClick = (e) => {
    console.log("click ", e);
    switch (e.key) {
      case "request":
        props.history.push("/request-list");
        break;
      case "reserve":
        props.history.push("/reserve-list");
        break;
      case "logout":
        props.setRole("guest");
        LocalStorageService.clearToken();
        notification.success({
          message: `ออกจากระบบสำเร็จแล้ว`,
          placement: "topRight",
        });
        props.history.push("/login");
        break;
      default:
    }
  };

  return (
    <Menu mode="horizontal" theme="dark">
      <SubMenu
        key="request"
        onTitleClick={handleClick}
        title={
          <span>
            <MailOutlined />
            <span>การขออุปกรณ์ทั้งหมด</span>
          </span>
        }
      ></SubMenu>
      <SubMenu
        key="reserve"
        onTitleClick={handleClick}
        title={
          <span>
            <AppstoreOutlined />
            <span>การจองทั้งหมดของคุณ</span>
          </span>
        }
      ></SubMenu>
      <SubMenu
        key="logout"
        onTitleClick={handleClick}
        title={
          <span>
            <SettingOutlined />
            <span>Logout</span>
          </span>
        }
      ></SubMenu>
    </Menu>
  );
}

export default withRouter(Navbar);
