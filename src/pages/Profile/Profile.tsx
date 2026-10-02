import { useEffect, useState } from "react";
import isNil from "lodash/isNil";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuth } from "../../context/AuthContext";
import { getUser, updateUser } from "../../services/userService";
import type { User } from "../Users/user.types";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "../Users/user.schema";

import "./Profile.css";

export default function Profile() {
  const { user: authUser, updateUserName } = useAuth();
  const authUserId = isNil(authUser) ? undefined : authUser.id;
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (
        isNil(authUserId) ||
        !Number.isSafeInteger(authUserId) ||
        authUserId <= 0
      ) {
        setLoadError(
          "Your profile could not be loaded because your account ID is missing.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");
        const loadedProfile = await getUser(authUserId);

        if (isActive) {
          setProfile(loadedProfile);
          updateUserName(loadedProfile.name);
          reset({
            name: loadedProfile.name,
            phone: loadedProfile.phone,
            department: loadedProfile.department,
          });
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load profile",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [authUserId, reset, updateUserName]);

  const handleSave = async (data: UserProfileFormData) => {
    if (isNil(profile)) {
      setLoadError("Your profile is unavailable. Please reload the page.");
      return;
    }

    try {
      setFormError("");
      setSaveSuccess("");
      const updatedProfile = await updateUser(profile.id, {
        name: data.name,
        email: profile.email,
        phone: data.phone,
        department: data.department,
        role: profile.role,
        status: profile.status,
      });
      setProfile(updatedProfile);
      updateUserName(updatedProfile.name);
      reset({
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        department: updatedProfile.department,
      });
      setSaveSuccess("Your profile has been updated.");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View and update your account details.</p>
      </div>

      {loadError && (
        <Alert variant="danger" role="alert">
          {loadError}
        </Alert>
      )}

      {loading ? (
        <div className="profile-loading" role="status">
          <Spinner animation="border" size="sm" />
          <span>Loading profile...</span>
        </div>
      ) : profile ? (
        <Card className="profile-card">
          <Card.Body>
            {formError && (
              <Alert
                variant="danger"
                role="alert"
                dismissible
                onClose={() => setFormError("")}
              >
                {formError}
              </Alert>
            )}
            {saveSuccess && (
              <Alert
                variant="success"
                role="status"
                dismissible
                onClose={() => setSaveSuccess("")}
              >
                {saveSuccess}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(handleSave)} noValidate>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profile-name">
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
                  <Form.Group className="mb-3" controlId="profile-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profile.email}
                      readOnly
                      aria-describedby="profile-email-help"
                    />
                    <Form.Text id="profile-email-help">
                      Email addresses cannot be changed here.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profile-phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      maxLength={10}
                      {...register("phone")}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profile-department">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("department")}
                      isInvalid={!!errors.department}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.department?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="profile-role">
                    <Form.Label>Role</Form.Label>
                    <Form.Control value={profile.role} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="profile-status">
                    <Form.Label>Status</Form.Label>
                    <Form.Control value={profile.status} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button
                  type="submit"
                  className="app-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : null}
    </div>
  );
}
