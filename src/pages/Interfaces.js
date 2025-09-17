// src/pages/SystemChecker.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import Breadcrumbs from "../components/Breadcrumb";
import { getData, putData } from "../helpers/api";
import { Settings, PlusCircle } from "react-feather";

const Interfaces = () => {
  document.title = "Interfaces | Minia";

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Modal state
  const [dnsModalOpen, setDnsModalOpen] = useState(false);
  const [ifaceModalOpen, setIfaceModalOpen] = useState(false);
  const [selectedIface, setSelectedIface] = useState(null);
   const [addModalOpen, setAddModalOpen] = useState(false);
  const [device,setDevice] = useState()

  // FormData stores DNS + Interface configs for current iface
  const [formData, setFormData] = useState({
    dnsServers: "",
    searchDomains: "",
    interfaceName: "",
    enable: false,
    username: "",
    password: "",
    mtu: "",
    mru: "",
    usePeerDns: false,
    status: "",
  });

   const [addForm, setAddForm] = useState({
    parentInterface: "",
    vlanTag: "",
  });
  const [addErrors, setAddErrors] = useState({});


  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);

  // ✅ Fetch once
  useEffect(() => {
    const fetchCheckers = async () => {
      try {
        const response = await getData("interfaces");
        const sorted = [...response].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );
        setTableData(sorted);
      } catch (err) {
        console.error("Error fetching interfaces:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckers();
    getDevice()
  }, []);

  const getDevice = async () => {
      try {
        const response = await getData("device");
        setDevice(response)
      } catch (err) {
        console.error("Error fetching interfaces:", err);
      } finally {
        setLoading(false);
      }
    };

     // ✅ Open Add Interface Modal
  const handleOpenAddModal = () => {
    setAddForm({ parentInterface: "", vlanTag: "" });
    setAddErrors({});
    setAddModalOpen(true);
  };

    const handleAddChange = (e) => {
    const { id, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

    // ✅ Validate Add Form
  const validateAddForm = () => {
    const errors = {};
    if (!addForm.parentInterface) {
      errors.parentInterface = "Parent Interface is required";
    }
    if (!addForm.vlanTag) {
      errors.vlanTag = "VLAN Tag is required";
    } else if (isNaN(addForm.vlanTag)) {
      errors.vlanTag = "Invalid number";
    } else if (Number(addForm.vlanTag) < 1) {
      errors.vlanTag = "VLAN Tag must be greater than or equal to 1";
    }
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  };

   // ✅ Save Add Form
  const handleSaveAdd = () => {
    if (!validateAddForm()) return;
    console.log("Saving VLAN:", addForm);
    // here you can call your API: postData("interfaces/vlan", addForm)
    setAddModalOpen(false);
  };


  // ✅ Handle Update Interfaces API
 // inside Interfaces component

// ✅ Handle Update Interfaces API
const handleUpdateApi = async () => {
  try {
    setIsRunning(true);

    // Build payload dynamically from tableData (you can also merge formData if editing)
    const payload = tableData.map((iface) => ({
      name: iface.name,
      devId: iface.devId || "",       // ensure these keys exist in your API response
      driver: iface.driver || "",
      MAC: iface.MAC || "",
      IPv4: iface.IPv4 || "",
      IPv4Mask: iface.IPv4Mask || "",
      IPv6: iface.IPv6 || "",
      IPv6Mask: iface.IPv6Mask || "",
      dhcp: iface.dhcp ? "yes" : "no",
      gateway: iface.gateway || "",
      metric: iface.metric || "",
      dns_servers: iface.dns_servers || [], // backend naming
      internetAccess: iface.internetAccess || false,
      public_ip: iface.public_ip || "",
      public_port: iface.public_port || "",
      nat_type: iface.nat_type || "",
      link: iface.link || "down",
      tap_name: iface.tap_name || "",
      mtu: iface.mtu || "1500",
      deviceType: iface.deviceType || "dpdk",
      dnsServers: Array.isArray(iface.dnsServers) ? iface.dnsServers : [],
      dnsDomains: Array.isArray(iface.dnsDomains) ? iface.dnsDomains : [],
      pppoe: {
        config: {
          is_enabled: iface.pppoe?.config?.is_enabled || false,
          usepeerdns: iface.pppoe?.config?.usepeerdns || false,
          nameservers: iface.pppoe?.config?.nameservers || [],
          mtu: iface.pppoe?.config?.mtu || "1491",
          mru: iface.pppoe?.config?.mru || "1500",
          username: iface.pppoe?.config?.username || "",
        },
        status: iface.pppoe?.status || {},
      },
    }));

    // Call your PUT API
    const response = await putData("interfaces", payload);

    console.log("✅ Update Success:====", response);
    
  } catch (error) {
    console.error("❌ Update failed:", error);
    alert("Failed to update interfaces.");
  } finally {
    setIsRunning(false);
  }
};


  // ✅ Open DNS Modal
  const handleOpenDnsModal = (iface) => {
    setSelectedIface(iface);
    setFormData((prev) => ({
      ...prev,
      dnsServers: Array.isArray(iface.dnsServers)
        ? iface.dnsServers.join(", ")
        : iface.dnsServers || "",
      searchDomains: Array.isArray(iface.searchDomains)
        ? iface.searchDomains.join(", ")
        : iface.searchDomains || "",
    }));
    setIsUpdateEnabled(false);
    setDnsModalOpen(true);
  };

  // ✅ Open Interface Modal
  const handleOpenIfaceModal = (iface) => {
    setSelectedIface(iface);
    setFormData((prev) => ({
      ...prev,
      interfaceName: iface.name || "",
      enable: iface.enable || false,
      username: iface.username || "",
      password: iface.password || "",
      mtu: iface.mtu || "",
      mru: iface.mru || "",
      usePeerDns: iface.usePeerDns || false,
      status: iface.status || "",
      dnsServers : iface.dnsServers || []
    }));
    setIsUpdateEnabled(false);
    setIfaceModalOpen(true);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setIsUpdateEnabled(true);
  };

  // ✅ Save DNS (close modal)
  const handleUpdateDnsValue = () => {
    setDnsModalOpen(false);
  };

  // ✅ Save Interface Config (close modal)
  const handleUpdateIfaceValue = () => {
    setIfaceModalOpen(false);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Home" breadcrumbItem="Interfaces" />

        <Row className="mb-3">
          <Col>
            <Button
              color="success"
              onClick={() => handleUpdateApi(false)}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Update Interfaces"}
            </Button>{" "}
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>MAC</th>
                  <th>DHCP/Static</th>
                  <th>IPv4</th>
                  <th>GW</th>
                  <th>DNS Servers</th>
                  <th>Metric</th>
                  <th>Link Status</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((iface, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{iface.name}</span>
                          <Button
                            size="sm"
                            color="link"
                            className="p-0 ms-2"
                            onClick={() => handleOpenIfaceModal(iface)}
                          >
                            <Settings size={16} />
                          </Button>
                        </div>
                      </td>
                      <td>{iface.MAC}</td>
                      <td>{iface.dhcp ? "DHCP" : "Static"}</td>
                      <td>{iface.IPv4}</td>
                      <td>{iface.gateway}</td>
                      <td>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            {Array.isArray(iface.dnsServers)
                              ? iface.dnsServers.join(", ")
                              : iface.dnsServers}
                          </span>
                          <Button
                            size="sm"
                            color="link"
                            className="p-0 ms-2"
                            onClick={() => handleOpenDnsModal(iface)}
                          >
                            <Settings size={16} />
                          </Button>
                        </div>
                      </td>
                      <td>{iface.metric}</td>
                      <td>
                        <span
                          style={{
                            color: iface.link?.toLowerCase() === "up" ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {iface.link}
                        </span>
                      </td>
                      <td>
                        <Button
                            size="sm"
                            color="link"
                            className="p-0 ms-2"
                            onClick={handleOpenAddModal}
                          >
                            <PlusCircle size={16} />
                          </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No interfaces found. Click Run or Auto-Fix.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* ✅ DNS Modal */}
        <Modal isOpen={dnsModalOpen} toggle={() => setDnsModalOpen(!dnsModalOpen)}>
          <ModalHeader toggle={() => setDnsModalOpen(false)}>
            Edit DNS Settings ({selectedIface?.name})
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="dnsServers">DNS Servers</Label>
              <Input
                id="dnsServers"
                type="text"
                value={formData.dnsServers}
                onChange={handleChange}
                placeholder="e.g. 8.8.8.8, 1.1.1.1"
              />
            </FormGroup>
            <FormGroup>
              <Label for="searchDomains">Search Domains</Label>
              <Input
                id="searchDomains"
                type="text"
                value={formData.searchDomains}
                onChange={handleChange}
                placeholder="e.g. example.com, local"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={handleUpdateDnsValue}
              disabled={!isUpdateEnabled}
            >
              Update
            </Button>{" "}
            <Button color="secondary" onClick={() => setDnsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* ✅ Interface Modal */}
        <Modal
          isOpen={ifaceModalOpen}
          toggle={() => setIfaceModalOpen(!ifaceModalOpen)}
        >
          <ModalHeader toggle={() => setIfaceModalOpen(false)}>
            Edit Interface Settings ({selectedIface?.name})
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="interfaceName">Interface</Label>
              <Input
                id="interfaceName"
                type="text"
                value={formData.interfaceName}
                onChange={handleChange}
                disabled
              />
            </FormGroup>
            <FormGroup check className="mb-3">
              <Input
                id="enable"
                type="checkbox"
                checked={formData.enable}
                onChange={handleChange}
              />
              <Label for="enable" check>
                Enable
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mtu">MTU</Label>
              <Input
                id="mtu"
                type="number"
                value={formData.mtu}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mru">MRU</Label>
              <Input
                id="mru"
                type="number"
                value={formData.mru}
                onChange={handleChange}
              />
            </FormGroup>
             <FormGroup>
              <Label for="dnsservers">DNS Servers</Label>
              <Input
                id="dnsservers"
                type="text"
                value={formData.dnsServers}
                onChange={handleChange}
                disabled
              />
            </FormGroup>
            <FormGroup check className="mb-3">
              <Input
                id="usePeerDns"
                type="checkbox"
                checked={formData.usePeerDns}
                onChange={handleChange}
              />
              <Label for="usePeerDns" check>
                Use Peer DNS
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                id="status"
                type="text"
                value={device?.vRouter?.state === "stopped" ? "Disconnected" : "Connected"}
                onChange={handleChange}
                disabled
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={handleUpdateIfaceValue}
              disabled={!isUpdateEnabled}
            >
              Update
            </Button>{" "}
            <Button color="secondary" onClick={() => setIfaceModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

         {/* ✅ Add VLAN Modal */}
        <Modal isOpen={addModalOpen} toggle={() => setAddModalOpen(!addModalOpen)}>
          <ModalHeader toggle={() => setAddModalOpen(false)}>
            Add VLAN Interface
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="parentInterface">Parent Interface</Label>
              <Input
                type="select"
                id="parentInterface"
                value={addForm.parentInterface}
                onChange={handleAddChange}
                invalid={!!addErrors.parentInterface}
              >
                <option value="">Select Parent Interface</option>
                {tableData.map((iface, idx) => (
                  <option key={idx} value={iface.name}>
                    {iface.name} - {iface.IPv4}
                  </option>
                ))}
              </Input>
              {addErrors.parentInterface && (
                <FormFeedback>{addErrors.parentInterface}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="vlanTag">VLAN Tag</Label>
              <Input
                type="number"
                id="vlanTag"
                value={addForm.vlanTag}
                onChange={handleAddChange}
                invalid={!!addErrors.vlanTag}
                placeholder="Enter VLAN Tag (>=1)"
              />
              {addErrors.vlanTag && (
                <FormFeedback>{addErrors.vlanTag}</FormFeedback>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSaveAdd}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default Interfaces;
