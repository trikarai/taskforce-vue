<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-select
          :items="organizations.list"
          item-text="organization.name"
          v-model="selectedOrganization"
          :hint="selectedOrganization.name"
          persistent-hint
          label="Assigned Organization"
          outlined
          return-object
          @change="mutateOrganization"
        ></v-select>
        <v-alert
          v-if="organizations.total === 0"
          type="warning"
          :value="true"
        >No Supervisor Role Assigned to your account</v-alert>
      </v-col>
    </v-row>
    <v-row v-show="organizations.total !== 0">
      <v-col cols="12" lg="4" v-if="summaryToday !== null">
        <v-card elevation="5" :loading="loadingToday">
          <v-card-title primary-title>Today</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="4">
                {{summaryToday[0].parameter}} :
                {{summaryToday[0].result}}
              </v-col>
              <v-col cols="12" lg="4">
                {{summaryToday[1].parameter}} :
                {{summaryToday[1].result}}
              </v-col>
              <v-col cols="12" lg="4">
                <v-progress-circular
                  :indeterminate="loadingToday"
                  :value="getPercentage(summaryToday[0].result, summaryToday[1].result)"
                  size="70"
                  width="6"
                  color="primary"
                >{{getPercentage(summaryToday[0].result, summaryToday[1].result)}} %</v-progress-circular>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn small color="primary" @click="viewSummaryList('today')">
              <v-icon small left>mdi-monitor-eye</v-icon>View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" v-else>
        <v-card :loading="loadingToday">
          <v-card-title>Failed Get Today Summary</v-card-title>
          <v-card-text auto-height>server error</v-card-text>
          <v-card-actions>
            <v-btn small color="error" @click="reloadSummary('today')">
              <v-icon small left>mdi-refresh</v-icon>reload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" v-if="summaryWeek !== null">
        <v-card elevation="5" :loading="loadingWeek">
          <v-card-title primary-title>This Week</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="4">
                {{summaryWeek[0].parameter}} :
                {{summaryWeek[0].result}}
              </v-col>
              <v-col cols="12" lg="4">
                {{summaryWeek[1].parameter}} :
                {{summaryWeek[1].result}}
              </v-col>
              <v-col cols="12" lg="4">
                <v-progress-circular
                  :indeterminate="loadingWeek"
                  :value="getPercentage(summaryWeek[0].result, summaryWeek[1].result)"
                  size="70"
                  width="6"
                  color="primary"
                >{{getPercentage(summaryWeek[0].result, summaryWeek[1].result)}} %</v-progress-circular>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn small color="primary" @click="viewSummaryList('week')">
              <v-icon small left>mdi-monitor-eye</v-icon>View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" v-else>
        <v-card :loading="loadingWeek">
          <v-card-title>Failed Get Week Summary</v-card-title>
          <v-card-text>server error</v-card-text>
          <v-card-actions>
            <v-btn small color="error" @click="reloadSummary('week')">
              <v-icon small left>mdi-refresh</v-icon>reload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" v-if="summaryMonth !== null">
        <v-card elevation="5" :loading="loadingMonth">
          <v-card-title primary-title>This Month</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="4">
                {{summaryMonth[0].parameter}} :
                {{summaryMonth[0].result}}
              </v-col>
              <v-col cols="12" lg="4">
                {{summaryMonth[1].parameter}} :
                {{summaryMonth[1].result}}
              </v-col>
              <v-col cols="12" lg="4">
                <v-progress-circular
                  :indeterminate="loadingMonth"
                  :value="getPercentage(summaryMonth[0].result, summaryMonth[1].result)"
                  size="70"
                  width="6"
                  color="primary"
                >{{getPercentage(summaryMonth[0].result, summaryMonth[1].result)}} %</v-progress-circular>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn small color="primary" @click="viewSummaryList('month')">
              <v-icon small left>mdi-monitor-eye</v-icon>View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" v-else>
        <v-card :loading="loadingMonth">
          <v-card-title>Failed Get Month Summary</v-card-title>
          <v-card-text>server error</v-card-text>
          <v-card-actions>
            <v-btn small color="error" @click="reloadSummary('month')">
              <v-icon small left>mdi-refresh</v-icon>reload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="organizations.total !== 0">
      <v-col cols="12" lg="12" md="12">
        <v-card elevation="3" min-height="500">
          <v-tabs v-model="tab" color="primary" background-color="accent" slider-color="primary">
            <v-tab key="tab-1">Complete</v-tab>
            <v-tab key="tab-2">Incomplete</v-tab>
            <v-tabs-items v-model="tab">
              <v-tab-item key="tab-1">
                <v-skeleton-loader v-if="loadingSummaryList" type="table" />
                <v-alert
                  v-if="summaryComplete.total === 0"
                  class="ma-3"
                  type="info"
                  :value="true"
                >No Data Complete Summary Found</v-alert>
                <completion-table v-else :data.sync="summaryComplete.list" />
              </v-tab-item>
              <v-tab-item key="tab-2">
                <v-skeleton-loader v-if="loadingSummaryList" type="table" />
                <v-alert
                  v-if="summaryIncomplete.total === 0"
                  class="ma-3"
                  type="info"
                  :value="true"
                >No Data InCompletion Summary Found</v-alert>
                <completion-table v-else :data.sync="summaryIncomplete.list" />
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import CompletionTable from "./CompletionTable";

