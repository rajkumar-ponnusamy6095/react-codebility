import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import PlainNavBar from '../PlainNavBar/PlainNavBar';
import './ErrorPage.css';

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
      <main className="error-page">
        <div className="error-page__orb error-page__orb--one" />
        <div className="error-page__orb error-page__orb--two" />
        <section className="error-card" aria-labelledby="error-title">
          <div className="error-card__art" aria-hidden="true">
            <span className="error-card__grid" />
            <span className="error-card__code">{code}</span>
            <span className="error-card__badge">
              <i className="bi bi-stars" />
            </span>
          </div>
          <div className="error-card__copy">
            <span className="error-eyebrow">CODEBILITY / SYSTEM MESSAGE</span>
            <h1 id="error-title">{title}</h1>
            <p>{message}</p>
            <div className="error-card__actions">
              {retryButtonText && (
                <Button
                  className="app-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2" />
                  {retryButtonText}
                </Button>
              )}
              <Button
                className={
                  retryButtonText ? 'app-primary-outline' : 'app-primary'
                }
                onClick={() => navigate(buttonPath)}
              >
                {buttonText}
                <i className="bi bi-arrow-up-right ms-2" />
              </Button>
            </div>
          </div>
        </section>
        <p className="error-page__footer">
          <i className="bi bi-shield-check me-1" /> Your workspace is safe.
          Let’s get you back on track.
        </p>
      </main>
    </>
  );
}
