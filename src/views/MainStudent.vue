<script setup>

//import TestModule from "@/components/TestModule.vue";
//import CalendarTemplate from "@/components/CalendarTemplate.vue";
//import TestSheet from "@/components/TestSheet.vue";
</script>

<template>
  <v-container class="bg-surface-variant px-0 ma-0" fluid>
    <v-row no-gutters >
      <v-col cols="12" class="px-0 ma-0">
        <div class = "test1">1</div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="pa-0">
        <div class = "test2">1</div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="pa-0">
        <div class = "test3">1</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.test1
{
  background-color: rgba(0, 0, 0, 0.32);
}
.test2
{
  background-color: rgba(255, 0, 0, 0.32);
}
.test3
{
  background-color: rgb(22, 7, 246, 0.32);
}
</style>