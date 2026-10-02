import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PlainNavBar from "../../components/PlainNavBar/PlainNavBar";
import {
  resetPassword as resetPasswordApi,
  validatePasswordResetToken,
} from "../../services/authService";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type TokenStatus = "validating" | "ready" | "invalid" | "success";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const validationStarted = useRef<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(
    token ? "validating" : "invalid",
  );
  const [error, setError] = useState(
    token ? "" : "The password reset link is missing its token.",
  );
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!token || validationStarted.current === token) {
      return;
    }
    validationStarted.current = token;

    const validateToken = async () => {
      try {
        await validatePasswordResetToken(token);
        setTokenStatus("ready");
      } catch (validationError) {
        setError(
          validationError instanceof Error
            ? validationError.message
            : "Unable to validate the password reset link",
        );
        setTokenStatus("invalid");
      }
    };

    void validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await resetPasswordApi(
        token,
        data.password,
        data.confirmPassword,
      );
      setSuccessMessage(response.message);
      setTokenStatus("success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset your password",
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
                  <h2>Reset Password</h2>
                  <p className="text-muted">
                    Choose a new password for your account.
                  </p>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    dismissible={tokenStatus !== "invalid"}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}

                {tokenStatus === "validating" && (
                  <p className="text-center text-muted" role="status">
                    Validating your password reset link...
                  </p>
                )}

                {tokenStatus === "ready" && (
                  <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>New password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        {...register("password")}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm new password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="app-primary w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                  </Form>
                )}

                {tokenStatus === "invalid" && (
                  <div className="text-center">
                    <Link to="/forgot-password">Request a new reset link</Link>
                  </div>
                )}

                {tokenStatus === "success" && (
                  <Alert variant="success">{successMessage}</Alert>
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
