<template>
  <v-card>
    <v-text-field
        v-model="search"
        label="Поиск"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        hide-details
    ></v-text-field>
    <v-data-table
        :headers="headers"
        :items="persons.activeUsers"
        :search="search"
        class="elevation-1"
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
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedTeacher.name" label="Имя"></v-text-field>
                      <v-text-field v-model="editedTeacher.surname" label="Фамилия"></v-text-field>
                      <v-text-field v-model="editedTeacher.middleName" label="Отчество"></v-text-field>
                      <v-text-field v-model="editedTeacher.email" label="email"></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedTeacher.phoneNumber" :mask="mask"
                                     placeholderChar="#"></vue-text-mask>
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
          <td>{{ item.name }}</td>
          <td>{{ item.surname }}</td>
          <td>{{ item.middleName }}</td>
          <td class="text-xs-right">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";
import VueTextMask from "vue-text-mask";

export default {
  components: {VueTextMask},
  data: () => ({
    search: '',
    userData: null,
    dialog: false,
    dialogDelete: false,
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    headers: [
      {text: 'Имя', align: 'start', sortable: false, value: 'name'},
      {text: 'Фамилия', align: 'start', sortable: false, value: 'surname',},
      {text: 'Отчество', align: 'start', sortable: false, value: 'middleName',},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    persons: {},
    editedIndex: -1,
    deletedIndex: -1,
    editedTeacher: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      phoneNumber: '7'
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
      await user.getActiveUser().catch(x => console.log(x)).then(x => {
        this.userData = x.data
      })
    },

    async postActiveUser(body) {
      const user = new UsersRequest();
      await user.postActiveUser(body).catch(x => console.log(x))

    },

    async putActiveUser(body) {
      const user = new UsersRequest();
      await user.putActiveUser(body).catch(x => console.log(x))
    },

    async deleteUser() {
      const user = new UsersRequest();
      const deletedItem = {"id": this.deletedIndex}
      await user.deleteActiveUser(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      await this.getUser();
      this.persons = await this.userData;
    },

    editItem(item) {
      this.editedIndex = this.persons.activeUsers.indexOf(item);
      this.editedTeacher = {
        id: item.id,
        email: item.email,
        phoneNumber: item.phoneNumber,
        name: item.name,
        surname: item.surname,
        middleName: item.middleName,
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.persons.activeUsers.indexOf(item);
      this.editedTeacher = {name: item.name};
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.persons.activeUsers.splice(this.editedIndex, 1);
      await this.deleteUser()
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedTeacher = {
          name: '',
          surname: '',
          middleName: '',
          email: '',
          phoneNumber: '7'
        };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedTeacher = {
          name: '',
          surname: '',
          middleName: '',
          email: '',
          phoneNumber: '7'
        };
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        this.$set(this.persons.activeUsers, this.editedIndex, this.editedTeacher);
        const body = this.editedTeacher
        await this.putActiveUser(body)
        this.close();
      } else {
        console.log(1)
        this.persons.students.push(this.editedTeacher);
        const body = {
          "email": this.editedTeacher.email,
          "phoneNumber": this.editedTeacher.phoneNumber,
          "name": this.editedTeacher.name,
          "surname": this.editedTeacher.surname,
          "middleName": this.editedTeacher.middleName,
        }
        await this.postActiveUser(body)
        this.close();
      }
    },
  },
};

</script>
<style scoped>
</style>