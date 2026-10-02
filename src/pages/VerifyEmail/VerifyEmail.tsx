import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router";
import PlainNavBar from "../../components/PlainNavBar/PlainNavBar";
import { verifyEmail } from "../../services/authService";

type VerificationStatus = "verifying" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const verificationStarted = useRef<string | null>(null);
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "verifying" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "The email verification link is missing its token.",
  );

  useEffect(() => {
    if (!token || verificationStarted.current === token) {
      return;
    }
    verificationStarted.current = token;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setMessage(response.message);
        setStatus("success");
      } catch (verificationError) {
        setMessage(
          verificationError instanceof Error
            ? verificationError.message
            : "Unable to verify your email",
        );
        setStatus("error");
      }
    };

    void verify();
  }, [token]);

  return (
    <>
      <PlainNavBar />
      <Container fluid className="login-page__content">
        <Row className="h-100 justify-content-center align-items-center">
          <Col xs={11} sm={8} md={6} lg={4} xl={3}>
            <Card className="auth-card shadow">
              <Card.Body className="p-4 text-center">
                <h2 className="mb-3">Verify Email</h2>

                {status === "verifying" && (
                  <p className="text-muted" role="status">
                    Verifying your email address...
                  </p>
                )}

                {status === "error" && (
                  <Alert variant="danger">{message}</Alert>
                )}

                {status === "success" && (
                  <Alert variant="success">{message}</Alert>
                )}

                {status !== "verifying" && (
                  <Link to="/login">Continue to login</Link>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
