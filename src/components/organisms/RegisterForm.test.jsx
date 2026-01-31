import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("muestra error si edad es menor a 18", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    const inputNombre = document.querySelector('input[name="nombre"]');
    const inputEdad = document.querySelector('input[name="edad"]');
    const inputEmail = document.querySelector('input[name="email"]');
    const inputPassword = document.querySelector('input[name="password"]');

    expect(inputNombre).toBeTruthy();
    expect(inputEdad).toBeTruthy();
    expect(inputEmail).toBeTruthy();
    expect(inputPassword).toBeTruthy();

    await user.type(inputNombre, "Test User");
    await user.type(inputEdad, "17");
    await user.type(inputEmail, "test@gmail.com");
    await user.type(inputPassword, "123456");

    await user.click(screen.getByRole("button", { name: /UNIRSE A LA COMUNIDAD/i }));

    expect(screen.getByText(/Debes ser mayor de 18/i)).toBeInTheDocument();
  });
});

