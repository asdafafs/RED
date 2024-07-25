<script>
import moment from "moment/moment";

export default {
  name: 'DoubleLineCellRenderer',
  data() {
    return {
      value: null,
      date: null,
      time: null
    };
  },
  beforeMount() {
    this.value = this.params.value;
    this.date = moment(this.value).format('DD.MM.YY');
    this.time = moment(this.value).format('HH:mm');
  },
};
</script>

<template>
  <div class="d-flex flex-column" style="height: 100%">
   <div style="height: 50%;line-height: 15px">{{date}}</div>
   <div style="height: 50%;line-height: 15px">{{time}}</div>
  </div>
</template>

<style scoped lang="scss">
</style>