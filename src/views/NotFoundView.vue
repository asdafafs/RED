<template>
  <div style="text-align: center;">
    <h1>Not Found!</h1>
    <p>
      <v-btn @click.stop="$router.push('/')">
        Вернись домой друг
      </v-btn>
    </p>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}

</script>

<style scoped>

center {
  margin: 15vw;
}

h1 {
  color: black;
  font-size: 2em;
}

</style>