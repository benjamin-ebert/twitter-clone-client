import { createReducer, on, Action } from "@ngrx/store";
import * as authActions from './auth.actions';
import { User } from "../../user";

export const authFeatureName = 'auth';

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoggedIn: false,
}

const authReducerInternal = createReducer(
  initialAuthState,
  on(authActions.loginComplete, (state, { user, isLoggedIn }) => {
    return {
      ...state,
      user,
      isLoggedIn
    };
  }),
  on(authActions.userUpdateComplete, (state, { user }) => {
    return {
      ...state,
      user
    };
  }),
  on(authActions.logoutComplete, (state, {}) => {
    return {
      ...state,
      user: null,
      isLoggedIn: false,
    };
  })
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return authReducerInternal(state, action);
}
