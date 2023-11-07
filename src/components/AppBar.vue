<script>

export default {

  data() {
    return {
      drawer: false
    }
  }
  }

</script>

<template>
  <div id = "header">
    <v-container
      class="header"
    >
      <v-overlay :value="drawer" z-index="4">
      </v-overlay>
      <v-navigation-drawer v-model="drawer" app clipped hide-overlay :style="{ top: $vuetify.application.top + 'px', zIndex: 6 }">
        <v-list dense>
          <v-list-item @click.stop="$router.push('/student')">
            Кабинет ученика
          </v-list-item>
          <v-list-item @click.stop = "$router.push('/instructor')">
            Кабинет инструктора
          </v-list-item>
          <v-list-item @click.stop = "$router.push('/admin')">
            Админская панель
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

    <v-app-bar app clipped-left dark color="red">
      <v-app-bar-nav-icon @click.prevent="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Test</v-toolbar-title>
    </v-app-bar>
    </v-container>
  </div>
</template>

<style scoped>

</style>