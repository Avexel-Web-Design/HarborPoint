import { onRequestPost as __api_admin_auth_login_ts_onRequestPost } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\auth\\login.ts"
import { onRequestPost as __api_admin_auth_logout_ts_onRequestPost } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\auth\\logout.ts"
import { onRequestGet as __api_admin_auth_me_ts_onRequestGet } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\auth\\me.ts"
import { onRequestPost as __api_auth_login_ts_onRequestPost } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\auth\\login.ts"
import { onRequestPost as __api_auth_logout_ts_onRequestPost } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\auth\\logout.ts"
import { onRequestGet as __api_auth_me_ts_onRequestGet } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\auth\\me.ts"
import { onRequestPost as __api_auth_register_ts_onRequestPost } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\auth\\register.ts"
import { onRequest as __api_admin_dining_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\dining\\index.ts"
import { onRequest as __api_admin_events_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\events\\index.ts"
import { onRequest as __api_admin_members_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\members\\index.ts"
import { onRequest as __api_admin_tee_times_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\admin\\tee-times\\index.ts"
import { onRequest as __api_tee_times_available_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\tee-times\\available.ts"
import { onRequest as __api_dining_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\dining\\index.ts"
import { onRequest as __api_events_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\events\\index.ts"
import { onRequest as __api_guest_passes_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\guest-passes\\index.ts"
import { onRequest as __api_tee_times_index_ts_onRequest } from "C:\\Users\\gavin\\OneDrive\\Documents\\Github\\BirchwoodCC\\functions\\api\\tee-times\\index.ts"

export const routes = [
    {
      routePath: "/api/admin/auth/login",
      mountPath: "/api/admin/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/auth/logout",
      mountPath: "/api/admin/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_auth_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/auth/me",
      mountPath: "/api/admin/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_auth_me_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/dining",
      mountPath: "/api/admin/dining",
      method: "",
      middlewares: [],
      modules: [__api_admin_dining_index_ts_onRequest],
    },
  {
      routePath: "/api/admin/events",
      mountPath: "/api/admin/events",
      method: "",
      middlewares: [],
      modules: [__api_admin_events_index_ts_onRequest],
    },
  {
      routePath: "/api/admin/members",
      mountPath: "/api/admin/members",
      method: "",
      middlewares: [],
      modules: [__api_admin_members_index_ts_onRequest],
    },
  {
      routePath: "/api/admin/tee-times",
      mountPath: "/api/admin/tee-times",
      method: "",
      middlewares: [],
      modules: [__api_admin_tee_times_index_ts_onRequest],
    },
  {
      routePath: "/api/tee-times/available",
      mountPath: "/api/tee-times",
      method: "",
      middlewares: [],
      modules: [__api_tee_times_available_ts_onRequest],
    },
  {
      routePath: "/api/dining",
      mountPath: "/api/dining",
      method: "",
      middlewares: [],
      modules: [__api_dining_index_ts_onRequest],
    },
  {
      routePath: "/api/events",
      mountPath: "/api/events",
      method: "",
      middlewares: [],
      modules: [__api_events_index_ts_onRequest],
    },
  {
      routePath: "/api/guest-passes",
      mountPath: "/api/guest-passes",
      method: "",
      middlewares: [],
      modules: [__api_guest_passes_index_ts_onRequest],
    },
  {
      routePath: "/api/tee-times",
      mountPath: "/api/tee-times",
      method: "",
      middlewares: [],
      modules: [__api_tee_times_index_ts_onRequest],
    },
  ]