import Vue from "vue";
import VueRouter from "vue-router";
import About from "../views/About.vue";

import SysAdminLogin from "../views/login/SysAdminLogin";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: About
  },
  {
    path: "/sysadmin",
    name: "sysadminlogin",
    component: SysAdminLogin
  }
  // {
  //   path: "/about",
  //   name: "About",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    const authUser = JSON.parse(window.localStorage.getItem("lbUser"));
    if (authUser.valid_until < Math.round(new Date().getTime() / 1000)) {
      localStorage.clear();
      next("/");
    }
    if (!authUser || !authUser.token) {
      next({ path: "/login" });
    } else if (to.meta.sysadminAuth) {
      const authUser = JSON.parse(window.localStorage.getItem("lbUser"));
      if (authUser.role === "SYSADMIN") {
        next();
      } else {
        next("/sysadmin/main");
      }
    } else if (to.meta.personnelAuth) {
      const authUser = JSON.parse(window.localStorage.getItem("lbUser"));
      if (authUser.role === "PERSONNEL") {
        next();
      } else {
        next("/personnel/main");
      }
    } else if (to.meta.incubateeAuth) {
      const authUser = JSON.parse(window.localStorage.getItem("lbUser"));
      if (authUser.role === "INCUBATEE") {
        next();
      } else {
        next("/incubatee/main");
      }
    }
  } else {
    next();
  }
});

export default router;
