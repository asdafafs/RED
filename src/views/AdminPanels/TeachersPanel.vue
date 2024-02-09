<template>
  <v-container fluid>
    <div class="text-h4 font-weight-medium px-4">
      Инструкторы и планы
    </div>
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
        class="elevation-1 custom-table-header"
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true"
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2' }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#4E7AEC " dark class="mb-2 rounded-lg" v-bind="attrs" v-on="on">
                <v-col cols="1" class="px-0">
                  <i class="mdi mdi-plus-circle-outline" style="transform: scale(1.5)"></i>
                </v-col>
                <v-col cols="">
                  Добавить инструктора
                </v-col>
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
                      <v-text-field v-model="editedTeacher.name" label="Имя" :rules="[nameRule.required()]"></v-text-field>
                      <v-text-field v-model="editedTeacher.surname" label="Фамилия" :rules="[surnameRule.required()]"></v-text-field>
                      <v-text-field v-model="editedTeacher.middleName" label="Отчество" :rules="[middleNameRule.required()]"></v-text-field>
                      <v-text-field v-model="editedTeacher.email" label="email" :rules="[emailRule.required()]"></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedTeacher.phoneNumber" :mask="mask"
                                     placeholderChar="#" :rules="[phoneRule.required()]"></vue-text-mask>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Отмена
                </v-btn>
                <v-btn color="blue darken-1" text @click="save" :disabled="isSaveButtonDisabled">
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
          <td>{{ item.name + " " + item.surname + " " +  item.middleName}}</td>
          <td>{{ item.email }}</td>
          <td>
            <v-btn cols="" class="btn pa-0 rounded-lg" color="#4E7AEC" @click ="test()">
              <span class="white--text">Редактировать</span>
            </v-btn>

          </td>
          <td class="text-xs-right">
            <v-icon small class="mr-2 blue--text" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    <router-view></router-view>
  </v-container>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";
import VueTextMask from "vue-text-mask";

export default {
  components: {VueTextMask},
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    headers: [
      {text: 'ФИО', align: 'start', sortable: false, },
      {text: 'Email', align: 'start', sortable: false, },
      {text: 'Практики', align: 'start', sortable: false, },
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    persons: {
      activeUsers:[]
    },
    editedIndex: -1,
    deletedIndex: -1,
    editedTeacher: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      phoneNumber: '7'
    },
    nameRule: {required: value => !!value},
    surnameRule: {required: value => !!value},
    middleNameRule: {required: value => !!value},
    emailRule: {required: value => !!value},
    phoneRule: {required: value => !!value},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новый элемент' : 'Редактировать элемент';
    },

    isSaveButtonDisabled(){
      return !(this.nameRule.required(this.editedTeacher.name)
          && this.surnameRule.required(this.editedTeacher.surname)
          && this.middleNameRule.required(this.editedTeacher.middleName)
          && this.emailRule.required(this.editedTeacher.email)
          && this.phoneRule.required(this.editedTeacher.phoneNumber))
    }
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
    test(){
      this.$router.push({name: 'plan-template'}).catch(err => {})
    },

    async getActiveUsers() {
      const user = new UsersRequest();
      let teachersData
      await user.getActiveUser().catch(x => console.log(x)).then(x => {
        teachersData = x.data
      })
      return teachersData
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
      this.persons = await this.getActiveUsers()
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
<style>
.custom-table-header th {
  color: #4E7AEC !important;
}
</style>