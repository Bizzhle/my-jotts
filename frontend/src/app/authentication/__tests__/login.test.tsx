import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../LoginForm";

const startSessionMock = vi.fn();
const storeLoginErrorMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: {} }),
}));

vi.mock("../../webapp/utils/contexts/hooks/useBetterAuth", () => ({
  useBetterAuth: () => ({
    startSession: startSessionMock,
    storeLoginError: storeLoginErrorMock,
    loginError: null,
  }),
}));

vi.mock("../../libs/betterAuthClient", () => ({
  authClient: {
    signIn: {
      email: vi.fn().mockResolvedValue({ error: null }),
    },
    getSession: vi.fn().mockResolvedValue({
      data: { user: { id: "test-id", email: "test@example.com" } },
    }),
  },
}));

describe("Login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the LoginForm component", () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    const registerButton = screen.getByRole("button", {
      name: /create an account/i,
    });

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it("should call startSession on form submit", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(submitButton);
    await waitFor(() => expect(startSessionMock).toHaveBeenCalledTimes(1));
  });

  it("should display error message on login failure", async () => {
    const { authClient } = await import("../../libs/betterAuthClient");
    authClient.signIn.email = vi
      .fn()
      .mockResolvedValue({ error: { message: "Invalid email or password" } });

    render(<LoginForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(submitButton);
    await waitFor(() =>
      expect(storeLoginErrorMock).toHaveBeenCalledWith(
        "Invalid email or password"
      )
    );
  });

  it("should handle unexpected errors gracefully", async () => {
    const { authClient } = await import("../../libs/betterAuthClient");
    authClient.signIn.email = vi
      .fn()
      .mockRejectedValue(new Error("Network error"));

    render(<LoginForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(submitButton);
    // The UI should show your fallback error
    await screen.findByText("An unexpected error occurred. Please try again.");
  });
});
