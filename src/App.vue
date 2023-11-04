<template>
  <div id="app">
    <div>{{ users }}</div>
  </div>
</template>

<script>

export default {
  data: () => ({
    users: ''
  }),
  async mounted() {
    await this.getUsers();
  },
  methods: {
    async getUsers() {
      const response = await fetch("https://localhost:7012/users");
      this.users = await response.json();
    }
  },
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
