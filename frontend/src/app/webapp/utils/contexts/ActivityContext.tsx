import { ActivityResponseDto } from "../../../api-service/dtos/activity.dto";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useObjectReducer } from "../shared/objectReducer";
import { isApiError } from "../../../api-service/services/auth-service";
import {
  getActivities,
  getActivity,
  getActivitiesByCategoryName,
  getCategories,
} from "../../../api-service/services/activity-service";
import { useParams } from "react-router-dom";
import { useDebounce } from "../shared/useDebounce";

interface Activity extends ActivityResponseDto {}
interface Category {
  id: number;
  categoryName: string;
  description?: string;
}

interface ActivityProviderProps {
  children?: React.ReactNode;
}

interface ActivityContextState {
  activities: Activity[];
  categories: Category[];
  searchQuery: string;
  error?: string;
  loading: boolean;
  activityData?: Activity;
  activityDataLoading: boolean;
  activityDataError?: string;
}

interface ActivityContextValue extends ActivityContextState {
  reloadActivity: () => void;
  findActivity: (value: string) => void;
}

const initialState: ActivityContextState = {
  activities: [],
  categories: [],
  searchQuery: "",
  error: undefined,
  loading: false,
  activityDataLoading: false,
  activityDataError: "",
};
export const ActivityContext = createContext<ActivityContextValue>(
  {} as ActivityContextValue
);

export function useActivities(): ActivityContextValue {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { id, categoryName } = useParams<{
    id?: string;
    categoryName?: string;
  }>();
  const [
    {
      activities,
      activityData,
      searchQuery,
      categories,
      loading,
      activityDataLoading,
    },
    setState,
  ] = useObjectReducer(initialState);
  const debouncedSearch = useDebounce(searchQuery);

  function findActivity(searchQuery: string) {
    setState({ searchQuery });
  }

  useEffect(() => {
    if (!id) {
      async function loadActivities() {
        try {
          setState("loading", true);
          const response = categoryName
            ? await getActivitiesByCategoryName(categoryName)
            : await getActivities(debouncedSearch);

          setState({ activities: response });
        } catch (err) {
          setState("error", isApiError(err));
        } finally {
          setState("loading", false);
        }
      }
      loadActivities();
    }
  }, [debouncedSearch, categoryName, id, setState]);

  const reloadActivity = useCallback(async () => {
    if (!id) {
      setState("activityData", undefined);
      return;
    }
    try {
      setState("activityDataLoading", true);
      const activity = await getActivity(id);
      setState("activityData", activity);
    } catch (err) {
      setState("activityDataError", isApiError(err));
    }
  }, [setState, id]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setState("categories", response);
    } catch (err) {
      setState("error", isApiError(err));
    }
  }, [setState]);

  useEffect(() => {
    reloadActivity();
  }, [reloadActivity]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <ActivityContext.Provider
      value={{
        reloadActivity,
        findActivity,
        activities,
        categories,
        searchQuery,
        loading,
        activityDataLoading,
        activityData,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}
