import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import { describe, expect, it, Mock } from "vitest";
import ActivityDialogForm from "../ActivityDialogForm";

vi.mock("../../../../api-service/ApiRequestManager", () => ({
  ApiHandler: {
    // mock other methods if needed
    updateActivity: vi.fn().mockResolvedValue({}),
    createActivity: vi.fn().mockResolvedValue({}),
  },
  isApiError: vi.fn().mockReturnValue("Mocked API Error"),
}));

vi.mock("../../../utils/contexts/hooks/useActivities", () => ({
  useActivities: () => ({
    categories: [],
    reloadActivity: vi.fn(),
    fetchActivity: vi.fn(),
    reloadCategories: vi.fn(),
  }),
}));

vi.mock("../../../utils/contexts/hooks/useSubscription", () => ({
  useSubscription: () => ({
    subscription: { plan: "free" },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Activity Component", () => {
  it("should render Activity component", () => {
    render(<ActivityDialogForm open={true} handleClose={vi.fn()} />);
    expect(screen.getByText("Add Activity")).toBeInTheDocument();
  });

  it("should render Activity component in edit mode", () => {
    const activityToEdit = {
      id: 1,
      activityTitle: "Test Activity",
      categoryName: "Test Category",
      categoryId: 1,
      rating: 4,
      price: 10,
      location: "Test Location",
      description: "Test Description",
      dateCreated: new Date(),
      dateUpdated: new Date(),
      imageUrls: [],
    };
    render(
      <ActivityDialogForm
        open={true}
        handleClose={vi.fn()}
        activityToEdit={activityToEdit}
      />
    );
    expect(screen.getByText("Edit Activity")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Activity")).toBeInTheDocument();
  });

  it("should call createActivity when submitting new activity", async () => {
    const { ApiHandler } = await import(
      "../../../../api-service/ApiRequestManager"
    );
    const user = userEvent.setup();
    render(<ActivityDialogForm open={true} handleClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Activity *"), "New Activity");
    await user.type(screen.getByLabelText("Category"), "New Category");
    await user.type(screen.getByLabelText(/price/i), "20");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(ApiHandler.createActivity).toHaveBeenCalled();
  });

  it("should call updateActivity when submitting edited activity", async () => {
    const { ApiHandler } = await import(
      "../../../../api-service/ApiRequestManager"
    );
    const activityToEdit = {
      id: 1,
      activityTitle: "Test Activity",
      categoryName: "Test Category",
      categoryId: 1,
      rating: 4,
      price: 10,
      location: "Test Location",
      description: "Test Description",
      dateCreated: new Date(),
      dateUpdated: new Date(),
      imageUrls: [],
    };
    const user = userEvent.setup();
    render(
      <ActivityDialogForm
        open={true}
        handleClose={vi.fn()}
        activityToEdit={activityToEdit}
      />
    );

    await user.clear(screen.getByLabelText("Activity *"));
    await user.type(screen.getByLabelText("Activity *"), "Updated Activity");
    await user.click(screen.getByRole("button", { name: /update/i }));

    expect(ApiHandler.updateActivity).toHaveBeenCalled();
  });

  it("should prevent double submission", async () => {
    const { ApiHandler } = await import(
      "../../../../api-service/ApiRequestManager"
    );
    const createActivityMock = ApiHandler.createActivity as Mock;

    // Override the existing mock with a slow async fn
    createActivityMock.mockImplementation(
      () => new Promise((res) => setTimeout(res, 500))
    );
    const user = userEvent.setup();
    render(<ActivityDialogForm open={true} handleClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Activity *"), "New Activity");
    await user.type(screen.getByLabelText("Category"), "New Category");

    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Simulate double click
    await user.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(ApiHandler.createActivity).toHaveBeenCalledTimes(1);
    });
  });
});
