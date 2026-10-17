import { useEffect, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router';
import { getUsers } from '../../../users/services/userService';
import './Dashboard.css';

interface Overview {
  total: number;
  active: number;
  admins: number;
}

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const [allUsers, activeUsers, adminUsers] = await Promise.all([
        getUsers({ page: 1, limit: 1 }),
        getUsers({ page: 1, limit: 1, status: 'active' }),
        getUsers({ page: 1, limit: 1, role: 'admin' }),
      ]);
      setOverview({
        total: allUsers.pagination.total,
        active: activeUsers.pagination.total,
        admins: adminUsers.pagination.total,
      });
    } catch (loadError) {
      setOverview(null);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load the dashboard overview.'
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOverview();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const stats = [
    [
      'Total users',
      'Accounts in your workspace',
      'bi-people-fill',
      'primary',
      overview?.total,
    ],
    [
      'Active users',
      'Ready to access the app',
      'bi-person-check-fill',
      'success',
      overview?.active,
    ],
    [
      'Administrators',
      'Users with admin access',
      'bi-person-gear',
      'accent',
      overview?.admins,
    ],
  ] as const;
  return (
    <section className="dashboard-page-content">
      <header className="dashboard-hero">
        <div className="dashboard-hero__content">
          <span className="dashboard-eyebrow">WORKSPACE OVERVIEW</span>
          <h1>Welcome to your dashboard</h1>
          <p>Keep your people and workspace moving in the right direction.</p>
          <Link to="/users" className="btn app-primary dashboard-hero__button">
            <i className="bi bi-people me-2" aria-hidden="true" />
            Manage users
          </Link>
        </div>
        <div className="dashboard-hero__art" aria-hidden="true">
          <span className="dashboard-orbit dashboard-orbit--outer" />
          <span className="dashboard-orbit dashboard-orbit--inner" />
          <span className="dashboard-hero__icon">
            <i className="bi bi-grid-1x2-fill" />
          </span>
          <span className="dashboard-spark dashboard-spark--one" />
          <span className="dashboard-spark dashboard-spark--two" />
        </div>
      </header>
      {error && (
        <Alert variant="danger" className="dashboard-alert" role="alert">
          <span>{error}</span>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => void loadOverview()}
          >
            Try again
          </Button>
        </Alert>
      )}
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-eyebrow">AT A GLANCE</span>
          <h2>People overview</h2>
        </div>
        <span className="dashboard-updated">
          <i className="bi bi-shield-check me-1" aria-hidden="true" />
          Live account data
        </span>
      </div>
      <div className="dashboard-stats">
        {stats.map(([label, detail, icon, tone, value]) => (
          <article className="dashboard-stat-card" key={label}>
            <div
              className={`dashboard-stat-card__icon dashboard-stat-card__icon--${tone}`}
            >
              <i className={`bi ${icon}`} aria-hidden="true" />
            </div>
            <p>{label}</p>
            {loading ? (
              <span
                className="dashboard-stat-card__value dashboard-skeleton"
                aria-label="Loading"
              />
            ) : (
              <strong className="dashboard-stat-card__value">
                {value ?? 0}
              </strong>
            )}
            <span className="dashboard-stat-card__detail">{detail}</span>
          </article>
        ))}
      </div>
      <div className="dashboard-lower-grid">
        <section className="dashboard-panel dashboard-quick-actions">
          <div className="dashboard-panel__heading">
            <div>
              <span className="dashboard-eyebrow">GET STARTED</span>
              <h2>Quick actions</h2>
            </div>
            <span className="dashboard-panel__heading-icon">
              <i className="bi bi-lightning-charge-fill" aria-hidden="true" />
            </span>
          </div>
          <Link className="dashboard-action" to="/users/create">
            <span className="dashboard-action__icon">
              <i className="bi bi-person-plus-fill" aria-hidden="true" />
            </span>
            <span className="dashboard-action__copy">
              <strong>Add a user</strong>
              <small>Invite someone to your workspace</small>
            </span>
            <i
              className="bi bi-arrow-up-right dashboard-action__arrow"
              aria-hidden="true"
            />
          </Link>
          <Link className="dashboard-action" to="/users">
            <span className="dashboard-action__icon">
              <i className="bi bi-person-lines-fill" aria-hidden="true" />
            </span>
            <span className="dashboard-action__copy">
              <strong>Browse users</strong>
              <small>Search and manage user accounts</small>
            </span>
            <i
              className="bi bi-arrow-up-right dashboard-action__arrow"
              aria-hidden="true"
            />
          </Link>
        </section>
        <section className="dashboard-panel dashboard-tip">
          <div className="dashboard-tip__icon">
            <i className="bi bi-stars" aria-hidden="true" />
          </div>
          <span className="dashboard-eyebrow">A TIP FOR ADMINS</span>
          <h2>A well-organized team starts here.</h2>
          <p>
            Keep user details, roles, and account status up to date from one
            place.
          </p>
          <Link to="/users" className="dashboard-tip__link">
            Go to user management{' '}
            <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
          </Link>
        </section>
      </div>
      {loading && (
        <Spinner className="visually-hidden" aria-label="Loading dashboard" />
      )}
    </section>
  );
}
