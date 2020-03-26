const base = {
  storage: "",
  api: ""
};
if (process.env.NODE_ENV === "production") {
  base.api = window.location.origin + "/bara-taskforce/public/api";
  base.storage = window.location.origin + "/bara-taskforce/storage/app";
} else {
  base.api = "http://localhost/bara-taskforce/public/api";
  base.storage = "http://localhost/bara-taskforce/storage/app";
}
export const baseUri = base;
