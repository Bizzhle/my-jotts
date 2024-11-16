import { Reducer, useCallback, useReducer } from "react";

type ReducerState = Record<string, unknown>;
type ReducerAction = { key: keyof ReducerState; value: unknown };

const objectReducer: Reducer<ReducerState, ReducerAction> = function (
  state,
  { key, value }
) {
  return { ...state, [key]: value };
};

export type setStateFn<State> = {
  <Key extends keyof State>(key: Key, value: State[Key]): void;
  (partial: Partial<State>): void;
};
// function reducer<State, Action>(state: State, action:Action) {
//   switch (action.type) {
//     case "UPDATE_VALUE":
//       return {
//         ...state,
//         [action.key]: action.value,
//       };

//     case "RESET":
//       return action.initialState;

//     default: {
//       throw new Error();
//     }
//   }
// }
export function useObjectReducer<T>(initialState: T) {
  const [state, dispatch] = useReducer(
    objectReducer as Reducer<T, ReducerAction>,
    initialState
  );

  const setState: setStateFn<T> = useCallback(
    (key: string | number | symbol | Partial<T>, value?: unknown) => {
      if (typeof key === "object") {
        Object.entries(key).forEach(([key, value]) => dispatch({ key, value }));
      } else {
        dispatch({ key, value } as ReducerAction);
      }
    },
    []
  );

  return [state, setState] as const;
}
