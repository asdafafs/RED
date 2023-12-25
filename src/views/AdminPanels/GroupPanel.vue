<template>
  <v-data-table :headers="headers" :search="search" :items="groups" class="elevation-1"
                no-data-text="Нет данных для отображения"
                :footer-props="{
      'items-per-page-text': 'Записей на странице:',
      'items-per-page-all-text': 'Все',
      'page-text': '{0}-{1} из {2}',
      'prev-icon': 'mdi-chevron-left',
      'next-icon': 'mdi-chevron-right',
      'prev-page-text': 'Предыдущая страница',
      'next-page-text': 'Следующая страница',
      'no-data-text': 'Нет данных для отображения'}"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Добавить группу
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.groupId" label="Id группы"></v-text-field>
                    <v-text-field v-model="editedItem.title" label="Название группы"></v-text-field>
                    <v-select
                        v-model="selectedStudents"
                        :items="students"
                        label="Список учеников"
                        multiple
                        hint="Выберите студентов для группы"
                        persistent-hint
                    ></v-select>
                    <v-select
                        v-model="selectedStudents"
                        :items="lessons"
                        label="Добавить курс занятий"
                        multiple
                        hint="Выберите необходимые"
                        persistent-hint
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Отмена
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Сносим?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.title }}</td>
        <td class="text-xs-right">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import GroupsRequest from "@/services/GroupsRequest";
import UsersRequest from "@/services/UsersRequest";

export default {
  data: () => ({
    students: null,
    lessons: null,
    selectedStudents: [],
    groupData: null,
    dialog: false,
    dialogDelete: false,
    search: '',
    headers: [
      {text: 'ID', align: 'start', sortable: false, value: 'groupId'},
      {text: 'Название', align: 'start', sortable: false, value: 'title',},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    groups: [],
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      id: 1,
      title: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новая группа' : 'Редактировать группу';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async getFreeUsers() {
      const user = new UsersRequest();
      await user.getUser().catch(x => console.log(x)).then(x => {
        this.students = x.data
      })
    },

    async getGroups() {
      const groups = new GroupsRequest();
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        this.groupData = x.data
      })
    },

    async postGroups(body) {
      const groups = new GroupsRequest();
      await groups.postGroup(body).catch(x => console.log(x))
    },

    async putGroups(body) {
      const groups = new GroupsRequest();
      await groups.putGroup(body).catch(x => console.log(x))
    },

    async deleteGroups() {
      const groups = new GroupsRequest();
      const deletedItem = {"id": this.deletedIndex}
      await groups.deleteGroup(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      await this.getGroups();
      await this.getFreeUsers()
      this.groups = await this.groupData;
      console.log(this.groups)
    },

    editItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.editedItem = {
        groupId: item.id,
        title: item.title,
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.editedItem = {title: item.title};
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.groups.splice(this.editedIndex, 1);
      await this.deleteGroups()
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {title: ''};
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {name: ''};
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        this.$set(this.groups, this.editedIndex, this.editedItem);
        const body = this.editedItem
        await this.putGroups(body)
        this.close();
      } else {
        this.groups.push(this.editedItem);
        const body = {
          "groupId": this.editedItem.groupId,
          "title": this.editedItem.title,
        }
        await this.postGroups(body)
        this.close();
      }
    },
  },
};
</script>
<style scoped>
</style>