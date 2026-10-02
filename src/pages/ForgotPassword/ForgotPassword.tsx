import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PlainNavBar from "../../components/PlainNavBar/PlainNavBar";
import { requestPasswordReset } from "../../services/authService";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await requestPasswordReset(data.email);
      setSuccessMessage(response.message);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to request a password reset",
      );
    }
  };

  return (
    <>
      <PlainNavBar />
      <Container fluid className="login-page__content">
        <Row className="h-100 justify-content-center align-items-center">
          <Col xs={11} sm={8} md={6} lg={4} xl={3}>
            <Card className="auth-card shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2>Forgot Password</h2>
                  <p className="text-muted">
                    Enter your email and we’ll send you password reset
                    instructions.
                  </p>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}

                {successMessage ? (
                  <Alert variant="success" className="mb-4">
                    {successMessage}
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        autoComplete="email"
                        {...register("email")}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="app-primary w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                    </Button>
                  </Form>
                )}

                <div className="text-center mt-4">
                  <Link to="/login">Back to login</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
