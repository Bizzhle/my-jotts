import { createContext, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiHandler, isApiError } from "../../../api-service/ApiRequestManager";
import { ActivityResponseDto } from "../../../api-service/dtos/activity.dto";
import { CategoryDto } from "../../../api-service/dtos/category.dto";
import { getActivitiesByCategoryName } from "../../../api-service/services/activity-service";
import { useObjectReducer } from "../shared/objectReducer";
import { useDebounce } from "../shared/useDebounce";

interface Activity extends ActivityResponseDto {}

interface ActivityProviderProps {
  children?: React.ReactNode;
}

interface ActivityContextState {
  activities: Activity[];
  categories: CategoryDto[];
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
  reloadCategory: () => void;
  fetchActivity: () => void;
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

  async function loadActivities() {
    try {
      setState("loading", true);
      const response = categoryName
        ? await getActivitiesByCategoryName(categoryName)
        : await ApiHandler.getActivities(debouncedSearch);

      setState({ activities: response });
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
  }

  useEffect(() => {
    if (!id) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, categoryName, id, setState]);

  const reloadActivity = async () => {
    try {
      setState("loading", true);
      const activity = await ApiHandler.getActivities();
      setState({ activities: activity });
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
  };

  const fetchActivity = useCallback(async () => {
    if (!id) {
      setState("activityData", undefined);
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

  const reloadCategory = useCallback(async () => {
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

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

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
        reloadCategory,
        fetchActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}
