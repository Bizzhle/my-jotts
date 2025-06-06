import { createContext, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ApiHandler, isApiError } from "../../../api-service/ApiRequestManager";
import {
  ActivitiesResponseDto,
  ActivityResponseDto,
} from "../../../api-service/dtos/activity.dto";
import { CategoryDto } from "../../../api-service/dtos/category.dto";
import { useObjectReducer } from "../shared/objectReducer";
import { useDebounce } from "../shared/useDebounce";
import { useAuth } from "./hooks/useAuth";

interface Activity extends ActivityResponseDto {}

interface ActivityProviderProps {
  children?: React.ReactNode;
}

interface ActivityContextState {
  activities: ActivitiesResponseDto[];
  categories: CategoryDto[];
  searchQuery: string;
  error?: string;
  loading: boolean;
  activityData: Activity | null;
  activityDataLoading: boolean;
  activityDataError?: string;
  category: CategoryDto | null;
}

interface ActivityContextValue extends ActivityContextState {
  reloadActivity: () => void;
  findActivity: (value: string) => void;
  reloadCategories: () => void;
  fetchActivity: () => void;
  fetchCategories: () => void;
  fetchCategory: () => void;
}

const initialState: ActivityContextState = {
  activities: [],
  categories: [],
  activityData: null,
  searchQuery: "",
  error: undefined,
  loading: false,
  activityDataLoading: false,
  activityDataError: "",
  category: null,
};
export const ActivityContext = createContext<ActivityContextValue>(
  {} as ActivityContextValue
);

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { id, categoryId } = useParams<{
    id?: string;
    categoryId?: string;
  }>();
  const [state, setState] = useObjectReducer(initialState);
  const debouncedSearch = useDebounce(state.searchQuery);
  const { authenticatedUser } = useAuth(); // get user or auth state

  const findActivity = useCallback(
    (searchQuery: string) => {
      setState({ searchQuery });
    },
    [setState]
  );

  const loadActivities = useCallback(async () => {
    try {
      setState("loading", true);
      const response = categoryId
        ? await ApiHandler.getActivitiesByCategory(categoryId)
        : await ApiHandler.getActivities(debouncedSearch);
      setState({ activities: response });
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
  }, [categoryId, debouncedSearch, setState]);

  const reloadActivity = useCallback(async () => {
    try {
      setState("loading", true);
      const activity = categoryId
        ? await ApiHandler.getActivitiesByCategory(categoryId)
        : await ApiHandler.getActivities();
      setState({ activities: activity });
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
  }, [categoryId, setState]);

  const fetchActivity = useCallback(async () => {
    if (!id) {
      setState("activityData", null);
      return;
    }
    try {
      setState("activityDataLoading", true);
      const activity = await ApiHandler.getActivity(id);
      setState("activityData", activity);
    } catch (err) {
      setState("activityDataError", isApiError(err));
    }
  }, [setState, id]);

  const reloadCategories = useCallback(async () => {
    try {
      const response = await ApiHandler.getCategories();
      setState("categories", response);
    } catch (err) {
      setState("error", isApiError(err));
    }
  }, [setState]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await ApiHandler.getCategories();
      setState("categories", response);
    } catch (err) {
      setState("error", isApiError(err));
    }
  }, [setState]);

  const fetchCategory = useCallback(async () => {
    if (!categoryId) {
      setState("category", null);
      return;
    }
    try {
      const category = await ApiHandler.getCategory(categoryId);
      setState("category", category);
    } catch (err) {
      setState("activityDataError", isApiError(err));
    }
  }, [setState, categoryId]);

  useEffect(() => {
    if (authenticatedUser && !id) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, categoryId, id, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      fetchActivity();
    }
  }, [fetchActivity, authenticatedUser]);

  useEffect(() => {
    fetchCategories();
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  //Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...state,
      reloadActivity,
      findActivity,
      reloadCategories,
      fetchActivity,
      fetchCategories,
      fetchCategory,
    }),
    [
      state,
      reloadActivity,
      findActivity,
      reloadCategories,
      fetchActivity,
      fetchCategories,
      fetchCategory,
    ]
  );

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
}
