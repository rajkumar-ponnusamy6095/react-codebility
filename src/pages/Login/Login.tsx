import {
  useState,
} from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  login as loginApi,
} from "../../services/authService";

import {
  loginSchema,
  type LoginFormData,
} from "./login.schema";

import PlainNavBar from "../../components/PlainNavBar/PlainNavBar";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");

    try {
      const response = await loginApi(
        data.username,
        data.password
      );

      login(response);

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <>
      <PlainNavBar />

      {/* Login Form */}
      <Container
        fluid
        className="login-page__content"
      >
        <Row className="h-100 justify-content-center align-items-center">
          <Col
            xs={11}
            sm={8}
            md={6}
            lg={4}
            xl={3}
          >
            <Card className="auth-card shadow">
              <Card.Body className="p-4">

                {/* Header */}
                <div className="text-center mb-4">
                  <h2>Welcome Back</h2>

                  <p className="text-muted">
                    Please login to continue
                  </p>
                </div>

                {/* API Error */}
                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}

                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >

                  {/* Username */}
                  <Form.Group
                    className="mb-3"
                    controlId="username"
                  >
                    <Form.Label>
                      Username
                    </Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      {...register("username")}
                      isInvalid={!!errors.username}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group
                    className="mb-3"
                    controlId="password"
                  >
                    <Form.Label>
                      Password
                    </Form.Label>

                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      {...register("password")}
                      isInvalid={!!errors.password}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="app-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Logging in..."
                      : "Login"}
                  </Button>

                </Form>

                {/* Registration Link */}
                <div className="text-center mt-4">
                  <span className="text-muted">
                    Don't have an account?{" "}
                  </span>

                  <Link to="/register">
                    Create an account
                  </Link>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}