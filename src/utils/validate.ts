import { REGEX } from "src/config/regex";

const checkMobile = (phone?: string | null) => {
  return !!phone && !!phone?.match?.(REGEX.MOBILE_NUMBER);
};

export const validator = {
  checkMobile,
};
