<script>

import LogoRed from "@/components/LogoRed.vue";

export default {
  components: {LogoRed},
  data() {
    return {
      isButtonPressed: [false, false, false, false],
      user: "Петров С.А.",
      role: ["Ученик", "Учитель"],
      lastPressedIndex: -1,
    }
  },
   methods: {
    changeButtonState(index) {
     if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }

      this.$set(this.isButtonPressed, index, true);

      this.lastPressedIndex = index;
    },
  },
  }
</script>

<template>
  <v-app-bar app density="compact" color="#1e1f22" class = "appbar">
  <v-container  class="pa-0 my-0" fluid>
    <v-row align="start" no-gutters>
    <v-col cols = 2 >
          <v-container class="pa-0" fill-height >
            <v-row  no-gutters align-content="center"  justify="center">
              <v-col cols = 12 class="d-flex justify-center align-center">
                <LogoRed class = "view"></LogoRed>
              </v-col>
            </v-row>
          </v-container>
    </v-col>
    <v-col>
          <v-container class="pa-0">
            <v-row  no-gutters  class="my-0 ga-3" align-content="center"  justify="center">
              <v-spacer cols="1"></v-spacer>
              <v-col cols = 2 >
                <v-btn :class="{ 'custom-bg': isButtonPressed[0] }"
                       @click="changeButtonState(0)"
                       text min-height="3em"
                       class="pa-0 white--text"
                       width="100%"
                >
                    Расписание
                </v-btn>
              </v-col>
              <v-col cols >
                <v-btn :class="{ 'custom-bg': isButtonPressed [1]}"
                       @click="changeButtonState(1)"
                       text min-height="3em"
                       color="white"
                       class="pa-0"
                       width="100%"
                >
                    Запись на экзамен
                </v-btn>
              </v-col>
              <v-col cols = 2 >
                <v-btn :class="{ 'custom-bg': isButtonPressed [2]}"
                       @click="changeButtonState(2)"
                       text min-height="3em"
                       color="white"
                       class="pa-0"
                       width="100%"
                >
                    Лекции
                </v-btn>
              </v-col>
              <v-col cols = 2 >
                <v-btn :class="{ 'custom-bg': isButtonPressed [3]}"
                       @click="changeButtonState(3)"
                       text min-height="3em"
                       color="white"
                       class="pa-0"
                       width="100%"
                >
                    Мой план
                </v-btn>
              </v-col>
              <v-spacer cols="1"></v-spacer>
            </v-row>
          </v-container>
    </v-col>
    <v-col cols = 2 >
         <v-container class="pa-0" fluid>
            <v-row justify="center" no-gutters align-content="center" class="px-1 my-0">
              <v-col cols = 12>
                <v-btn text min-height="3em" color="white" class="pa-0" block>
                    <div class ="d-flex flex-column">
                      <div>
                        <span class="mdi mdi-account-outline"></span>
                        {{user}}
                      </div>
                      <div style="text-align: left;">
                        {{role[0]}}
                      </div>
                    </div>
                  <span class="mdi mdi-login" style="transform: scale(1.5)"></span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
    </v-col>
    </v-row>
  </v-container>
  </v-app-bar>
</template>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 0 !important;
}
.appbar{
  z-index: auto;

}
.view
{
  height: inherit;
}
.custom-bg {
  background-color: #4E7AEC;
  color: #ffffff;
}
</style>

