<script>
  import LogoRed from "@/components/LogoRed.vue";

  export default {
    components: {LogoRed},
    data: () => ({
      overlay: true,
    }),
  }
</script>

<template>
 <v-row
    align="center"
    class="ma-4"
    justify="center"
  >

      <v-row justify="center">
        <v-overlay
          v-model="overlay"
          contained
          class="cock"
        >
          <v-row align="center" justify="center">
            <v-col cols="4" >
              <div class = white>
                <div align="center" class="black--text" >Добро пожаловать!</div>
                <div align="center" class="black--text">Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через Вконтакте.</div>
              <LogoRed ></LogoRed>
              <v-btn
                  color="#4E7AEC"
                  @click="overlay = false"
                  block
              >
                Войти через VK
              </v-btn>
              </div>

            </v-col>
          </v-row>

        </v-overlay>
      </v-row>

  </v-row>
</template>

<style scoped>
.cock
{
  backdrop-filter: blur(5px);
}

</style>