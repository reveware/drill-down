import { Values } from "./values";

export namespace Regex {
  export const VALID_EMAIL = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  export const VALID_DATE = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);

  export const VALID_IMAGE_MIME = new RegExp(Values.IMAGE_MIME);
}
