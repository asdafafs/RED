<script>
export default {
  name: 'ActionsCellRenderer',
  data() {
    return {
      data: null,
    };
  },
  beforeMount() {
    this.data = this.params.data;
  },
  methods: {
    editItem() {
      this.params.context.componentParent.editItem(this.data);
    },
    deleteItem() {
      this.params.context.componentParent.deleteItem(this.data);
    }
  }
};
</script>

<template>
  <div class="actions-cell">
    <v-icon small class="mr-2 blue--text" @click="editItem">mdi-pencil</v-icon>
    <v-icon small class="red--text" @click="deleteItem">mdi-delete</v-icon>
  </div>
</template>

<style scoped lang="scss">
.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>