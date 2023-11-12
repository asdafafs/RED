<script>

import LogoRed from "@/components/LogoRed.vue";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {LogoRed},
  data() {
    return {
      isButtonPressed: [false, false, false, false],
      user: "Петров С.А.",
      role: ["Ученик", "Учитель"],
      lastPressedIndex: -1,
      drawer: false,

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
  <div>
  <v-app-bar app density="compact" color="#1e1f22" class = "appbar">
  <v-container  class="pa-0 my-0" fluid v-if = true>
    <v-row no-gutters >
    <v-col cols = 2 >
          <v-container class="pa-0"  fluid style="height: 100%;">
            <v-row  no-gutters  align="center" style="height: 100%;" >
              <v-col cols = 12 class="d-flex justify-center align-center">
                <LogoRed ></LogoRed>
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
                       @click="changeButtonState(0); $router.push('/student').catch(err => {})  "
                       text
                       min-height="3em"
                       color="white"
                       class="pa-0 btn"
                       width="100%"
                >
                    Расписание
                </v-btn>
              </v-col>
              <v-col cols >
                <v-btn :class="{ 'custom-bg': isButtonPressed [1]}"
                       @click="changeButtonState(1)"
                       text
                       min-height="3em"
                       color="white"
                       class="pa-0 btn"
                       width="100%"
                >
                    Запись на экзамен
                </v-btn>
              </v-col>
              <v-col cols = 2 >
                <v-btn :class="{ 'custom-bg': isButtonPressed [2]}"
                       @click="changeButtonState(2)"
                       text
                       min-height="3em"
                       color="white"
                       class="pa-0 btn"
                       width="100%"
                >
                    Лекции
                </v-btn>
              </v-col>
              <v-col cols = 2 v-if="true">
                <v-btn :class="{ 'custom-bg': isButtonPressed [3]}"
                       @click="changeButtonState(3)"
                       text
                       min-height="3em"
                       color="white"
                       class="pa-0 btn"
                       width="100%"
                >
                    Мой план
                </v-btn>
              </v-col>
              <v-spacer cols="1"></v-spacer>
              <v-col cols = 2 v-if="false">
                <v-btn :class="{ 'custom-bg': isButtonPressed [3]}"
                       @click="changeButtonState(3)"
                       text
                       min-height="3em"
                       color="white"
                       class="pa-0 btn2"
                       width="100%"
                       height="100%"
                       thin
                >
                  <span class="mdi mdi-vector-arrange-above"></span>
                  <div class ="d-flex flex-row ">
                    <div>
                      Админпанель
                    </div>
                  </div>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
    </v-col>
    <v-col cols = 2 >
         <v-container class="pa-0" fluid>
            <v-row justify="center" no-gutters align-content="center" class="px-1 my-0">
              <v-col cols = 12>
                <v-btn text min-height="3em" color="white" class="pa-0 btn" block >
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
    <v-container class="pa-0 my-0" fluid v-else>
      <v-row no-gutters >
        <v-col cols = 12 >
          <v-container class="pa-0"  fluid style="height: 100%;">
            <v-row  no-gutters  align="center" style="height: 100%;" >
              <v-col cols="2" class="d-flex justify-center align-center">
                <v-app-bar-nav-icon color="white" variant="text" @click.prevent="drawer = !drawer"></v-app-bar-nav-icon>
              </v-col>

              <v-col cols = 8 class="d-flex justify-center align-center">
                <LogoRed ></LogoRed>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
      <v-navigation-drawer v-model="drawer" :style="{ top: $vuetify.application.bar + 'px', zIndex: 6 }">
        <v-list color = "#1e1f22">
          <v-list-item @click.stop = "drawer = !drawer" ></v-list-item>
          <v-list-item @click.stop="$router.push('/')" class="white--text">
            Расписание
          </v-list-item >
          <v-list-item @click.stop = "$router.push('/')" class="white--text">
            Запись на экзамен
          </v-list-item>
          <v-list-item @click.stop = "$router.push('/')" class="white--text">
            Лекции
          </v-list-item>
          <v-list-item @click.stop = "$router.push('/')" class="white--text">
            Мой план
          </v-list-item>
          <v-list-item @click.stop = "$router.push('/')" class="white--text">
            Мой план
          </v-list-item>
          <v-list-item @click.stop = "$router.push('/')" class="white--text">
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
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  </div>
</template>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 0 !important;
}
.appbar{
  z-index: auto;

}
.custom-bg {
  background-color: #4E7AEC;
  color: #ffffff;
}
.btn {
  text-transform: unset !important;
  font-size: 1.125rem;
}
.btn2 {
  text-transform: unset !important;
  font-size: 1.0rem;
  font-weight: lighter;
}
</style>


