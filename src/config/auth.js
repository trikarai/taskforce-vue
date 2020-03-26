export default {
  getAuthHeader () {
    const data = JSON.parse(window.localStorage.getItem("lbUser"));
    const headers = {
      Authorization: "Bearer " + data.token
    };
    return headers;
  },
  getToken () {
    const data = JSON.parse(window.localStorage.getItem("lbUser"));
    return "Bearer " + data.token;
  },
  getAuthData () {
    return window.localStorage.getItem("lbUser");
  }
};
