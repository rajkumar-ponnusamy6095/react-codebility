import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../services/userService";

describe("userService", () => {
  it("normalizes user list responses and serializes query params", async () => {
    const response = {
      data: [
        {
          id: "u1",
          firstName: "Jane",
          lastName: "Doe",
          gender: "female",
          email: "jane@example.com",
          phone: "+1234567890",
          department: "Engineering",
          role: "User",
          status: "active",
          createdAt: "2024-06-01T00:00:00Z",
          isVerified: true,
        },
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(response), { status: 200 }),
    );

    await expect(
      getUsers({ page: 1, sortBy: "name", role: "admin", status: "active" }),
    ).resolves.toMatchObject({
      data: [{ role: "user", name: "Jane Doe" }],
    });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:4000/api/v1/accounts?page=1&firstName=name&role=Admin&status=active",
    );
  });

  it("returns a single user and handles invalid query or IDs", async () => {
    const response = {
      id: "u2",
      firstName: "John",
      lastName: "Smith",
      gender: "male",
      email: "john@example.com",
      phone: "+15551234567",
      department: "Finance",
      role: "admin",
      status: "inactive",
      createdAt: "2024-02-01T00:00:00Z",
      isVerified: false,
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(response), { status: 200 }),
    );
    await expect(getUser("u2")).resolves.toMatchObject({ id: "u2", role: "admin", name: "John Smith" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: "u3" } }), { status: 200 }),
    );
    await expect(getUser("bad")).rejects.toThrow("The user response was missing required data");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(null), { status: 200 }),
    );
    await expect(getUser("bad")).rejects.toThrow("The user response was missing required data");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );
    await expect(getUsers({})).rejects.toThrow("The users response was missing required data");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [{ id: "u3", firstName: "Alice", lastName: "Jones", gender: "female", email: "alice@example.com", phone: "+1111111111", department: "HR", role: "User", status: "active", createdAt: "2024-01-01T00:00:00Z", isVerified: true }], pagination: null }), { status: 200 }),
    );
    await expect(getUsers({})).rejects.toThrow("The users response was missing required data");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: [{
            id: "u3",
            firstName: "Alice",
            lastName: "Jones",
            gender: "female",
            email: "alice@example.com",
            phone: "+1111111111",
            department: "HR",
            role: "User",
            status: "active",
            createdAt: "2024-01-01T00:00:00Z",
            isVerified: true,
          }],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );
    await expect(getUsers({ role: "" as never, status: undefined })).resolves.toMatchObject({
      data: [{ id: "u3", name: "Alice Jones" }],
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [{ id: "u3" }], pagination: {} }), { status: 200 }),
    );
    await expect(getUsers({ status: null as never })).rejects.toThrow("cannot be null");

    await expect(getUsers(null as never)).rejects.toThrow("missing or invalid");
    await expect(getUser("")).rejects.toThrow("A valid user ID is required");

  });

  it("serializes non-admin roles for user queries", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: [
            {
              id: "u3",
              firstName: "Alice",
              lastName: "Jones",
              gender: "female",
              email: "alice@example.com",
              phone: "+1111111111",
              department: "HR",
              role: "User",
              status: "active",
              createdAt: "2024-01-01T00:00:00Z",
              isVerified: true,
            },
          ],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );

    await expect(getUsers({ role: "user", status: "active" })).resolves.toMatchObject({
      data: [{ role: "user" }],
    });
  });

  it("creates, updates, and deletes users successfully", async () => {
    const userInput = {
      firstName: "Jane",
      lastName: "Doe",
      gender: "female",
      email: "jane@example.com",
      phone: "+1234567890",
      department: "Engineering",
      role: "admin" as const,
      status: "active" as const,
    };

    const createdResponse = {
      id: "u1",
      firstName: "Jane",
      lastName: "Doe",
      gender: "female",
      email: "jane@example.com",
      phone: "+1234567890",
      department: "Engineering",
      role: "Admin",
      status: "active",
      createdAt: "2024-06-01T00:00:00Z",
      isVerified: true,
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(createdResponse), { status: 201 }),
    );
    await expect(createUser(userInput)).resolves.toMatchObject({ id: "u1", role: "admin" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ...createdResponse, role: "User" }), { status: 200 }),
    );
    await expect(updateUser("u1", userInput)).resolves.toMatchObject({ id: "u1", role: "user" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ...createdResponse, role: "User" }), { status: 200 }),
    );
    await expect(createUser({ ...userInput, role: "user" })).resolves.toMatchObject({ id: "u1", role: "user" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ...createdResponse, role: "Admin" }), { status: 200 }),
    );
    await expect(updateUser("u1", { ...userInput, role: "user" })).resolves.toMatchObject({ id: "u1", role: "admin" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(deleteUser("u1")).resolves.toBeUndefined();
  });

  it("rejects invalid payloads for create and update", async () => {
    await expect(
      createUser({
        firstName: "",
        lastName: "Doe",
        gender: "female",
        email: "jane@example.com",
        phone: "+1234567890",
        department: "Engineering",
        role: "admin",
        status: "active",
      }),
    ).rejects.toThrow("User details are missing or invalid");

    await expect(
      createUser(null as never),
    ).rejects.toThrow("User details are missing or invalid");

    await expect(
      updateUser("u1", {
        firstName: "Jane",
        lastName: "Doe",
        gender: "female",
        email: "jane@example.com",
        phone: "+1234567890",
        department: "Engineering",
        role: "other" as never,
        status: "active",
      }),
    ).rejects.toThrow("Updated user details are missing or invalid");

    await expect(
      createUser({
        firstName: "Jane",
        lastName: "Doe",
        gender: "female",
        email: "jane@example.com",
        phone: "+1234567890",
        department: "Engineering",
        role: "user",
        status: "pending" as never,
      }),
    ).rejects.toThrow("User details are missing or invalid");
  });
});
