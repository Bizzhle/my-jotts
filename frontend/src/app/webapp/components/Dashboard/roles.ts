import { authClient } from "../../../libs/betterAuthClient";

export const Roles = ["user", "admin", "customUser"];

export type Role = Parameters<typeof authClient.admin.setRole>[0]["role"];
