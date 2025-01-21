<template>
  <div style="width: 100%; height:100%; padding: 0 12px 12px 12px">
      <v-btn-toggle
        v-model="selectedButton"
        mandatory
        group
        color="black"
     >
      <v-btn
          v-for="item in adminPanelButtons"
          :key="item.id"
          height="32"
          class="toggle-button"
          :value="item.id"
          @click="onToggleClick(item.router)"
      >
        <span :class="selectedButton === item.id ? 'white--text' : 'black--text'">
          {{ item.title }}
        </span>
      </v-btn>
      </v-btn-toggle>
    <router-view/>
  </div>
</template>
<script>
export default {
  data: () => ({
    selectedButton: 0
  }),
  methods: {
    onToggleClick(router) {
      this.$router.push(
          {
            name: router
          }
      ).catch(()=> {})
    }
  },
  computed: {
    adminPanelButtons() {
      return [
        {
          id: 0,
          title: 'Студенты',
          router: 'admin-students'
        },
        {
          id: 1,
          title: 'Инструкторы',
          router: 'admin-teachers'
        },
        {
          id: 2,
          title: 'Группы',
          router: 'admin-groups'
        },
      ]
    },
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/styles/buttonStyles.css";
</style>