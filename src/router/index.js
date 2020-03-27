import Vue from "vue";
import VueRouter from "vue-router";
import About from "../views/About.vue";

// SysAdmin Component
import SysAdminLogin from "../views/login/SysAdminLogin";
import SysAdminLayout from "../views/layout/sysadmin/SysAdminLayout";
import SysAdmins from "../components/sysadmin//sysadmins/Admin";

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
  },
  {
    path: "/sysadmin/main",
    name: "sysadminlayout",
    component: SysAdminLayout,
    meta: {
      level: 0,
      text: "Sys Admin",
      requiredAuth: true,
      adminAuth: false,
      sysadminAuth: true,
      personnelAuth: false
    },
    children: [
      {
        path: "/sysadmin/admin",
        component: SysAdmins,
        name: "sys-admin-admins",
        meta: {
          text: "Admin",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: true,
          personnelAuth: false
        }
      }
    ]
  },
  {
    // route level code-splitting
    // this generates a separate chunk (404.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    path: "*",
    component: () => import("../views/404.vue")
  }
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
