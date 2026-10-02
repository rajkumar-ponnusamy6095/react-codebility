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
} from "react-router";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  registrationSchema,
  type RegistrationFormData,
} from "./registration.schema";

import PlainNavBar from "../../components/PlainNavBar/PlainNavBar";
import "./Registration.css";

export default function Registration() {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const onSubmit = () => {
    setError("Self-service registration is not supported by the available API.");
  };

  return (
    <>
      <PlainNavBar />

      {/* Registration Form */}
      <Container
        fluid
        className="registration-page__content py-5"
      >
        <Row className="justify-content-center">
          <Col
            xs={11}
            sm={10}
            md={8}
            lg={6}
            xl={5}
          >
            <Card className="auth-card shadow">
              <Card.Body className="p-4">

                {/* Header */}
                <div className="text-center mb-4">
                  <h2>Create Account</h2>

                  <p className="text-muted">
                    Register to get started
                  </p>
                </div>

                {/* Registration Error */}
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

                  {/* First Name / Last Name */}
                  <Row>

                    {/* First Name */}
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="firstName"
                      >
                        <Form.Label>
                          First Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="Enter first name"
                          {...register("firstName")}
                          isInvalid={
                            !!errors.firstName
                          }
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.firstName?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Last Name */}
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="lastName"
                      >
                        <Form.Label>
                          Last Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="Enter last name"
                          {...register("lastName")}
                          isInvalid={
                            !!errors.lastName
                          }
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.lastName?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                  </Row>

                  {/* Email */}
                  <Form.Group
                    className="mb-3"
                    controlId="email"
                  >
                    <Form.Label>
                      Email Address
                    </Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      {...register("email")}
                      isInvalid={!!errors.email}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Mobile Number */}
                  <Form.Group
                    className="mb-3"
                    controlId="mobileNumber"
                  >
                    <Form.Label>
                      Mobile Number
                    </Form.Label>

                    <Form.Control
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      {...register("mobileNumber")}
                      isInvalid={
                        !!errors.mobileNumber
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.mobileNumber?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Address */}
                  <Form.Group
                    className="mb-3"
                    controlId="address"
                  >
                    <Form.Label>
                      Address
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter your address"
                      {...register("address")}
                      isInvalid={!!errors.address}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.address?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Register Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="app-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Creating Account..."
                      : "Register"}
                  </Button>

                </Form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an account?{" "}
                  </span>

                  <Link to="/login">
                    Login
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