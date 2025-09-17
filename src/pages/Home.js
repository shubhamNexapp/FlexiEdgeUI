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
} from "reactstrap";
import Breadcrumbs from "../components/Breadcrumb";
import { getData } from "../helpers/api";

const Peers = () => {
  document.title = "Device Details | Minia";

  const [loading, setLoading] = useState(true);
  const [deviceData, setDeviceData] = useState(null);

  const fetchDeviceData = async () => {
    try {
      const response = await getData("/device");
      console.log("Device data:", response);
      setDeviceData(response);
    } catch (error) {
      console.error("Failed to load device data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!deviceData) {
    return (
      <Container className="py-5">
        <p className="text-center">No device data found.</p>
      </Container>
    );
  }

  const { vRouter, deviceManagement, deviceSerialNumber, machineId, versions, hostname, os } = deviceData;

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Card className="mb-4">
              <CardHeader>
                <h4 className="card-title">Device Information</h4>
              </CardHeader>
              <CardBody>
                <Row className="mb-2">
                  <Col sm={4}><strong>Hostname:</strong></Col>
                  <Col sm={8}>{hostname || "-"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4}><strong>OS:</strong></Col>
                  <Col sm={8}>{os || "-"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4}><strong>Device Serial Number:</strong></Col>
                  <Col sm={8}>{deviceSerialNumber || "-"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4}><strong>Machine ID:</strong></Col>
                  <Col sm={8}>{machineId || "-"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4}><strong>Device Management:</strong></Col>
                  <Col sm={8}>{deviceManagement || "-"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4}><strong>vRouter State:</strong></Col>
                  <Col sm={8}>{vRouter?.state || "-"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={4}><strong>vRouter Reason:</strong></Col>
                  <Col sm={8}>{vRouter?.reason || "-"}</Col>
                </Row>

                <h5 className="mt-3">Versions</h5>
                <Row className="mb-2">
                  <Col sm={4}><strong>Device Version:</strong></Col>
                  <Col sm={8}>{versions?.device || "-"}</Col>
                </Row>

                <h6 className="mt-2">Components</h6>
                {versions?.components && Object.entries(versions.components).map(([key, val]) => (
                  <Row className="mb-2" key={key}>
                    <Col sm={4}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong></Col>
                    <Col sm={8}>{val.version || "-"}</Col>
                  </Row>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Peers;
