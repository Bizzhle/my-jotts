import { createContext, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ApiHandler, isApiError } from "../../../api-service/ApiRequestManager";
import { ActivityResponseDto } from "../../../api-service/dtos/activity.dto";
import { CategoryResponseDto } from "../../../api-service/dtos/category.dto";
import { PageInfoDto } from "../../../api-service/dtos/pageInfo.dto";
import { useObjectReducer } from "../shared/objectReducer";
import { useDebounce } from "../shared/useDebounce";
import { useBetterAuth } from "./hooks/useBetterAuth";

interface Activity extends ActivityResponseDto {}

interface ActivityProviderProps {
  children?: React.ReactNode;
}

interface ActivityContextState {
  activities: ActivityResponseDto[];
  categories: CategoryResponseDto[];
  searchQuery: string;
  error?: string;
  loading: boolean;
  activityData: Activity | null;
  activityDataLoading: boolean;
  activityDataError?: string;
  category: CategoryResponseDto | null;
  pageInfo: PageInfoDto;
}

interface ActivityContextValue extends ActivityContextState {
  loadActivities: () => void;
  findActivity: (value: string) => void;
  fetchActivity: () => void;
  fetchCategories: () => void;
  fetchCategory: (categoryId: string) => void;
  loadActivitiesByCategory: (categoryId: string) => void;
  setPage: (page: number) => void;
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
  pageInfo: {
    limit: 10, // Default limit
    offset: 0, // Default offset
    count: 0, // Total count of activities
  },
};
export const ActivityContext = createContext<ActivityContextValue>(
  {} as ActivityContextValue
);

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { id } = useParams<{
    id?: string;
  }>();
  const [state, setState] = useObjectReducer(initialState);
  const debouncedSearch = useDebounce(state.searchQuery);
  const { authenticatedUser } = useBetterAuth(); // get user or auth state

  const setPage = useCallback(
    (page: number) => {
      const limit = state.pageInfo.limit ?? 10;
      const offset = (page - 1) * limit;
      setState({ pageInfo: { ...state.pageInfo, offset } });
    },
    [setState, state.pageInfo]
  );

  const findActivity = useCallback(
    (searchQuery: string) => {
      setState({ searchQuery, pageInfo: { ...state.pageInfo, offset: 0 } });
    },
    [setState, state.pageInfo]
  );

  const loadActivities = useCallback(async () => {
    try {
      setState("loading", true);
      const { data, count, ...page } = await ApiHandler.getActivities(
        debouncedSearch,
        state.pageInfo.limit,
        state.pageInfo.offset
      );
      setState({
        activities:
          state.pageInfo.offset === 0 ? data : [...state.activities, ...data],
      });
      setState({
        pageInfo: { ...page, count: count ?? state.pageInfo.count },
      });
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, state.pageInfo.limit, state.pageInfo.offset, setState]);

  const loadActivitiesByCategory = async (categoryId: string) => {
    if (!categoryId) {
      return;
    }

    try {
      setState("loading", true);
      const { data } = await ApiHandler.getActivitiesByCategoryId(categoryId);

      setState({
        activities: data.activities,
        category: data.category,
      });
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
  };

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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await ApiHandler.getCategories();
      setState("categories", response);
    } catch (err) {
      setState("error", isApiError(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategory = async (categoryId: string) => {
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
  };

  useEffect(() => {
    if (authenticatedUser) {
      void Promise.all([loadActivities(), fetchCategories()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser]);

  //Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...state,
      loadActivities,
      findActivity,
      fetchActivity,
      fetchCategories,
      fetchCategory,
      loadActivitiesByCategory,
      setPage, // Add setPage to context value
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state,
      loadActivities,
      findActivity,
      fetchActivity,
      fetchCategories,
      fetchCategory,
      setPage,
    ]
  );

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
}
