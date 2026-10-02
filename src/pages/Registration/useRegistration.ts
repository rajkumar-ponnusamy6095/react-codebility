import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import type { RegistrationForm } from "./registration.types";

const initialForm: RegistrationForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  address: "",
};

export function useRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm>(initialForm);

  const updateField = <K extends keyof RegistrationForm>(
    field: K,
    value: RegistrationForm[K],
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Registration API will be added later.
    console.log(form);
    navigate("/login");
  };

  return { form, updateField, handleSubmit };
}
