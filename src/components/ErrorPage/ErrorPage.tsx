import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import PlainNavBar from "../PlainNavBar/PlainNavBar";
import "./ErrorPage.css";

interface ErrorPageProps {
  code: number;
  title: string;
  message: string;
  buttonText: string;
  buttonPath: string;
  retryButtonText?: string;
}

export default function ErrorPage({
  code,
  title,
  message,
  buttonText,
  buttonPath,
  retryButtonText,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <>
      <PlainNavBar />
      <Container fluid className="error-page__content">
        <Row className="error-page__row justify-content-center align-items-center">
          <Col xs={11} sm={8} md={6} lg={4}>
            <Card className="auth-card text-center shadow">
              <Card.Body className="p-5">
                <h1 className="display-1 fw-bold app-primary-text">{code}</h1>
                <h3>{title}</h3>
                <p className="text-muted">{message}</p>
                <div className="d-flex justify-content-center gap-2">
                  {retryButtonText && (
                    <Button
                      variant="primary"
                      className="app-primary"
                      onClick={() => window.location.reload()}
                    >
                      {retryButtonText}
                    </Button>
                  )}
                  <Button
                    variant={retryButtonText ? "outline-primary" : "primary"}
                    className={retryButtonText ? "app-primary-outline" : "app-primary"}
                    onClick={() => navigate(buttonPath)}
                  >
                    {buttonText}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
