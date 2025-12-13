import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { User } from "../../../utils/contexts/BetterAuthContext";
import * as BetterAuthHook from "../../../utils/contexts/hooks/useBetterAuth";
import { Contact } from "../contact";

const user: User = {
  id: "1",
  email: "test@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  emailVerified: true,
  name: "Test User",
  role: "user",
};

vi.mock("../../../api-service/ApiRequestManager", () => ({
  ApiHandler: {
    sendSupportRequest: vi.fn().mockResolvedValue({}),
  },
  isApiError: (error: unknown): string | undefined => {
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as { message: string }).message;
    }
    return "API Error";
  },
}));

vi.mock("../../../utils/contexts/hooks/useBetterAuth", () => ({
  useBetterAuth: () => ({
    authenticatedUser: null,
  }),
}));

describe("Contact Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render contact component", () => {
    render(<Contact />);

    const heading = screen.getByRole("heading", { name: /support/i });
    expect(heading).toBeInTheDocument();
  });

  it("should prefill email if user is authenticated", () => {
    vi.spyOn(BetterAuthHook, "useBetterAuth").mockReturnValue({
      authenticatedUser: user,
      isAuthenticated: true,
      isLoading: false,
      user: user,
      logoutUser: vi.fn(),
      startSession: vi.fn(),
      session: null,
      loginError: "",
      storeLoginError: vi.fn(),
    });

    render(<Contact />);

    const emailInput = screen.getByLabelText(
      /email address/i
    ) as HTMLInputElement;
    expect(emailInput.value).toBe(user.email);
  });
});
