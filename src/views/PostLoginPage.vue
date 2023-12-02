<script>
import TestService from "@/services/TestService";

export default {
  name: "PostLogin",
  created() {
    console.log('here')
  },
  async mounted() {
    const testService = new TestService()
    await testService.getTest()
        .then(x => console.log(x))
    await testService.getTestException()
        .then(x => console.log(x))
  }
}
</script>

<template>
<div></div>
</template>

<style scoped>

</style>