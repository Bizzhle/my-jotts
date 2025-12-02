import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ApiHandler } from "../../../../api-service/ApiRequestManager";
import CategoryForm from "../CategoryForm";

vi.mock("../../../../api-service/ApiRequestManager", () => {
  return {
    ApiHandler: {
      createCategory: vi.fn().mockResolvedValue({}),
      updateCategory: vi.fn().mockResolvedValue({}),
    },
  };
});

vi.mock("../../../utils/contexts/hooks/useActivities", () => ({
  useActivities: () => ({
    reloadCategories: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock("../../../utils/contexts/hooks/useActivities", () => ({
  useActivities: () => ({
    reloadCategories: vi.fn().mockResolvedValue({}),
  }),
}));

describe("CategoryForm", () => {
  it("should render CategoryForm component", () => {
    render(<CategoryForm open={true} handleClose={vi.fn()} />);
    const heading = screen.getByRole("heading", { name: /Add Category/i });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(screen.getByLabelText("Category *")).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

    screen.debug();
  });

  it("should create a new category on form submit", async () => {
    const user = userEvent.setup();
    const handleCloseMock = vi.fn();

    render(<CategoryForm open={true} handleClose={handleCloseMock} />);

    await user.type(screen.getByLabelText("Category *"), "New Category");
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a new category"
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(vi.mocked(ApiHandler.createCategory)).toHaveBeenCalledWith({
        categoryName: "New Category",
        description: "This is a new category",
      });
    });
    expect(handleCloseMock).toHaveBeenCalled();
  });
});
