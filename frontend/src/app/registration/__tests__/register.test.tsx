import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { describe, expect, it } from "vitest";
import RegistrationForm from "../RegistrationForm";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../libs/betterAuthClient", () => ({
  authClient: {
    signUp: {
      email: vi.fn().mockResolvedValue({
        data: { user: { id: "test-id", email: "test@example.com" } },
        error: null,
      }),
    },
  },
}));

describe("Registration", () => {
  it("should render the RegistrationForm component", () => {
    render(<RegistrationForm />);
    const button = screen.getByRole("button");
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Submit/i);
  });

  it("should show success message on successful registration", async () => {
    render(<RegistrationForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/name/i), "Test User");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(submitButton);
    screen.debug();
    const heading = screen.getByRole("heading", {
      name: /Registration successful, check your email to verify your account/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should show error message on registration failure", async () => {
    const { authClient } = await import("../../libs/betterAuthClient");
    authClient.signUp.email = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Email already in use" },
    });

    render(<RegistrationForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/name/i), "Test User");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(submitButton);
    const errorMessage = screen.getByText(/Email already in use/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should handle network error on form submit", async () => {
    const { authClient } = await import("../../libs/betterAuthClient");
    authClient.signUp.email = vi
      .fn()
      .mockRejectedValue(new Error("Network error"));

    render(<RegistrationForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/name/i), "Test User");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(submitButton);
    // The UI should show your fallback error

    await screen.findByText("An unexpected error occurred. Please try again.");
  });
});
