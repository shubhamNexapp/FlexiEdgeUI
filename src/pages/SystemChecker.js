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
} from "reactstrap";
import Breadcrumbs from "../components/Breadcrumb";
import { getData, putData } from "../helpers/api"; // your helpers

const SystemChecker = () => {
  document.title = "System Checker | Minia";

  const [loading, setLoading] = useState(true);
  const [systemCheckers, setSystemCheckers] = useState([]); // initial list
  const [tableData, setTableData] = useState([]); // live table data
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);

  // Fetch checkers once
  useEffect(() => {
    const fetchCheckers = async () => {
      try {
        const response = await getData("systemcheckers");
        setSystemCheckers(response);
      } catch (err) {
        console.error("Error fetching system checkers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckers();
  }, []);

  // Run checkers with or without autofix
  const handleRun = async (autoFix = false) => {
    if (systemCheckers.length === 0) return;

    if (autoFix) {
      setIsAutoFixing(true);
    } else {
      setIsRunning(true);
    }

    // reset table before starting run
    setTableData(systemCheckers.map(item => ({ ...item, result: "Pending" })));

    try {
      // Run all in parallel
      systemCheckers.forEach(async (checker) => {
        const apiUrl = `/systemcheckers/${checker.name}`;
        try {
          const payload = { autoFix };
          const result = await putData(apiUrl, payload);

          // Update row as soon as each response comes
          setTableData((prev) =>
            prev.map((row) =>
              row.name === checker.name
                ? { ...row, result: result.status || "completed" }
                : row
            )
          );
        } catch (err) {
          console.error(`Error running ${checker.name}:`, err);
          setTableData((prev) =>
            prev.map((row) =>
              row.name === checker.name
                ? { ...row, result: "error" }
                : row
            )
          );
        }
      });

      if (!autoFix) setAutoFixEnabled(true);
    } catch (err) {
      console.error("Error executing checkers:", err);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setIsAutoFixing(false);
      }, 500);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Home" breadcrumbItem="System Checker" />

        <Row className="mb-3">
          <Col>
            <Button
              color="success"
              onClick={() => handleRun(false)}
              disabled={isRunning || isAutoFixing}
            >
              {isRunning ? "Running..." : "Run"}
            </Button>
            <Button
              color="warning"
              className="ms-2"
              disabled={!autoFixEnabled || isRunning || isAutoFixing}
              onClick={() => handleRun(true)}
            >
              {isAutoFixing ? "Running Auto-Fix..." : "Auto-Fix"}
            </Button>
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
                  <th>Category</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((checker, index) => (
                    <tr key={index}>
                      <td>{checker.category}</td>
                      <td>{checker.description}</td>
                      <td>{checker.severity}</td>
                      <td>
                        <Badge
                          color={
                            checker.result === "completed"
                              ? "success"
                              : checker.result === "error"
                              ? "danger"
                              : checker.result === "Pending"
                              ? "secondary"
                              : "info"
                          }
                        >
                          {checker.result}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Click Run or Auto-Fix to see results
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SystemChecker;
