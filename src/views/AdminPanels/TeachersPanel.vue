<script>
import UsersRequest from "@/services/UsersRequest";

export default {
  data: () => ({
    userData: null,
    dialog: false,
    dialogDelete: false,
    headers: [
      {text: 'Имя', align: 'start', sortable: false, value: 'name'},
      {text: 'Фамилия', align: 'start', sortable: false, value: 'surname',},
      {text: 'Отчество', align: 'start', sortable: false, value: 'middleName',},
      {text: 'Группа', align: 'start', sortable: false, value: 'groupId'},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    persons: {},
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      name: '',
      email: ''
    },
    defaultItem: {
      name: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новый элемент' : 'Редактировать элемент';
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
    async getUser() {
      const user = new UsersRequest();
      await user.getUser().catch(x => console.log(x)).then(x => {
        this.userData = x.data
      })
    },

    async postUser(body) {
      const user = new UsersRequest();
      await user.postUser(body).catch(x => console.log(x))

    },

    async putUser(body) {
      const user = new UsersRequest();
      await user.putUser(body).catch(x => console.log(x))
    },

    async deleteUser() {
      const user = new UsersRequest();
      const deletedItem = {"id": this.deletedIndex}
      await user.deleteUser(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      await this.getUser();
      let cal = await this.userData;
      this.persons = cal;
    },

    editItem(item) {
      this.editedIndex = this.persons.students.indexOf(item);
      this.editedItem = {
        studentId: item.id,
        email: item.email,
        phoneNumber: item.phoneNumber,
        name: item.name,
        surname: item.surname,
        middleName: item.middleName,
        groupId: 1,
      };
      console.log(this.editedItem)
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.persons.students.indexOf(item);
      this.editedItem = {name: item.name};
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.persons.students.splice(this.editedIndex, 1);
      await this.deleteUser()
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {name: ''};
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
        this.$set(this.persons.students, this.editedIndex, this.editedItem);
        const body = this.editedItem
        await this.putUser(body)
        this.close();
      }
      else {
        this.persons.students.push(this.editedItem);
        const body = {
          "email": this.editedItem.email,
          "phoneNumber": this.editedItem.phoneNumber,
          "name": this.editedItem.name,
          "surname": this.editedItem.surname,
          "middleName": this.editedItem.middleName,
          "groupId": 1,
        }
        await this.postUser(body)
        this.close();
      }
    },
  },
};

</script>
<template>
  <v-data-table :headers="headers" :items="persons.students" class="elevation-1" no-data-text="Нет данных для отображения"
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
              Новый преподаватель
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Имя" ></v-text-field>
                    <v-text-field v-model="editedItem.surname" label="Фамилия" ></v-text-field>
                    <v-text-field v-model="editedItem.middleName" label="Отчество" ></v-text-field>
                    <v-text-field v-model="editedItem.email" label="email" ></v-text-field>
                    <v-text-field v-model="editedItem.phoneNumber" label="phoneNumber" ></v-text-field>
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
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<style scoped>
</style>