import { AuthState, authFeatureName } from "./auth.reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const getAuthFeatureState = createFeatureSelector<AuthState>(authFeatureName);

export const selectIsAuthenticated = createSelector(
  getAuthFeatureState,
  (state: AuthState) => state.isLoggedIn
)

export const selectUserInfo = createSelector(
  getAuthFeatureState,
  (state: AuthState) => state.user,
)
