<template>
  <div id="app">

    Пример Devextreme
    <div><DevextremeExample></DevextremeExample></div>

    Пример Jqx
    <div><JqxScheduler></JqxScheduler></div>

    Пример Syncfusion
    <div><SyncfusionScheduler></SyncfusionScheduler></div>
  </div>
</template>
<script>
import DevextremeExample from "@/components/DevextremeExample.vue";
import JqxScheduler from "@/components/JqxScheduler.vue";
import SyncfusionScheduler from "@/components/SyncfusionScheduler.vue";


export default {
  components: {SyncfusionScheduler, JqxScheduler, DevextremeExample, },

//  data: () => ({
//    users: ''
    //  }),
//  async mounted() {
//    await this.getUsers();
//  },
//  methods: {
//    async getUsers() {
//      const response = await fetch("https://localhost:7012/users");
//      this.users = await response.json();
//    }
//  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
