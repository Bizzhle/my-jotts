import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { describe, expect, it } from "vitest";
import { ChangePassword } from "../ChangePassword";

vi.mock("../../../../libs/betterAuthClient", () => ({
  authClient: {
    changePassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
}));

describe("ChangePassword Component", () => {
  it("should render ChangePassword component", () => {
    render(<ChangePassword />);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Change password/i })
    ).toBeInTheDocument();
  });

  it("should call changePassword on form submit", async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);
    await user.type(screen.getByLabelText(/current password/i), "oldPass123");
    await user.type(screen.getByLabelText("New password"), "newPass123");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "newPass123"
    );
    await user.click(screen.getByRole("button", { name: /Change password/i }));

    expect(
      await screen.findByText(/Password changed successfully/i)
    ).toBeInTheDocument();
  });

  it("should show error message on password mismatch", async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);
    await user.type(screen.getByLabelText(/current password/i), "oldPass123");
    await user.type(screen.getByLabelText("New password"), "newPass123");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "differentPass"
    );
    await user.click(screen.getByRole("button", { name: /Change password/i }));

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });
});
