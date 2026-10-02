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

import { createUser, getUsers, updateUser } from "../../services/userService";
import { userSchema, type UserFormData } from "./user.schema";
import type { User } from "./user.types";

import "./Users.css";

const initialFormData: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  role: "USER",
  status: "ACTIVE",
};

export default function UserForm() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditing = userId !== undefined;
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
        const id = Number(userId);
        if (!Number.isSafeInteger(id) || id <= 0) {
          throw new Error("User not found");
        }

        const users = await getUsers();
        const user = users.find((entry) => entry.id === id);
        if (!user) {
          throw new Error("User not found");
        }

        if (isActive) {
          setEditingUser(user);
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
            status: user.status,
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
    try {
      setFormError("");
      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser(data);
      }
      navigate("/users");
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
                  <Form.Group className="mb-3" controlId="user-first-name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("firstName")}
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-last-name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("lastName")}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
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

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="user-mobile-number">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      {...register("mobileNumber")}
                      isInvalid={!!errors.mobileNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobileNumber?.message}
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
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
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
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
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
