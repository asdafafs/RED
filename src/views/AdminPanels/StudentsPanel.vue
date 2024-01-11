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
        :items="persons.students"
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
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Новый ученик
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
                      <v-text-field v-model="editedStudent.name" label="Имя"></v-text-field>
                      <v-text-field v-model="editedStudent.surname" label="Фамилия"></v-text-field>
                      <v-text-field v-model="editedStudent.middleName" label="Отчество"></v-text-field>
                      <v-text-field v-model="editedStudent.email" label="email"></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedStudent.phoneNumber" :mask="mask" placeholderChar="#"></vue-text-mask>
                      <v-select
                          v-model="editedStudent.groupId"
                          :items="groups"
                          :item-value="item => item.groupId"
                          :item-text="item => `${item.title}`"
                          label="Группа"
                          no-data-text="Нет данных для отображения"
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
          <td>{{ item.name }}</td>
          <td>{{item.surname}}</td>
          <td>{{item.middleName}}</td>
          <td>{{ getGroupName(item.groupId) }}</td>
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
import GroupsRequest from "@/services/GroupsRequest";

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
      {text: 'Группа', align: 'start', sortable: false, value: 'groupId'},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    groups: [],
    persons: [],
    editedIndex: -1,
    deletedIndex: -1,
    editedStudent: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      groupId: '',
      phoneNumber: '7',
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
    async getGroups() {
      const groups = new GroupsRequest();
      let test
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        test = x.data
      })
      return test
    },

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
      this.persons = await this.userData;
      this.groups = await this.getGroups()
      console.log(this.groups )
    },

    editItem(item) {
      this.editedIndex = this.persons.students.indexOf(item);
      this.editedStudent = {
        id: item.id,
        email: item.email,
        phoneNumber: item.phoneNumber,
        name: item.name,
        surname: item.surname,
        middleName: item.middleName,
        groupId: item.groupId,
      };
      console.log(this.editedStudent, 1)
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.persons.students.indexOf(item);
      this.editedStudent = {name: item.name};
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
        this.editedStudent = {
          name: '',
          surname: '',
          middleName: '',
          groupId: '',
          email: '',
          phoneNumber:'7'
        };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedStudent = {
          name: '',
          surname: '',
          middleName: '',
          groupId: '',
          email: '',
          phoneNumber:'7'
        };
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        this.$set(this.persons.students, this.editedIndex, this.editedStudent);
        const body = this.editedStudent
        await this.putUser(body)
        this.close();
      } else {
        console.log(this.editedStudent)
        console.log(0)
        this.persons.students.push(this.editedStudent);
        console.log(1)
        const body = {
          "email": this.editedStudent.email,
          "phoneNumber": this.editedStudent.phoneNumber,
          "name": this.editedStudent.name,
          "surname": this.editedStudent.surname,
          "middleName": this.editedStudent.middleName,
          "groupId": this.editedStudent.groupId,
        }

        console.log("body : ", body)
        console.log(this.editedStudent)
        await this.postUser(body)
        this.close();
      }
    },

    getGroupName(groupId) {
      if (groupId === null) {
        return "нет информации";
      }
      const group = this.groups.find(group => group.groupId === groupId);
      return group ? group.title : '';
    },
  },
};
</script>
<style>
.phone-field {
  width: 100%;
  padding: 11px 14px;
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #383c42;
  background-color: #fff;
  background-clip: padding-box;
  border: none; /* Remove the default border */
  border-bottom: 1px solid rgba(0, 0, 0, 0.53); /* Add bottom border */
  border-radius: 0; /* Remove border-radius if needed */
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.phone-field:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  /* Change the bottom border color on focus */
}
</style>