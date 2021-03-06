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
import TenantOrganizationFieldWorker from "../components/tenant/organization/fieldworker/FieldWorkers";
import TenantOrganizationSupervisor from "../components/tenant/organization/supervisor/Supervisor";

import TenantTerritory from "../components/tenant/territory/Territories";
import TenantTerritoryClient from "../components/tenant/territory/client/Client";
import TenantTerritoryOrganizer from "../components/tenant/territory/organizer/Organizer";
import TenantPersonnel from "../components/tenant/personnel/Personnel";

import TenantAssignmentForm from "../components/tenant/form/AssignmentForms";
import TenantAssignmentFormBuild from "../components/tenant/form/buildAssignmentForm";
import TenantAssignmentFormPreview from "../components/formModule/builder/formPreview";

import TenantStatisticOperations from "../components/tenant/statistic/StatisticOperations";
import TenantStatisticOperationCreate from "../components/tenant/statistic/createStatistic";
import TenantStatisticOperationDetail from "../components/tenant/statistic/StatisticDetail";

// Personnel Login
import PersonnelLogin from "../views/login/PersonnelLogin";
import PersonnelLayout from "../views/layout/personnel/PersonnelLayout";
// Personnel (SPV) Summary & Report
import PersonnelSupervisorCanvassSummary from "../components/personnel/asSupervisor/summary/CanvassSummary";
import PersonnelSupervisorCanvassReport from "../components/personnel/asSupervisor/report/CanvassReport";
// Personnel (SPV) Statistic Operation
import PersonnelSupervisorStatisticOperation from "../components/personnel/asSupervisor/statistic/Operation";
import PersonnelSupervisorStatisticOperationDetail from "../components/personnel/asSupervisor/statistic/StatisticDetail";
import PersonnelSupervisorStatisticOperationReport from "../components/personnel/asSupervisor/statistic/Reports";
// Personnel (SPV) Assigment Plan
import PersonnelSupervisorAssigmentPlans from "../components/personnel/asSupervisor/AssignmentPlans";
import PersonnelSupervisorAssigmentPlanCreate from "../components/personnel/asSupervisor/createAssignmentPlan";
import PersonnelSupervisorAssigmentPlanCanvassers from "../components/personnel/asSupervisor/canvasser/Canvassers";
import PersonnelSupervisorAssigmentPlanTarget from "../components/personnel/asSupervisor/target/Target";
import PersonnelSupervisorAssigmentPlanCanvasserTargets from "../components/personnel/asSupervisor/canvasser/target/Target";
import PersonnelSupervisorAssigmentPlanCanvasserTargetAssignments from "../components/personnel/asSupervisor/canvasser/target/assignment/Assignments";
// Personnal (FW) Canvass Assigments
import PersonnelFieldWorkerCanvassAssigments from "../components/personnel/asFieldWorker/Assignments";
import PersonnelFieldWorkerCanvassAssigmentReports from "../components/personnel/asFieldWorker/report/Reports";
import PersonnelFieldWorkerCanvassAssigmentReportDetail from "../components/personnel/asFieldWorker/report/Report";
import PersonnelFieldWorkerAssigmentReportsForm from "../components/personnel/asFieldWorker/report/AssignmentForm";

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
    path: "/tenant",
    name: "tenantlogin",
    component: TenantLogin
  },
  {
    path: "/login",
    name: "personnellogin",
    component: PersonnelLogin
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
        path: "/tenant/organization/:organizationId/fieldworker",
        component: TenantOrganizationFieldWorker,
        name: "tenant-admin-organizations-fieldworkers",
        meta: {
          text: "Field Workers Management",
          level: 1,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/organization/:organizationId/supervisors",
        component: TenantOrganizationSupervisor,
        name: "tenant-admin-organizations-supervisors",
        meta: {
          text: "Supervisors Management",
          level: 1,
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
        path: "/tenant/territory/:territoryId/client",
        component: TenantTerritoryClient,
        name: "tenant-admin-territories-clients",
        meta: {
          text: "Clients Management",
          level: 1,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/territory/:territoryId/organizer",
        component: TenantTerritoryOrganizer,
        name: "tenant-admin-territories-organizers",
        meta: {
          text: "Organizers Management",
          level: 1,
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
      },
      {
        path: "/tenant/statistic-operation",
        component: TenantStatisticOperations,
        name: "tenant-statistic-operations",
        meta: {
          text: "Statistic Operation",
          level: 0,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/statistic-operation-create",
        component: TenantStatisticOperationCreate,
        name: "tenant-statistic-operations-create",
        meta: {
          text: "Create Statistic Operation Formula",
          level: 1,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/statistic-operation/:statisticId",
        component: TenantStatisticOperationDetail,
        name: "tenant-statistic-operations-detail",
        meta: {
          text: "Statistic Operation Formula Detail",
          level: 2,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/assignment-form",
        component: TenantAssignmentForm,
        name: "tenant-admin-forms",
        meta: {
          text: "Assignment Forms Management",
          level: 0,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/assignment-form/build",
        component: TenantAssignmentFormBuild,
        name: "tenant-admin-forms-build",
        meta: {
          text: "Create Assignment Form",
          level: 1,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/assignment-form/:formId/edit",
        component: TenantAssignmentFormBuild,
        name: "tenant-admin-forms-edit",
        meta: {
          text: "Edit Assignment Form",
          level: 1,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      },
      {
        path: "/tenant/assignment-form/view/:formId",
        component: TenantAssignmentFormPreview,
        name: "tenant-admin-forms-preview",
        meta: {
          text: "Assignment Form Preview",
          level: 1,
          requiredAuth: true,
          adminAuth: true,
          sysadminAuth: false,
          personnelAuth: false
        }
      }
    ]
  },
  {
    path: "/personnel/main",
    name: "personnellayout",
    component: PersonnelLayout,
    meta: {
      level: 0,
      text: "Personnel",
      requiredAuth: true,
      adminAuth: false,
      sysadminAuth: false,
      personnelAuth: true
    },
    children: [
      {
        path: "/personnel/supervisor/canvass-summary",
        component: PersonnelSupervisorCanvassSummary,
        name: "personnel-spv-canvass-summary",
        meta: {
          text: "Canvass Summary",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/canvass-report",
        component: PersonnelSupervisorCanvassReport,
        name: "personnel-spv-canvass-report",
        meta: {
          text: "Canvass Report",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/statistic-operation",
        component: PersonnelSupervisorStatisticOperation,
        name: "personnel-spv-statistic-ops",
        meta: {
          text: "Statistic Operation",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/statistic-operation/:statisticId",
        component: PersonnelSupervisorStatisticOperationDetail,
        name: "personnel-spv-statistic-ops-detail",
        meta: {
          text: "Statistic Operation Detail",
          level: 1,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/statistic-operation/report/:statisticId",
        component: PersonnelSupervisorStatisticOperationReport,
        name: "personnel-spv-statistic-ops-report",
        meta: {
          text: "Statistic Operation Report",
          level: 1,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/assignment-plan",
        component: PersonnelSupervisorAssigmentPlans,
        name: "personnel-spv-assignmentplans",
        meta: {
          text: "Assignment Plans",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/assignment-plan/create",
        component: PersonnelSupervisorAssigmentPlanCreate,
        name: "personnel-spv-assignmentplans-create",
        meta: {
          text: "Create Assignment Plans",
          level: 2,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/assignment-plan/:planId/target",
        component: PersonnelSupervisorAssigmentPlanTarget,
        name: "personnel-spv-assignmentplans-targets",
        meta: {
          text: "Assignment Plan's Target ",
          level: 3,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/supervisor/assignment-plan/:planId/canvasser",
        component: PersonnelSupervisorAssigmentPlanCanvassers,
        name: "personnel-spv-assignmentplans-canvassers",
        meta: {
          text: "Assignment Plan's Canvassers ",
          level: 3,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path:
          "/personnel/supervisor/assignment-plan/:planId/canvasser/:canvasserId/canvass-target",
        component: PersonnelSupervisorAssigmentPlanCanvasserTargets,
        name: "personnel-spv-assignmentplans-canvasstarget",
        meta: {
          text: "Canvasser's Canvas Target ",
          level: 4,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path:
          "/personnel/supervisor/assignment-plan/:planId/canvasser/:canvasserId/survey-target",
        component: PersonnelSupervisorAssigmentPlanCanvasserTargets,
        name: "personnel-spv-assignmentplans-surveytarget",
        meta: {
          text: "Canvasser's Survey Target ",
          level: 4,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path:
          "/personnel/supervisor/assignment-plan/:planId/canvasser/:canvasserId/survey-target/:targetId/assignment",
        component: PersonnelSupervisorAssigmentPlanCanvasserTargetAssignments,
        name: "personnel-spv-assignmentplans-surveytarget-assignments",
        meta: {
          text: "Canvasser's Survey Target Assignments",
          level: 5,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path:
          "/personnel/supervisor/assignment-plan/:planId/canvasser/:canvasserId/canvass-target/:targetId/assignment",
        component: PersonnelSupervisorAssigmentPlanCanvasserTargetAssignments,
        name: "personnel-spv-assignmentplans-canvasstarget-assignments",
        meta: {
          text: "Canvasser's Canvass Target Assignments",
          level: 5,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/fieldworker/canvass-assignment",
        component: PersonnelFieldWorkerCanvassAssigments,
        name: "personnel-fw-canvass-assignments",
        meta: {
          text: "Canvass Assignments",
          level: 0,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path: "/personnel/fieldworker/canvass-assignment/:assignmentId/report",
        component: PersonnelFieldWorkerCanvassAssigmentReports,
        name: "personnel-fw-canvass-assignments-reports",
        meta: {
          text: "Canvass Assignments Report",
          level: 1,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path:
          "/personnel/fieldworker/canvass-assignment/:assignmentId/report/:reportId",
        component: PersonnelFieldWorkerCanvassAssigmentReportDetail,
        name: "personnel-fw-canvass-assignments-report-detail",
        meta: {
          text: "Canvass Assignments Report",
          level: 2,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
        }
      },
      {
        path:
          "/personnel/fieldworker/canvass-assignment/:assignmentId/report/form",
        component: PersonnelFieldWorkerAssigmentReportsForm,
        name: "personnel-fw-canvass-assignments-reports-form",
        meta: {
          text: "Canvass Assignments Report Form",
          level: 2,
          requiredAuth: true,
          adminAuth: false,
          sysadminAuth: false,
          personnelAuth: true
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
    }
  } else {
    next();
  }
});

export default router;
