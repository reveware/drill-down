import { Regex } from ".";

export namespace Validation {
  export const isValidEmailAddress = (email: string): boolean => {
    return Regex.VALID_EMAIL.test(email);
  };

  export const isValidDateInput = (date: string): boolean => {
    return Regex.VALID_DATE.test(date);
  };

  export const isValidImageMime = (mime: string): boolean => {
    return Regex.VALID_IMAGE_MIME.test(mime);
  };
}
