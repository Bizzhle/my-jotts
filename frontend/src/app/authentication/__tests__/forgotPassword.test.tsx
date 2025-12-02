import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { describe, it } from "vitest";
import { ForgotPassword } from "../ForgotPassword";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../libs/betterAuthClient", () => ({
  authClient: {
    requestPasswordReset: vi.fn().mockResolvedValue({
      data: { message: "Password reset email sent" },
      error: null,
    }),
  },
}));

describe("Forgot Password", () => {
  it("should render the ForgotPassword component", () => {
    render(<ForgotPassword />);
    expect(screen.getByRole("button")).toHaveTextContent(
      /Send password reset link/i
    );
  });

  it("should show success message on successful submission", async () => {
    render(<ForgotPassword />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: /send password reset link/i })
    );
    await screen.findByText("Password reset email sent");
  });

  it("should show error message on failed submission", async () => {
    const { authClient } = await import("../../libs/betterAuthClient");
    vi.mocked(authClient.requestPasswordReset).mockResolvedValueOnce({
      data: null,
      error: { message: "Network error" },
    });

    render(<ForgotPassword />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: /send password reset link/i })
    );
    await screen.findByText("Network error");
  });
});
