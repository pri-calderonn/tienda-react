import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import AuthService from "../services/AuthService";

vi.mock("../services/AuthService", () => ({
  default: {
    login: vi.fn(),
  },
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("loguea y redirige si las credenciales son correctas", async () => {
    AuthService.login.mockResolvedValue({
      token: "fake-token",
      user: { rol: "ADMIN" },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "admin@test.cl");
    await user.type(screen.getByLabelText(/contraseña/i), "Admin123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(AuthService.login).toHaveBeenCalledWith("admin@test.cl", "Admin123");
  });

  it("muestra error si el login falla", async () => {
    AuthService.login.mockRejectedValue(new Error("401"));

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "x@test.cl");
    await user.type(screen.getByLabelText(/contraseña/i), "wrong");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
  });
});
