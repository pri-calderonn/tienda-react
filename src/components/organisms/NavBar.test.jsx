import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra Iniciar Sesión y Crear Cuenta cuando no hay usuario", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Crear Cuenta/i)).toBeInTheDocument();
  });
});
