<template>
  <v-app>
    <AppBar @closeAuthorizationWindow="closeAuthorizationWindow" @openAuthorizationWindow="openAuthorizationWindow">
    </AppBar>
    <v-main>
      <router-view/>
      <v-dialog v-model="isAuthorizationWindowOpened" width="398" style="z-index: 1">
        <div class="authorization-window">
          <div>
            <div> Добро пожаловать!</div>
          </div>
          <div>Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через Вконтакте.</div>
          <logo-red class="red-logo"></logo-red>
          <v-btn
              color="#4E7AEC"
              @click="isAuthorizationWindowOpened = false"
              class="rounded-lg"
              max-height="3em"
              block>
            Войти через VK
          </v-btn>
        </div>
        <!--          <v-row align="center" justify="center" class="width ">-->
        <!--            <v-col cols="4" class="height">-->
        <!--              <div class="d-flex justify-space-between flex-column white height rounded-lg ">-->
        <!--                <div class="black&#45;&#45;text mx-4 text-h6 pa-2"> Добро пожаловать!</div>-->
        <!--                <div class="black&#45;&#45;text mx-4 pa-0">Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь-->
        <!--                  через Вконтакте.-->
        <!--                </div>-->
        <!--                <logo-red class="pos"></logo-red>-->
        <!--                <v-btn-->
        <!--                    color="#4E7AEC"-->
        <!--                    @click="isAuthorizationWindowOpened = false"-->
        <!--                    class="rounded-lg"-->
        <!--                    max-height="3em"-->
        <!--                    block-->
        <!--                >-->
        <!--                  Войти через VK-->
        <!--                </v-btn>-->
        <!--              </div>-->
        <!--            </v-col>-->
        <!--          </v-row>-->
      </v-dialog>


    </v-main>
  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar.vue";
import LogoRed from "@/components/LogoRed";

export default {
  name: 'App',
  components: {LogoRed, AppBar},

  data: () => ({
    isAuthorizationWindowOpened: false,
    overlay: true
    //
  }),
  methods: {
    closeAuthorizationWindow() {
      this.isAuthorizationWindowOpened = false
    },
    openAuthorizationWindow() {
      this.isAuthorizationWindowOpened = true
    }
  }
};
</script>
<style lang="scss">

.authorization-window {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: white;

  .red-logo {
    width: 77.9px * 4;
    height: 42.94px * 4;
  }
}
</style>