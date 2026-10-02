import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import isNil from "lodash/isNil";

import { createUser, getUser, updateUser } from "../../services/userService";
import {
  DEPARTMENTS,
  userSchema,
  type UserFormData,
} from "./user.schema";
import type { User } from "./user.types";

import "./Users.css";

const initialFormData: Omit<UserFormData, "department"> = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  status: "active",
};

export default function UserForm() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditing = !isNil(userId);
  const [loading, setLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialFormData,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    let isActive = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        setLoadError("");
        if (isNil(userId)) {
          throw new Error("A user ID is required to edit a user.");
        }

        const id = Number(userId);
        if (!Number.isSafeInteger(id) || id <= 0) {
          throw new Error("User not found");
        }

        const user = await getUser(id);

        if (isActive) {
          const department = DEPARTMENTS.find(
            (option) => option === user.department,
          );
          setEditingUser(user);
          reset({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            ...(department === undefined ? {} : { department }),
          });
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load user",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isActive = false;
    };
  }, [isEditing, reset, userId]);

  const handleSave = async (data: UserFormData) => {
    if (isEditing && isNil(editingUser)) {
      setFormError("The user to update is unavailable. Please reload the page.");
      return;
    }

    try {
      setFormError("");
      const action = editingUser ? "updated" : "created";
      const savedUser = editingUser
        ? await updateUser(editingUser.id, data)
        : await createUser(data);
      navigate("/users", {
        state: {
          userNotification: `User "${savedUser.name}" ${action} successfully.`,
        },
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to save user",
      );
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>{isEditing ? "Edit User" : "Add User"}</h1>
          <p>{isEditing ? "Update user details" : "Create a new user"}</p>
        </div>
      </div>

      {loadError && (
        <Alert variant="danger" role="alert">
          {loadError}
        </Alert>
      )}

      {loading ? (
        <div className="users-loading" role="status">
          <Spinner animation="border" size="sm" />
          <span>Loading user...</span>
        </div>
      ) : !loadError ? (
        <Card className="users-card">
          <Card.Body>
            {formError && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setFormError("")}
              >
                {formError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(handleSave)} noValidate>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("name")}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...register("email")}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit phone number"
                      {...register("phone")}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-department">
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
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-role">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      {...register("role")}
                      isInvalid={!!errors.role}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.role?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4" controlId="user-status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      {...register("status")}
                      isInvalid={!!errors.status}
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.status?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/users")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="app-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating User..."
                      : "Creating User..."
                    : isEditing
                      ? "Update User"
                      : "Create User"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Button variant="secondary" onClick={() => navigate("/users")}>
          Back to Users
        </Button>
      )}
    </div>
  );
}
