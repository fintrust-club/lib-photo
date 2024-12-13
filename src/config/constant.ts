import { CONFIG } from ".";

export const STORE_LINK_PREFIX = CONFIG.isProduction
  ? "meralink.shop/"
  : "buzbridge-41dde.firebaseapp.com/";

export enum USAGE_INTENT {
  PERSONAL = "PERSONAL",
  BRAND_COLLAB = "BRAND_COLLAB",
}
