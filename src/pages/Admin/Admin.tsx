import { useEffect, useState } from "react";
import {
  Alert,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table,
} from "react-bootstrap";

import { useAuth } from "../../context/AuthContext";
import { getUsers } from "../../services/userService";
import type { User as DirectoryUser } from "../Users/user.types";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError("");
        const response = await getUsers();
        setUsers(response.data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load users",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  return (
    <Container className="py-4">

        <h1 className="mb-4">
          Admin Dashboard
        </h1>

        <Row>

          <Col md={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title>
                  Logged in as
                </Card.Title>

                <Card.Text>
                  {user?.email}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title>
                  Role
                </Card.Title>

                <Card.Text>
                  {user?.role}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        <Card className="shadow-sm">

          <Card.Header>
            Users
          </Card.Header>

          <Card.Body>

            {error && (
              <Alert variant="danger" role="alert">
                {error}
              </Alert>
            )}

            <Table
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">Loading users...</span>
                      </Spinner>
                    </td>
                  </tr>
                ) : (
                  users.map((directoryUser) => (
                    <tr key={directoryUser.id}>
                      <td>{directoryUser.id}</td>
                      <td>{directoryUser.email}</td>
                      <td>{directoryUser.role}</td>
                    </tr>
                  ))
                )}
              </tbody>

            </Table>

          </Card.Body>

        </Card>

    </Container>
  );
}