export default {
  data() {
    return {
      tab: "",
      loadingOrganization: false,
      organizations: {
        total: 0,
        list: []
      },
      selectedOrganization: {
        id: "",
        name: "",
        organization: { name: "", id: "" }
      },
      loadingToday: false,
      summaryToday: [
        {
          parameter: "completed assignment",
          result: "0"
        },
        {
          parameter: "total assignment",
          result: "0"
        }
      ],
      loadingWeek: false,
      summaryWeek: [
        {
          parameter: "completed assignment",
          result: "0"
        },
        {
          parameter: "total assignment",
          result: "0"
        }
      ],
      loadingMonth: false,
      summaryMonth: [
        {
          parameter: "completed assignment",
          result: "0"
        },
        {
          parameter: "total assignment",
          result: "0"
        }
      ],
      summaryComplete: {
        total: 0,
        list: [
          {
            id: "xxx",
            startDate: "21-10-2020",
            endDate: "22-11-2020",
            completed: true
          }
        ]
      },
      summaryIncomplete: {
        total: 1,
        list: [
          // {
          //   id: "xxx",
          //   startDate: "21-10-2020",
          //   endDate: "22-11-2020",
          //   completed: false
          // }
        ]
      },
      loadingSummaryList: false,
      query: {
        completeStatus: null,
        startDateRangeBegin: "",
        startDateRangeFinish: "",
        endDateRangeBegin: "",
        endDateRangeFinish: ""
      }
    };
  },
  components: {
    CompletionTable
  },
  watch: {
    selectedOrganization() {
      this.getSummaryAll();
    }
  },
  mounted() {
    this.getOrganization();
    if (this.selectedOrganization.organization.id !== "") {
      this.getSummaryAll();
    }
  },
  computed: {},
  methods: {
    useNull() {
      return null;
    },
    getSummaryAll() {
      this.axios
        .all([
          this.getCanvassAssigmentSummaryToday().catch(() => {
            return null;
          }),
          this.getCanvassAssigmentSummaryWeek().catch(() => {
            return null;
          }),
          this.getCanvassAssigmentSummaryMonth().catch(() => {
            return null;
          })
        ])
        .then(
          this.axios.spread((today, week, month) => {
            if (today !== null) {
              this.summaryToday = today.data.data;
            } else {
              this.summaryToday = today;
            }
            if (week !== null) {
              this.summaryWeek = week.data.data;
            } else {
              this.summaryWeek = week;
            }
            if (month !== null) {
              this.summaryMonth = month.data.data;
            } else {
              this.summaryMonth = month;
            }
          })
        )
        .finally(() => {
          this.loadingToday = false;
          this.loadingWeek = false;
          this.loadingMonth = false;
        });
    },
    reloadSummary(type) {
      switch (type) {
        case "today":
          this.getCanvassAssigmentSummaryToday()
            .then(res => {
              this.summaryToday = res.data.data;
            })
            .catch(() => {
              this.summaryToday = null;
            })
            .finally(() => {
              this.loadingToday = false;
            });
          break;
        case "week":
          this.getCanvassAssigmentSummaryWeek()
            .then(res => {
              this.summaryWeek = res.data.data;
            })
            .catch(() => {
              this.summaryWeek = null;
            })
            .finally(() => {
              this.loadingWeek = false;
            });
          break;
        case "month":
          this.getCanvassAssigmentSummaryMonth()
            .then(res => {
              this.summaryMonth = res.data.data;
            })
            .catch(() => {
              this.summaryMonth = null;
            })
            .finally(() => {
              this.loadingMonth = false;
            });
          break;
      }
    },
    viewSummaryList(type) {
      var today = this.$moment().format("YYYY-MM-D");
      var startOfThisWeek = this.$moment()
        .startOf("week")
        .format("YYYY-MM-D");
      var endOfThisWeek = this.$moment()
        .endOf("week")
        .format("YYYY-MM-D");
      var startOfThisMonth = this.$moment()
        .startOf("month")
        .format("YYYY-MM-D");
      var endOfThisMonth = this.$moment()
        .endOf("month")
        .format("YYYY-MM-D");

      switch (type) {
        case "today":
          this.query.startDateRangeBegin = today;
          this.query.startDateRangeFinish = today;
          this.query.endDateRangeBegin = today;
          this.query.endDateRangeFinish = today;

          this.getAllSummaryList();
          break;
        case "week":
          this.query.startDateRangeBegin = startOfThisWeek;
          this.query.startDateRangeFinish = today;
          this.query.endDateRangeBegin = today;
          this.query.endDateRangeFinish = endOfThisWeek;
          this.getAllSummaryList();
          break;
        case "month":
          this.query.startDateRangeBegin = startOfThisMonth;
          this.query.startDateRangeFinish = today;
          this.query.endDateRangeBegin = today;
          this.query.endDateRangeFinish = endOfThisMonth;
          this.getAllSummaryList();
          break;
      }
    },
    getAllSummaryList() {
      this.loadingSummaryList = true;
      this.axios
        .all([
          this.getCompletion().catch(() => {
            return null;
          }),
          this.getInCompletion().catch(() => {
            return null;
          })
        ])
        .then(
          this.axios.spread((complete, incomplete) => {
            if (complete !== null) {
              this.summaryComplete = complete.data.data;
            } else {
              this.summaryComplete = { total: 0 };
            }
            if (incomplete !== null) {
              this.summaryIncomplete = incomplete.data.data;
            } else {
              this.summaryIncomplete = { total: 0 };
            }
          })
        )
        .finally(() => {
          this.loadingSummaryList = false;
        });
    },
    getCompletion() {
      const query = JSON.parse(JSON.stringify(this.query));
      query.completeStatus = 1;
      return this.axios.get(
        config.baseUri.api +
          "/personnel/as-supervisor/" +
          this.selectedOrganization.organization.id +
          "/canvass-assignments",
        { headers: auth.getAuthHeader(), params: query }
      );
    },
    getInCompletion() {
      const query = JSON.parse(JSON.stringify(this.query));
      query.completeStatus = 0;
      return this.axios.get(
        config.baseUri.api +
          "/personnel/as-supervisor/" +
          this.selectedOrganization.organization.id +
          "/canvass-assignments",
        { headers: auth.getAuthHeader(), params: query }
      );
    },
    getPercentage(partialValue, totalValue) {
      if (parseInt(totalValue) === 0) {
        return 0;
      } else {
        return (100 * parseInt(partialValue)) / parseInt(totalValue);
      }
    },
    getOrganization() {
      this.dialog = false;
      this.loadingOrganization = true;
      this.axios
        .get(config.baseUri.api + "/personnel/assigned-supervisors", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.organizations = res.data.data;
          this.selectedOrganization = this.organizations.list[0];
          this.$store.commit(
            "setOrganizationId",
            this.selectedOrganization.organization.id
          );
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingOrganization = false;
        });
    },
    mutateOrganization() {
      this.$store.commit(
        "setOrganizationId",
        this.selectedOrganization.organization.id
      );
    },
    getCanvassAssigmentSummaryToday() {
      this.loadingToday = true;
      const today = this.$moment().format("YYYY-MM-D");
      const query = {
        startDateRangeBegin: today,
        startDateRangeFinish: today,
        endDateRangeBegin: today,
        endDateRangeFinish: today
      };
      return this.axios.get(
        config.baseUri.api +
          "/personnel/as-supervisor/" +
          this.selectedOrganization.organization.id +
          "/canvass-assignments/summary",
        { headers: auth.getAuthHeader(), params: query }
      );
    },
    getCanvassAssigmentSummaryWeek() {
      this.loadingWeek = true;
      const today = new Date().toISOString().split("T")[0];
      const startOfThisWeek = this.$moment()
        .startOf("week")
        .format("YYYY-MM-D");
      const endOfThisWeek = this.$moment()
        .endOf("week")
        .format("YYYY-MM-D");

      const query = {
        startDateRangeBegin: startOfThisWeek,
        startDateRangeFinish: today,
        endDateRangeBegin: today,
        endDateRangeFinish: endOfThisWeek
      };

      return this.axios.get(
        config.baseUri.api +
          "/personnel/as-supervisor/" +
          this.selectedOrganization.organization.id +
          "/canvass-assignments/summary",
        { headers: auth.getAuthHeader(), params: query }
      );
    },
    getCanvassAssigmentSummaryMonth() {
      this.loadingMonth = true;
      const today = this.$moment().format("YYYY-MM-D");
      const startOfThisMonth = this.$moment()
        .startOf("month")
        .format("YYYY-MM-D");
      const endOfThisMonth = this.$moment()
        .endOf("month")
        .format("YYYY-MM-D");

      const query = {
        startDateRangeBegin: startOfThisMonth,
        startDateRangeFinish: today,
        endDateRangeBegin: today,
        endDateRangeFinish: endOfThisMonth
      };

      return this.axios.get(
        config.baseUri.api +
          "/personnel/as-supervisor/" +
          this.selectedOrganization.organization.id +
          "/canvass-assignments/summary",
        { headers: auth.getAuthHeader(), params: query }
      );
    }
  }
};
</script>

<style>
</style>
