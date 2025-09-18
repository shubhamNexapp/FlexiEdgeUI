// src/pages/Peers.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Input,
} from "reactstrap";
import { getData, putData } from "../helpers/api"; // ✅ make sure putData handles PUT requests

const Settings = () => {
  document.title = "Device Settings | Minia";

  const [loading, setLoading] = useState(true); // page loader
  const [deviceData, setDeviceData] = useState(null);

  // Token state
  const [token, setToken] = useState("");
  const [updatedToken, setUpdatedToken] = useState("");

  // Device ID state
  const [deviceId, setDeviceId] = useState("");

  // Loader for update actions
  const [updatingUuid, setUpdatingUuid] = useState(false);
  const [updatingToken, setUpdatingToken] = useState(false);

  // ✅ Fetch device details
  const fetchDeviceData = async () => {
    try {
      const response = await getData("/device");
      setDeviceData(response);
      setDeviceId(response?.machineId || response?.deviceSerialNumber || "");
    } catch (error) {
      console.error("Failed to load device data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch token
  const fetchToken = async () => {
    try {
      const response = await getData("/token");
      setToken(response?.deviceToken || "");
      setUpdatedToken(response?.deviceToken || "");
    } catch (error) {
      console.error("Failed to load token:", error);
    }
  };

  // ✅ Update token
  const handleUpdateToken = async () => {
    setUpdatingToken(true);
    try {
      await putData("/token", { deviceToken: updatedToken });
      setToken(updatedToken);
    } catch (error) {
      console.error("Failed to update token:", error);
    } finally {
      setUpdatingToken(false);
    }
  };

  // ✅ Generate UUID (local only)
  const handleGenerateUuid = () => {
    const uid = crypto.randomUUID();
    setDeviceId(uid);
  };

  // ✅ Update UUID (API call)
  const handleUpdateUuid = async () => {
    setUpdatingUuid(true);
    try {
      const uid = crypto.randomUUID();
      console.log("Generated UUID:", uid);

      await putData("uuid", {
        machineId: uid,
      });

      setDeviceId(uid);
    } catch (error) {
      console.error("Failed to update UUID:", error);
    } finally {
      setUpdatingUuid(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
    fetchToken();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          {/* ✅ Token Card */}
          <Col xs={12}>
            <Card className="mb-4">
              <CardHeader>
                <h4 className="card-title">Token</h4>
                <p className="mb-0 text-muted">
                  View and update your organization token in order to register
                  the device.
                </p>
              </CardHeader>
              <CardBody>
                <Input
                  type="textarea"
                  rows="4"
                  value={updatedToken}
                  onChange={(e) => setUpdatedToken(e.target.value)}
                />
                <Button
                  color="primary"
                  className="mt-3"
                  onClick={handleUpdateToken}
                  disabled={updatingToken}
                >
                  {updatingToken ? <Spinner size="sm" /> : "Update Token"}
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* ✅ Device ID Card */}
          <Col xs={12}>
            <Card className="mb-4">
              <CardHeader>
                <h4 className="card-title">Device ID</h4>
                <p className="mb-0 text-muted">
                  Use your own or auto-generated device UUID.
                </p>
              </CardHeader>
              <CardBody>
                <Input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                />
                <div className="d-flex gap-2 mt-3">
                  <Button color="secondary" onClick={handleGenerateUuid}>
                    Generate UUID
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleUpdateUuid}
                    disabled={updatingUuid}
                  >
                    {updatingUuid ? <Spinner size="sm" /> : "Update UUID"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Settings;
