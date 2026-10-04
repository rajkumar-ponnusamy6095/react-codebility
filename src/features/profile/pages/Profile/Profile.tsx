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
import { z } from "zod";

import NotificationToast from "../../../../components/NotificationToast/NotificationToast";
import { useAuth } from "../../../../context/AuthContext";
import { changePassword } from "../../../auth/services/authService";
import { getUser, updateUser } from "../../../users/services/userService";
import type { User } from "../../../users/types/user.types";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "../../../users/pages/Users/user.schema";

import "./Profile.css";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function Profile() {
  const { user: authUser, updateUserName } = useAuth();
  const authUserId = isNil(authUser) ? undefined : authUser.id;
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: "onBlur",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: {
      errors: passwordErrors,
      isSubmitting: isChangingPassword,
    },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (isNil(authUserId) || !authUserId.trim()) {
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
          updateUserName(
            loadedProfile.name,
            loadedProfile.firstName,
            loadedProfile.lastName,
          );
          reset({
            firstName: loadedProfile.firstName,
            lastName: loadedProfile.lastName,
            gender: loadedProfile.gender.toLowerCase() as UserProfileFormData["gender"],
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
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        email: profile.email,
        phone: data.phone,
        department: data.department,
        role: profile.role,
        status: profile.status,
      });
      setProfile(updatedProfile);
      updateUserName(
        updatedProfile.name,
        updatedProfile.firstName,
        updatedProfile.lastName,
      );
      reset({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        gender: updatedProfile.gender.toLowerCase() as UserProfileFormData["gender"],
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

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setPasswordError("");
    setPasswordChanged(false);

    try {
      await changePassword(
        data.oldPassword,
        data.newPassword,
        data.confirmPassword,
      );
      resetPasswordForm();
      setPasswordChanged(true);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to change password",
      );
    }
  };

  return (
    <div className="profile-page">
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
        <Row className="g-4">
          <Col lg={6}>
            <div className="profile-header">
              <h1>My Profile</h1>
              <p>View and update your account details.</p>
            </div>

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
                  <Form.Group className="mb-3" controlId="profile-first-name">
                    <Form.Label>First name</Form.Label>
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
                  <Form.Group className="mb-3" controlId="profile-last-name">
                    <Form.Label>Last name</Form.Label>
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

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profile-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profile.email}
                      readOnly
                      className="disabled"
                      aria-describedby="profile-email-help"
                    />
                    <Form.Text id="profile-email-help">
                      Email addresses cannot be changed here.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profile-gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      {...register("gender")}
                      isInvalid={!!errors.gender}
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.gender?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profile-phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      maxLength={20}
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
          </Col>

          <Col lg={6}>
            <div className="profile-header">
              <h2>Change Password</h2>
              <p>Update the password you use to sign in.</p>
            </div>

            <Card className="profile-card">
              <Card.Body>
              {passwordError && (
                <Alert
                  variant="danger"
                  role="alert"
                  dismissible
                  onClose={() => setPasswordError("")}
                >
                  {passwordError}
                </Alert>
              )}

              <Form
                onSubmit={handlePasswordSubmit(handleChangePassword)}
                noValidate
              >
                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId="profile-old-password"
                    >
                      <Form.Label>Old password</Form.Label>
                      <Form.Control
                        type="password"
                        autoComplete="current-password"
                        {...registerPassword("oldPassword")}
                        isInvalid={!!passwordErrors.oldPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.oldPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId="profile-new-password"
                    >
                      <Form.Label>New password</Form.Label>
                      <Form.Control
                        type="password"
                        autoComplete="new-password"
                        {...registerPassword("newPassword")}
                        isInvalid={!!passwordErrors.newPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.newPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      className="mb-4"
                      controlId="profile-confirm-password"
                    >
                      <Form.Label>Confirm password</Form.Label>
                      <Form.Control
                        type="password"
                        autoComplete="new-password"
                        {...registerPassword("confirmPassword")}
                        isInvalid={!!passwordErrors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    className="app-primary"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Updating..." : "Change password"}
                  </Button>
                </div>
              </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : null}

      {passwordChanged && (
        <NotificationToast
          message="Password has been changed successfully"
          onClose={() => setPasswordChanged(false)}
        />
      )}
    </div>
  );
}
