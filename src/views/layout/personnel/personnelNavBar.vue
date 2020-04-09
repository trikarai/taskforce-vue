<template>
  <nav>
    <v-app-bar text app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase black--text">
        <span class="font-weight-light">TaskForce</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="rightDrawer =! rightDrawer">
        <v-icon>mdi-cogs</v-icon>
      </v-btn>
    </v-app-bar>

    <v-btn text class="mt-2" v-if="$route.meta.level !== 0" @click="$router.go(-1) ">
      <v-icon left>mdi-arrow-left</v-icon>Back
    </v-btn>
    <!-- <p class="ml-3 mb-2">{{$route.name}}</p> -->

    <v-navigation-drawer app v-model="drawer" :mini-variant="miniVariant" color="sidebar">
      <!-- list head-->
      <v-list class="pa-1">
        <v-list-item v-if="miniVariant" @click.stop="miniVariant = !miniVariant">
          <v-list-item-action>
            <v-icon small>mdi-arrow-expand-right</v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <!-- <img src="https://randomuser.me/api/portraits/men/85.jpg" /> -->
            <img src="https://picsum.photos/id/768/85/85" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{user.data.name}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
              <v-icon small>mdi-arrow-collapse-left</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list-group :value="true" no-action>
        <template v-slot:activator>
          <v-list-item-action>
            <v-icon color="#676767">mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">as Supervisor</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item class="ml-1" router :to="{ name: 'personnel-spv-assignmentplans'}">
          <v-list-item-title class="grey--text">Assignment Plan</v-list-item-title>
          <v-list-item-icon>
            <!-- <v-icon>mdi-eye</v-icon> -->
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-navigation-drawer>
    <v-navigation-drawer temporary right v-model="rightDrawer" fixed>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-avatar>
          <v-list-item-content></v-list-item-content>
          <v-list-item-action>
            <v-btn small color="red" @click="logout">
              <span>Sign Out</span>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>Dark Theme</v-list-item-content>
          <v-list-item-action>
            <v-switch color="black" @change="switchTheme"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import auth from "@/config/auth";

export default {
  data() {
    return {
      drawer: true,
      rightDrawer: false,
      miniVariant: false,
      clipped: false,
      fixed: false,
      user: "",
      links: [
        {
          icon: "mdi-view-dashboard",
          text: "Dashboard",
          route: "/tenant/dashboard",
          disabled: true
        }
      ]
    };
  },
  created() {
    this.user = JSON.parse(auth.getAuthData());
  },
  methods: {
    goback: function() {
      this.$router.go(-1);
    },
    switchTheme: function() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    logout: function() {
      localStorage.clear();
      this.$router.replace({ path: "/" });
    }
  }
};
</script>
<style scoped>
</style>
