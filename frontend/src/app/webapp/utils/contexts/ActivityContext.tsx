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

interface Activity extends ActivityResponseDto {}
interface Category {
  id: number;
  categoryName: string;
  description?: string;
}

interface ActivityProviderProps {
  children?: React.ReactElement;
}

interface ActivityContextState {
  activities: Activity[];
  categories: Category[];
  error?: string;
  loading: boolean;
  activityData?: Activity;
  activityDataLoading: boolean;
  activityDataError?: string;
}

interface ActivityContextValue extends ActivityContextState {
  reloadActivity: () => void;
}

const initialState: ActivityContextState = {
  activities: [],
  categories: [],
  error: undefined,
  loading: false,
  activityDataLoading: false,
  activityDataError: "",
};
export const ActivityContext = createContext<ActivityContextValue>({} as never);

export function useActivities(): ActivityContextValue {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
}

export function ActivityProvider(props: ActivityProviderProps) {
  const { id, categoryName } = useParams<{
    id?: string;
    categoryName?: string;
  }>();
  const [state, setState] =
    useObjectReducer<ActivityContextState>(initialState);

  const fetchActivities = useCallback(async () => {
    try {
      setState("loading", true);
      if (categoryName) {
        const response = await getActivitiesByCategoryName(categoryName);
        setState("activities", response);
      } else {
        const response = await getActivities();
        setState("activities", response);
      }
    } catch (err) {
      setState("error", isApiError(err));
    } finally {
      setState("loading", false);
    }
  }, [categoryName, setState]);

  //async function fetchActivitiesByCategoryName(categoryName: string) {
  //  try {
  //     setState("loading", true);
  //        const response = await getActivitiesByCategoryName(categoryName);
  //     setState("activities", response);
  //   } catch (err) {
  //     const errorMsg = isApiError(err);
  //    setState("error", errorMsg);
  //  }
  //}

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
    fetchActivities();
    fetchCategories();
  }, [fetchActivities, fetchCategories]);

  return (
    <ActivityContext.Provider
      value={{
        ...state,
        reloadActivity,
      }}
      {...props}
    />
  );
}
