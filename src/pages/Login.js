import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Buffer } from "buffer";


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(""); // admin
  const [password, setPassword] = useState(""); // QWRtaW5AMTIz 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const data = {
        username: email,
        password: Buffer.from(password).toString('base64'),
      };
      const response = await axios.post("http://192.168.1.1:8080/api/login", data);
      onLogin(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Server error, please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader>Login</CardHeader>
            <CardBody>
              {error && <div className="text-danger mb-2">{error}</div>}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" type="submit" block disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Login"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
