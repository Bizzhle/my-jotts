import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { describe, it } from "vitest";
import { ResetPassword } from "../ResetPassword";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams({ token: "test-token" })],
}));

vi.mock("../../api-service/ApiRequestManager", () => ({
  ApiHandler: {
    resetPassword: vi.fn().mockResolvedValue({}),
  },
  isApiError: (error: unknown): string | undefined => {
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as { message: string }).message;
    }
    return "API Error";
  },
}));

vi.mock("../../webapp/layout/hooks/useLayoutContext", () => ({
  useLayoutContext: () => ({
    hideNavigation: vi.fn(),
    hideSearchBar: vi.fn(),
    hideHeader: vi.fn(),
  }),
}));
describe("Password Reset", () => {
  it("should render password reset form", () => {
    render(<ResetPassword />);

    const heading = screen.getByRole("heading", { name: /reset password/i });
    const newPasswordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    expect(heading).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("should show success message on successful password reset", async () => {
    render(<ResetPassword />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Password"), "newPassword123");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "newPassword123"
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    const heading = await screen.findByRole("heading", {
      name: /password reset successfully/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should show error message on password reset failure", async () => {
    const { ApiHandler } = await import("../../api-service/ApiRequestManager");
    ApiHandler.resetPassword = vi
      .fn()
      .mockRejectedValue({ message: "Invalid or expired token" });

    render(<ResetPassword />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Password"), "newPassword123");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "newPassword123"
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    const errorMessage = await screen.findByText(/invalid or expired token/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should validate password match", async () => {
    render(<ResetPassword />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Password"), "newPassword123");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "differentPassword"
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    const errorMessage = await screen.findByText(/passwords do not match/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
