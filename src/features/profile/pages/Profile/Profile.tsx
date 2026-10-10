import { useEffect, useState } from "react";
import isNil from "lodash/isNil";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import NotificationToast from "../../../../components/NotificationToast/NotificationToast";
import { useAuth } from "../../../../context/AuthContext";
import { changePassword } from "../../../auth/services/authService";
import { getUser, updateUser } from "../../../users/services/userService";
import type { User } from "../../../users/types/user.types";
import { DEPARTMENTS } from "../../../../shared/accountOptions";
import { userProfileSchema, type UserProfileFormData } from "../../../users/pages/Users/user.schema";
import "./Profile.css";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const initialsFor = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
const displayValue = (value: string | undefined, fallback: string) => value?.trim() || fallback;

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
  const [editingProfile, setEditingProfile] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserProfileFormData>({ resolver: zodResolver(userProfileSchema), mode: "onBlur" });
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors, isSubmitting: isChangingPassword } } = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema), mode: "onBlur" });

  useEffect(() => {
    let isActive = true;
    const loadProfile = async () => {
      if (isNil(authUserId) || !authUserId.trim()) { setLoadError("Your profile could not be loaded because your account ID is missing."); setLoading(false); return; }
      try {
        setLoading(true); setLoadError("");
        const loadedProfile = await getUser(authUserId);
        if (isActive) {
          setProfile(loadedProfile);
          updateUserName(loadedProfile.name, loadedProfile.firstName, loadedProfile.lastName);
          reset({ firstName: loadedProfile.firstName, lastName: loadedProfile.lastName, gender: loadedProfile.gender.toLowerCase() as UserProfileFormData["gender"], phone: loadedProfile.phone, department: loadedProfile.department });
        }
      } catch (error) { if (isActive) setLoadError(error instanceof Error ? error.message : "Failed to load profile"); }
      finally { if (isActive) setLoading(false); }
    };
    void loadProfile();
    return () => { isActive = false; };
  }, [authUserId, reloadToken, reset, updateUserName]);

  const handleSave = async (data: UserProfileFormData) => {
    if (isNil(profile)) { setLoadError("Your profile is unavailable. Please reload the page."); return; }
    try {
      setFormError(""); setSaveSuccess("");
      const updatedProfile = await updateUser(profile.id, { firstName: data.firstName, lastName: data.lastName, gender: data.gender, email: profile.email, phone: data.phone, department: data.department, role: profile.role, status: profile.status });
      setProfile(updatedProfile); setEditingProfile(false); setSaveSuccess("Your profile has been updated.");
      updateUserName(updatedProfile.name, updatedProfile.firstName, updatedProfile.lastName);
      reset({ firstName: updatedProfile.firstName, lastName: updatedProfile.lastName, gender: updatedProfile.gender.toLowerCase() as UserProfileFormData["gender"], phone: updatedProfile.phone, department: updatedProfile.department });
    } catch (error) { setFormError(error instanceof Error ? error.message : "Failed to update profile"); }
  };

  const cancelEditing = () => {
    if (!profile) return;
    reset({ firstName: profile.firstName, lastName: profile.lastName, gender: profile.gender.toLowerCase() as UserProfileFormData["gender"], phone: profile.phone, department: profile.department });
    setFormError(""); setEditingProfile(false);
  };

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setPasswordError(""); setPasswordChanged(false);
    try { await changePassword(data.oldPassword, data.newPassword, data.confirmPassword); resetPasswordForm(); setPasswordChanged(true); }
    catch (error) { setPasswordError(error instanceof Error ? error.message : "Failed to change password"); }
  };

  return <div className="profile-page">
    <header className="profile-page-heading"><div><span className="profile-eyebrow">ACCOUNT CENTER</span><h1>Profile &amp; security</h1><p>Manage your personal information and keep your account secure.</p></div><span className="profile-heading-icon" aria-hidden="true"><i className="bi bi-person-gear" /></span></header>
    {loading && <div className="profile-loading" role="status"><Spinner animation="border" size="sm" /><span>Loading your account...</span></div>}
    {!loading && loadError && <div className="profile-load-error" role="alert"><span className="profile-load-error-icon"><i className="bi bi-exclamation-circle" /></span><div><strong>We couldn’t load your profile</strong><p>{loadError}</p><Button size="sm" className="app-primary" onClick={() => setReloadToken((token) => token + 1)}>Try again</Button></div></div>}
    {!loading && !loadError && profile && <>
      <section className="profile-hero"><span className="profile-hero-glow" aria-hidden="true" /><div className="profile-hero-main"><span className="profile-avatar" aria-hidden="true">{initialsFor(profile.name)}</span><div className="profile-hero-copy"><span className="profile-hero-label">YOUR PROFILE</span><h2>{profile.name}</h2><p>{displayValue(profile.department, "Department not set")}</p></div></div><div className="profile-hero-meta"><span className="profile-badge profile-role"><i className="bi bi-shield-check" />{profile.role === "admin" ? "Administrator" : "Team member"}</span><span className={`profile-badge ${profile.isVerified ? "profile-verified" : "profile-unverified"}`}><i className={`bi ${profile.isVerified ? "bi-patch-check-fill" : "bi-exclamation-circle-fill"}`} />{profile.isVerified ? "Email verified" : "Email unverified"}</span></div></section>
      {saveSuccess && <Alert variant="success" className="profile-alert" role="status" dismissible onClose={() => setSaveSuccess("")}><i className="bi bi-check-circle me-2" />{saveSuccess}</Alert>}
      <div className="profile-content-grid"><div className="profile-primary-column">
        <section className="profile-card"><div className="profile-card-heading"><div><span className="profile-section-kicker">PERSONAL DETAILS</span><h2>Profile information</h2><p>Keep your contact details current.</p></div>{!editingProfile && <Button className="profile-edit-button" onClick={() => setEditingProfile(true)}><i className="bi bi-pencil-square" /><span>Edit profile</span></Button>}</div>
          {formError && <Alert variant="danger" className="profile-alert" role="alert">{formError}</Alert>}
          {editingProfile ? <Form onSubmit={handleSubmit(handleSave)} noValidate><div className="profile-form-grid">
            <Form.Group className="profile-field" controlId="profile-first-name"><Form.Label>First name</Form.Label><Form.Control type="text" maxLength={50} autoComplete="given-name" {...register("firstName")} isInvalid={!!errors.firstName} /><Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback></Form.Group>
            <Form.Group className="profile-field" controlId="profile-last-name"><Form.Label>Last name</Form.Label><Form.Control type="text" maxLength={50} autoComplete="family-name" {...register("lastName")} isInvalid={!!errors.lastName} /><Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback></Form.Group>
            <Form.Group className="profile-field" controlId="profile-email"><Form.Label>Email address</Form.Label><Form.Control type="email" value={profile.email} readOnly className="disabled" /><Form.Text>Email addresses cannot be changed here.</Form.Text></Form.Group>
            <Form.Group className="profile-field" controlId="profile-phone"><Form.Label>Phone number</Form.Label><Form.Control type="tel" maxLength={20} autoComplete="tel" {...register("phone")} isInvalid={!!errors.phone} /><Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback></Form.Group>
            <Form.Group className="profile-field" controlId="profile-gender"><Form.Label>Gender</Form.Label><Form.Select {...register("gender")} isInvalid={!!errors.gender}><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></Form.Select><Form.Control.Feedback type="invalid">{errors.gender?.message}</Form.Control.Feedback></Form.Group>
            <Form.Group className="profile-field" controlId="profile-department"><Form.Label>Department</Form.Label><Form.Select {...register("department")} isInvalid={!!errors.department}><option value="">Select a department</option>{DEPARTMENTS.map((department) => <option value={department} key={department}>{department}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.department?.message}</Form.Control.Feedback></Form.Group>
          </div><div className="profile-form-actions"><Button type="button" className="profile-cancel-button" disabled={isSubmitting} onClick={cancelEditing}>Cancel</Button><Button type="submit" className="app-primary profile-save-button" disabled={isSubmitting}>{isSubmitting ? "Saving..." : <><i className="bi bi-check2 me-1" />Save changes</>}</Button></div></Form> : <div className="profile-detail-grid">
            <ProfileDetail icon="bi-person-fill" label="Full name" value={profile.name} /><ProfileDetail icon="bi-envelope-fill" label="Email address" value={profile.email} /><ProfileDetail icon="bi-telephone-fill" label="Phone number" value={displayValue(profile.phone, "Not provided")} /><ProfileDetail icon="bi-building-fill" label="Department" value={displayValue(profile.department, "Not set")} /><ProfileDetail icon="bi-person-lines-fill" label="Gender" value={displayValue(profile.gender, "Not specified")} /><ProfileDetail icon="bi-calendar3" label="Member since" value={new Date(profile.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} />
          </div>}
        </section>
        <section className="profile-card profile-security-card"><div className="profile-card-heading"><div><span className="profile-section-kicker">KEEP YOUR ACCOUNT SAFE</span><h2>Password &amp; security</h2><p>Choose a strong password that you don’t use elsewhere.</p></div><span className="profile-security-icon"><i className="bi bi-shield-lock" /></span></div>{passwordError && <Alert variant="danger" className="profile-alert" role="alert" dismissible onClose={() => setPasswordError("")}>{passwordError}</Alert>}<Form onSubmit={handlePasswordSubmit(handleChangePassword)} noValidate><div className="profile-form-grid"><Form.Group className="profile-field profile-field-wide" controlId="profile-old-password"><Form.Label>Current password</Form.Label><Form.Control type="password" autoComplete="current-password" {...registerPassword("oldPassword")} isInvalid={!!passwordErrors.oldPassword} /><Form.Control.Feedback type="invalid">{passwordErrors.oldPassword?.message}</Form.Control.Feedback></Form.Group><Form.Group className="profile-field" controlId="profile-new-password"><Form.Label>New password</Form.Label><Form.Control type="password" autoComplete="new-password" {...registerPassword("newPassword")} isInvalid={!!passwordErrors.newPassword} /><Form.Control.Feedback type="invalid">{passwordErrors.newPassword?.message}</Form.Control.Feedback><Form.Text>At least 8 characters</Form.Text></Form.Group><Form.Group className="profile-field" controlId="profile-confirm-password"><Form.Label>Confirm new password</Form.Label><Form.Control type="password" autoComplete="new-password" {...registerPassword("confirmPassword")} isInvalid={!!passwordErrors.confirmPassword} /><Form.Control.Feedback type="invalid">{passwordErrors.confirmPassword?.message}</Form.Control.Feedback></Form.Group></div><div className="profile-form-actions"><Button type="submit" className="app-primary profile-save-button" disabled={isChangingPassword}>{isChangingPassword ? "Updating..." : <><i className="bi bi-lock me-1" />Update password</>}</Button></div></Form></section>
      </div><aside className="profile-aside"><section className="profile-card profile-account-card"><div className="profile-aside-heading"><span className="profile-section-kicker">ACCOUNT OVERVIEW</span><i className="bi bi-activity" /></div><div className="profile-account-state"><span className={`profile-state-dot${profile.status !== "active" ? " inactive" : ""}`} /><div><strong>Account {profile.status === "active" ? "active" : "inactive"}</strong><span>Your account is {profile.status}.</span></div></div><div className="profile-aside-divider" /><div className="profile-aside-stat"><span>Access level</span><strong>{profile.role === "admin" ? "Administrator" : "Standard access"}</strong></div><div className="profile-aside-stat"><span>Email status</span><strong className={profile.isVerified ? "profile-status-verified" : ""}>{profile.isVerified ? "Verified" : "Needs verification"}</strong></div></section><section className="profile-tip-card"><span className="profile-tip-icon"><i className="bi bi-lightbulb" /></span><h3>A little security goes a long way</h3><p>Use a unique password and update it if you think your account may be at risk.</p><span className="profile-tip-mark">SECURITY TIP</span></section></aside></div>
    </>}
    {passwordChanged && <NotificationToast message="Password has been changed successfully" onClose={() => setPasswordChanged(false)} />}
  </div>;
}

function ProfileDetail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <div className="profile-detail"><span className="profile-detail-icon"><i className={`bi ${icon}`} /></span><div><span>{label}</span><strong>{value}</strong></div></div>;
}
