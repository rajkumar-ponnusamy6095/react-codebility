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
  registrationSchema,
  type RegistrationFormData,
} from "./registration.schema";

import { DEPARTMENTS, GENDERS } from "../Users/user.schema";
import { registerAccount } from "../../services/registrationService";
import PlainNavBar from "../../components/PlainNavBar/PlainNavBar";
import "./Registration.css";

export default function Registration() {
  const navigate = useNavigate();
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

  const onSubmit = async (data: RegistrationFormData) => {
    setError("");

    try {
      await registerAccount(data);
      const name = `${data.firstName} ${data.lastName}`.trim();
      navigate("/login", {
        replace: true,
        state: {
          registrationNotification: `User "${name}" registered successfully. Please check your email and verify your account.`,
        },
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    }
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

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          {...register("gender")}
                          isInvalid={!!errors.gender}
                        >
                          <option value="">Select a gender</option>
                          {GENDERS.map((gender) => (
                            <option key={gender} value={gender}>
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter phone number"
                          {...register("phone")}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="department">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      {...register("department")}
                      isInvalid={!!errors.department}
                    >
                      <option value="">Select a department</option>
                      {DEPARTMENTS.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.department?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          autoComplete="new-password"
                          {...register("password")}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          autoComplete="new-password"
                          {...register("confirmPassword")}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="acceptTerms">
                    <Form.Check
                      type="checkbox"
                      label="I accept the terms and conditions"
                      {...register("acceptTerms")}
                      isInvalid={!!errors.acceptTerms}
                      feedback={errors.acceptTerms?.message}
                      feedbackType="invalid"
                    />
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