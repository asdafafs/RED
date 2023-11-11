<template>
  <v-app-bar app density="compact" color="#1e1f22" class="appbar">
    <v-container class="pa-0 my-0" fluid>
      <v-row align="start" no-gutters>
        <v-col cols=2>
          <v-container class="pa-0" fill-height>
            <v-row no-gutters align-content="center" justify="center">
              <v-col cols=12 class="d-flex justify-center align-center">
                <LogoRed class="view"></LogoRed>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col>
          <v-container class="pa-0">
            <v-row justify="center" no-gutters align-content="center" class="my-0 ga-3">
              <v-col cols=2>
                <v-btn text min-height="3em" color="white" class="pa-0 fixed" block>
                  <span class="text-body-1">
                    Расписание
                  </span>
                </v-btn>
              </v-col>
              <v-col cols=2>
                <v-btn text min-height="3em" color="white" class="pa-0 fixed" block>
                  <span class="text-body-1">
                    Запись на экзамен
                  </span>
                </v-btn>
              </v-col>
              <v-col cols=2>
                <v-btn text min-height="3em" color="white" class="pa-0 fixed" block>
                  <span class="text-body-1">
                    Лекции
                  </span>
                </v-btn>
              </v-col>
              <v-col cols=2>
                <v-btn text min-height="3em" color="white " class="pa-0 fixed" block>
                  <span class="text-body-1">
                    Мой план
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

        </v-col>
        <v-col cols=2>
          <v-container class="pa-0" fluid>
            <v-row justify="center" no-gutters align-content="center" class="px-1 my-0">
              <v-col cols=12>
                <v-btn text min-height="3em" color="white" class="pa-0" block @click="openAuthorizationWindow">
                  <span class="text-body-1">
                    Кабинет
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>

import LogoRed from "@/components/LogoRed.vue";

export default {
  components: {LogoRed},

  methods: {
    closeAuthorizationWindow() {
      this.$emit('closeAuthorizationWindow')
    },
    openAuthorizationWindow() {
      this.$emit('openAuthorizationWindow')
    }
  },

  data() {
    return {}
  }
}

</script>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 0 !important;
}

.appbar {
  z-index: auto;

}

.view {
  height: inherit;
}
</style>

