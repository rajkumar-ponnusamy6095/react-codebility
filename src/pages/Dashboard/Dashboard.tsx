import {
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";

import "./Dashboard.css";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  description: string;
  icon: string;
}

const stats: StatCard[] = [
  {
    title: "Budget",
    value: "$24k",
    change: "12%",
    changeType: "positive",
    description: "Since last month",
    icon: "bi-currency-dollar",
  },
  {
    title: "Total Customers",
    value: "1.6k",
    change: "16%",
    changeType: "negative",
    description: "Since last month",
    icon: "bi-people-fill",
  },
  {
    title: "Task Progress",
    value: "75.5%",
    change: "",
    changeType: "positive",
    description: "",
    icon: "bi-list-check",
  },
  {
    title: "Total Profit",
    value: "$15k",
    change: "",
    changeType: "positive",
    description: "",
    icon: "bi-cash-stack",
  },
];

const salesData = [
  { month: "Jan", value1: 18, value2: 12 },
  { month: "Feb", value1: 16, value2: 11 },
  { month: "Mar", value1: 5, value2: 4 },
  { month: "Apr", value1: 8, value2: 6 },
  { month: "May", value1: 3, value2: 2 },
  { month: "Jun", value1: 14, value2: 9 },
  { month: "Jul", value1: 14, value2: 9 },
  { month: "Aug", value1: 16, value2: 10 },
  { month: "Sep", value1: 17, value2: 11 },
  { month: "Oct", value1: 19, value2: 12 },
  { month: "Nov", value1: 18, value2: 13 },
  { month: "Dec", value1: 20, value2: 13 },
];

const trafficData = [
  {
    label: "Desktop",
    percentage: 63,
    className: "traffic-desktop",
  },
  {
    label: "Tablet",
    percentage: 15,
    className: "traffic-tablet",
  },
  {
    label: "Phone",
    percentage: 22,
    className: "traffic-phone",
  },
];

export default function Dashboard() {
  return (
    <Container fluid className="dashboard-container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1>Overview</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        {/* Statistics */}
        <Row className="g-3 mb-4">
          {stats.map((stat) => (
            <Col
              key={stat.title}
              xs={12}
              sm={6}
              xl={3}
            >
              <Card className="dashboard-card stat-card h-100">
                <Card.Body>
                  <div className="stat-card-header">
                    <div>
                      <div className="stat-title">
                        {stat.title}
                      </div>

                      <div className="stat-value">
                        {stat.value}
                      </div>
                    </div>

                    <div className="stat-icon">
                      <i className={`bi ${stat.icon}`} aria-hidden="true" />
                    </div>
                  </div>

                  {stat.title === "Task Progress" ? (
                    <div className="task-progress">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: stat.value,
                          }}
                        />
                      </div>
                    </div>
                  ) : stat.change ? (
                    <div className="stat-footer">
                      <span
                        className={
                          stat.changeType === "positive"
                            ? "change-positive"
                            : "change-negative"
                        }
                      >
                        <i
                          className={`bi ${
                            stat.changeType === "positive"
                              ? "bi-arrow-up"
                              : "bi-arrow-down"
                          }`}
                          aria-hidden="true"
                        />{" "}
                        {stat.change}
                      </span>

                      <span className="change-description">
                        {stat.description}
                      </span>
                    </div>
                  ) : (
                    <div className="stat-footer">
                      <span className="change-description">
                        This month
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Row className="g-3">

          {/* Sales */}
          <Col xs={12} xl={8}>
            <Card className="dashboard-card chart-card h-100">
              <Card.Body>

                <div className="chart-header">
                  <div>
                    <h5>Sales</h5>
                    <span>
                      Monthly sales overview
                    </span>
                  </div>

                  <button
                    type="button"
                    className="sync-button"
                  >
                    <i className="bi bi-arrow-repeat me-1" aria-hidden="true" />
                    <span>Sync</span>
                  </button>
                </div>

                <div className="sales-chart">

                  {/* Y Axis */}
                  <div className="chart-y-axis">
                    <span>20K</span>
                    <span>15K</span>
                    <span>10K</span>
                    <span>5K</span>
                    <span>0</span>
                  </div>

                  {/* Chart */}
                  <div className="chart-area">

                    <div className="chart-grid">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="bars">
                      {salesData.map((item) => (
                        <div
                          className="bar-group"
                          key={item.month}
                        >
                          <div className="bar-wrapper">

                            <div
                              className="bar bar-primary"
                              style={{
                                height: `${item.value1 * 5}%`,
                              }}
                            />

                            <div
                              className="bar bar-secondary"
                              style={{
                                height: `${item.value2 * 5}%`,
                              }}
                            />

                          </div>

                          <span className="bar-label">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </Card.Body>
            </Card>
          </Col>

          {/* Traffic */}
          <Col xs={12} xl={4}>
            <Card className="dashboard-card traffic-card h-100">
              <Card.Body>

                <div className="chart-header">
                  <div>
                    <h5>Traffic Source</h5>
                    <span>
                      Visitors by device
                    </span>
                  </div>
                </div>

                <div className="traffic-chart">

                  <div className="donut-chart">
                    <div className="donut-hole">
                      <strong>1.6k</strong>
                      <span>Visitors</span>
                    </div>
                  </div>

                </div>

                <div className="traffic-legend">
                  {trafficData.map((item) => (
                    <div
                      className="traffic-item"
                      key={item.label}
                    >
                      <div
                        className={`traffic-icon ${item.className}`}
                      >
                        <i
                          className={`bi ${
                            item.label === "Desktop"
                              ? "bi-pc-display"
                              : item.label === "Tablet"
                                ? "bi-tablet"
                                : "bi-phone"
                          }`}
                          aria-hidden="true"
                        />
                      </div>

                      <strong>
                        {item.label}
                      </strong>

                      <span>
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>

              </Card.Body>
            </Card>
          </Col>

        </Row>
    </Container>
  );
}