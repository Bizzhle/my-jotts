import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConfirmRegistration } from "../ConfirmRegistration";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams({ token: "test-token" })],
}));

vi.mock("../../libs/betterAuthClient", () => ({
  verifyEmail: vi
    .fn()
    .mockResolvedValue({ data: { message: "Successful" }, error: null }),
}));

describe("ConfirmRegistration", () => {
  it("should render success message on successful email verification", async () => {
    render(<ConfirmRegistration />);

    const successMessage = await screen.findByText(/Successful/i);
    expect(successMessage).toBeInTheDocument();
  });
  it("should render error message on email verification failure", async () => {
    const { verifyEmail } = await import("../../libs/betterAuthClient");
    vi.mocked(verifyEmail).mockResolvedValueOnce({
      data: null,
      error: { message: "error" },
    });

    render(<ConfirmRegistration />);

    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
