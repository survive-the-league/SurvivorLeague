import { AuthState } from "./AuthProvider";

type AuthAction =
  | {
      type: "[AUTH] - Login";
      payload: {
        id: string;
        email: string;
        displayName: string;
        lives: number;
        token: string;
      };
    }
  | { type: "[AUTH] - Logout" }
  | { type: "[AUTH] - SetLoading"; payload: boolean };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "[AUTH] - Login":
      return {
        ...state,
        currentUser: action.payload,
      };

    case "[AUTH] - Logout":
      return {
        ...state,
        currentUser: null,
      };

    case "[AUTH] - SetLoading":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};
