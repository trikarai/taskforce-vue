const base = {
  storage: "",
  api: ""
};
if (process.env.NODE_ENV === "production") {
  base.api = window.location.origin + "/bara-taskforce/public/api";
  base.storage = window.location.origin + "/bara-taskforce/storage/app";
} else {
  var localhost = "http://localhost";
  base.api = localhost + "/bara-taskforce/public/api";
  base.storage = localhost + "/bara-taskforce/storage/app";
}
export const baseUri = base;
