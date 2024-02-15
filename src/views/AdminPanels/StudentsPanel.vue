<template>
  <v-container fluid>
    <div class="text-h4 font-weight-medium px-4">
      Студенты и планы
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
        :items="persons.students"
        :search="search"
        class="elevation-1 custom-header-table"
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true"
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2' }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#4E7AEC " dark class="mb-2 rounded-lg" v-bind="attrs" v-on="on">
                <v-col cols="1" class="px-0">
                  <i class="mdi mdi-plus-circle-outline" style="transform: scale(1.5)"></i>
                </v-col>
                <v-col cols="">
                  Добавить студента
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
                      <v-text-field v-model="editedStudent.name" label="Имя"
                                    :rules="[nameRule.required()]"></v-text-field>
                      <v-text-field v-model="editedStudent.surname" label="Фамилия"
                                    :rules="[surnameRule.required()]"></v-text-field>
                      <v-text-field v-model="editedStudent.middleName" label="Отчество"
                                    :rules="[middleNameRule.required()]"></v-text-field>
                      <v-text-field v-model="editedStudent.email" label="email"
                                    :rules="[emailRule.required()]"></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedStudent.phoneNumber" :mask="mask"
                                     placeholderChar="#" :rules="[phoneRule.required()]"></vue-text-mask>
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
          <td>{{ item.name + " " + item.surname + " " + item.middleName }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.generalHours}}</td>
          <td>{{ item.generalHours - item.generalHoursSpent}}</td>
          <td>{{ item.additinalHours }}</td>
          <td>{{item.additinalHours - item.additinalHoursSpent }}</td>
          <td class="text-xs-right">
            <v-icon small class="mr-2 blue--text" @click="editItem(item)">mdi-pen</v-icon>
            <v-icon small class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";
import VueTextMask from "vue-text-mask";
import GroupsRequest from "@/services/GroupsRequest";

export default {
  components: {VueTextMask},
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    headers: [
      {text: 'ФИО', align: 'start', sortable: false,},
      {text: 'E-mail', align: 'start', sortable: false,},
      {text: 'Общие практики всего', align: 'start', sortable: false,},
      {text: 'Общие практики остаток', sortable: false},
      {text: 'Доппрактики всего', sortable: false},
      {text: 'Доппрактики остаток', sortable: false},
      {text: 'Действия', sortable: false},
    ],
    groups: [],
    persons: {
      students: []
    },
    editedIndex: -1,
    deletedIndex: -1,
    editedStudent: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      groupId: '',
      phoneNumber: '7',
      generalHours: 0,
      generalHoursSpent: 0,
      additinalHours: 0,
      additinalHoursSpent: 0,
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

    isSaveButtonDisabled() {
      return !(this.nameRule.required(this.editedStudent.name)
          && this.surnameRule.required(this.editedStudent.surname)
          && this.middleNameRule.required(this.editedStudent.middleName)
          && this.emailRule.required(this.editedStudent.email)
          && this.phoneRule.required(this.editedStudent.phoneNumber))

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
    async getGroups() {
      const groups = new GroupsRequest();
      let groupsData
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        groupsData = x.data
      })
      return groupsData
    },

    async getStudents() {
      const user = new UsersRequest();
      let studentsData
      await user.getUser().catch(x => console.log(x)).then(x => {
        studentsData = x.data
      })
      return studentsData
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
      this.persons = await this.getStudents()
      this.groups = await this.getGroups()
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
          phoneNumber: '7'
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
          phoneNumber: '7'
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
        this.persons.students.push(this.editedStudent);
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
<style lang="scss">
@import "@/assets/styles/phoneMaskStyles.css";
@import "@/assets/styles/dataTableStyles.css";
</style>