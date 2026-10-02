import type { RegistrationFormData } from "../pages/Registration/registration.schema";
import { apiRequest } from "./api";

export type RegistrationRequest = RegistrationFormData;

export const registerAccount = async (
  registration: RegistrationRequest,
): Promise<void> => {
  await apiRequest<void>("/v1/accounts/register", {
    method: "POST",
    body: JSON.stringify(registration),
    token: null,
  });
};
