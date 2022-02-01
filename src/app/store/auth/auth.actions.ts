import { createAction, props } from "@ngrx/store";
import { User } from "../../user";

export const checkAuth = createAction('[Auth] checkAuth');
export const checkAuthComplete = createAction(
  '[Auth] checkAuthComplete',
  props<{ isLoggedIn: boolean }>()
);
export const login = createAction(
  '[Auth] login',
  props<{ email: string, password: string }>()
);
export const loginComplete = createAction(
  '[Auth] loginComplete',
  props<{ user: User; isLoggedIn: boolean; }>()
);
export const logout = createAction('[Auth] logout');
export const logoutComplete = createAction('[Auth] logoutComplete');
