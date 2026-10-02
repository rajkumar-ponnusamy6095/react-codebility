import {
  Container,
  Row,
  Col,
  Card,
  Table,
} from "react-bootstrap";

import { useAuth } from "../../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();

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
                  {user?.username}
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

            <Table
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>admin</td>
                  <td>ADMIN</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>user</td>
                  <td>USER</td>
                </tr>
              </tbody>

            </Table>

          </Card.Body>

        </Card>

    </Container>
  );
}