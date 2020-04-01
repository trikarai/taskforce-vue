import Vue from "vue";
import VueRouter from "vue-router";
import About from "../views/About.vue";

// SysAdmin Component
import SysAdminLogin from "../views/login/SysAdminLogin";
import SysAdminLayout from "../views/layout/sysadmin/SysAdminLayout";
import SysAdmins from "../components/sysadmin/sysadmins/Admin";
import SysAccount from "../components/sysadmin/account/Account";
import SysTenants from "../components/sysadmin/tenant/Tenants";

// Tenant Login
import TenantLogin from "../views/login/AdminTenantLogin";
import TenantAdminLayout from "../views/layout/tenant/TenantAdminLayout";
import TenantOrganization from "../components/tenant/organization/Organizations";
import TenantTerritory from "../components/tenant/territory/Territories";
import TenantPersonnel from "../components/tenant/personnel/Personnel";

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
    path: "/login",
    name: "tenantlogin",
    component: TenantLogin
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
          text: "Admins Management",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: true,
          personnelAuth: false
        }
      },
      {
        path: "/sysadmin/account",
        component: SysAccount,
        name: "sys-admin-account",
        meta: {
          text: "My Account",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: true,
          personnelAuth: false
        }
      },
      {
        path: "/sysadmin/tenant",
        component: SysTenants,
        name: "sys-admin-tenant",
        meta: {
          text: "Tenants Management",
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
    path: "/tenant/main",
    name: "tenant-admin-layout",
    component: TenantAdminLayout,
    meta: {
      level: 0,
      text: "Tenant",
      requiredAuth: true,
      adminAuth: true,
      sysadminAuth: false,
      personnelAuth: false
    },
    children: [
      {
        path: "/tenant/organization",
        component: TenantOrganization,
        name: "tenant-admin-organizations",
        meta: {
          text: "Organizations Management",
          level: 0,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/territory",
        component: TenantTerritory,
        name: "tenant-admin-territories",
        meta: {
          text: "Territories Management",
          level: 0,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/personnel",
        component: TenantPersonnel,
        name: "tenant-admin-personnels",
        meta: {
          text: "Personnel Management",
          level: 0,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
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
    } else if (to.meta.adminAuth) {
      const authUser = JSON.parse(window.localStorage.getItem("lbUser"));
      if (authUser.role === "ADMIN") {
        next();
      } else {
        next("/tenant/main");
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
