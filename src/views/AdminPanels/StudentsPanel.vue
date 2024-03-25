<template>
  <div style="width: 100%">
    <div class="big-title">
      Студенты и планы
    </div>
    <hr>
    <div class="d-flex flex-row justify-space-between align-center mb-3">
      <v-btn
          color="#4E7AEC"
          class="add-instructor-btn"
          @click="dialog = true"
      >
        <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
          <v-icon color="white">mdi-plus-circle-outline</v-icon>
          <span class="add-instructor-text">Добавить студента</span>
        </section>
      </v-btn>
      <v-text-field
          v-model="search"
          outlined
          dense
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          class="search-field"
          style=" max-width: 256px !important;  border-radius: 12px !important; max-height: 32px !important;"
      />
    </div>
    <v-data-table
        :headers="headers"
        :items="persons"
        :search="search"
        class="elevation-1 custom-header-table"
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true"
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2' }"
        mobile-breakpoint="0"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" width="auto" persistent>
            <v-card class="card-edit-student">
              <v-card-title   >
                <span class="card-edit-student__type_edit">{{ formTitle }}</span>
                <span class="card-edit-student__title">Общая информация</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-container class="pa-0">
                  <v-row class="pa-0">
                    <v-col cols="12" sm="12" md="12" class="pb-0">
                      <v-text-field v-model="editedStudent.name" label="Имя" style="border-radius: 12px"
                                    :rules="[nameRule.required()]" outlined class="py-2"></v-text-field>
                      <v-text-field v-model="editedStudent.surname" outlined label="Фамилия" style="border-radius: 12px"
                                    :rules="[surnameRule.required()]" class="py-2 "></v-text-field>
                      <v-text-field v-model="editedStudent.middleName" outlined label="Отчество"
                                    style="border-radius: 12px"
                                    :rules="[middleNameRule.required()]" class="py-2 "></v-text-field>
                      <v-text-field v-model="editedStudent.email" outlined label="email" style="border-radius: 12px"
                                    :rules="[emailRule.required()]" class="py-2 "></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedStudent.phoneNumber" :mask="mask"
                                     placeholderChar="#" :rules="[phoneRule.required()]"></vue-text-mask>
                      <v-select outlined class="py-2 " style="border-radius: 12px"
                                v-model="editedStudent.groupId"
                                :items="groups"
                                :item-value="item => item.groupId"
                                :item-text="item => `${item.title}`"
                                label="Группа"
                                no-data-text="Нет данных для отображения"
                                height="32px"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="test py-0">
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
          <td>{{ item.fullName }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.generalHours }}</td>
          <td>{{ item.generalHoursSpent }}</td>
          <td>{{ item.additinalHours }}</td>
          <td>{{ item.additinalHoursSpent }}</td>
          <td class="text-xs-right">
            <v-icon small class="mr-2 blue--text" @click="editItem(item)">mdi-pen</v-icon>
            <v-icon small class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
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
      {text: 'ФИО', align: 'start', sortable: false, value: 'fullName'},
      {text: 'E-mail', align: 'start', sortable: false, value: 'email'},
      {text: 'Общие практики всего', align: 'start', sortable: false, value: 'generalHours'},
      {text: 'Общие практики остаток', sortable: false, value: 'generalHoursSpent'},
      {text: 'Доппрактики всего', sortable: false, value: 'additinalHours'},
      {text: 'Доппрактики остаток', sortable: false, value: 'additinalHoursSpent'},
      {text: 'Действия', sortable: false,},
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
      return this.editedIndex === -1 ? 'НОВЫЙ СТУДЕНТ' : 'РЕДАКТИРОВАТЬ СТУДЕНТА';
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
      let studentsData;
      await user.getUsers()
          .then(response => {
            studentsData = response.data.students.map(student => ({
              ...student,
              fullName: `${student.name} ${student.surname} ${student.middleName}`
            }));
          })
          .catch(error => {
            console.error(error);
          });
      return studentsData;
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
      console.log(this.persons)
      this.groups = await this.getGroups()
    },

    editItem(item) {
      this.editedIndex = this.persons.indexOf(item);
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
      this.editedIndex = this.persons.indexOf(item);
      this.editedStudent = {name: item.name};
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.deleteUser().finally(async () => {
        this.persons = await this.getStudents();
        this.closeDelete();
      })

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

      })
      this.editedIndex = -1;
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
        const body = this.editedStudent
        await this.putUser(body).finally(async () => {
          this.persons = await this.getStudents();
        })
      } else {
        this.persons.push(this.editedStudent);
        const body = {
          "email": this.editedStudent.email,
          "phoneNumber": this.editedStudent.phoneNumber,
          "name": this.editedStudent.name,
          "surname": this.editedStudent.surname,
          "middleName": this.editedStudent.middleName,
          "groupId": this.editedStudent.groupId,
        }
        await this.postUser(body).finally(() => {
          this.persons = this.getStudents();
        })
      }
      this.close();
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/phoneMaskStyles.css";
@import "@/assets/styles/dataTableStyles.css";

.grid-button {
  width: 155px !important;
  height: 28px !important;
  border-radius: 12px !important;
  text-transform: none !important;
}

.header-grid-text {
  font-weight: 600 !important;
  font-size: 16px !important;
}

.grid-actions {
  text-align: end !important;
  padding-right: 30px !important;
}

.add-instructor {
  &-btn {
    border-radius: 12px !important;
    height: 32px !important;
    width: 225px !important;
    text-transform: none !important;
  }

  &-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: white !important;
    margin-left: 8px !important;
    line-height: 18.75px !important;
  }
}

.v-text-field {
  padding: 0 !important;
  margin: 0 !important;
}

.v-text-field--outlined .v-label {
  top: 7px !important;
}

.search-field {
  .v-input__slot {
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;
  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    height: 32px !important;
  }
}

.v-btn {
  letter-spacing: unset !important;
}

.test{
  display: flex !important;
  justify-content: space-between !important;
}

.big-title {
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 46px !important;
}
.align-left {
  margin-right: auto !important;
}

.align-right {
  margin-left: auto !important;
}


.card-edit-student {
  width: 392px !important;
  //display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 9px !important;

  background: #FFFFFF !important;
  border: 1px solid #AAA7A6 !important;
  border-radius: 12px !important;

  &__type_edit {
    width: 100% !important;
    height: 11px !important;

    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 12px !important;
    line-height: 14px !important;
    color: #AAA7A6 !important;
    flex: none !important;
    order: 0 !important;
    flex-grow: 0 !important;
  }

  &__title {
    width: 100% !important;
    height: 28px !important;

    font-style: normal !important;
    font-weight: 700 !important;
    font-size: 24px !important;
    line-height: 28px !important;
    color: #000000 !important;
    flex: none !important;
    order: 0 !important;
    flex-grow: 0 !important;
  }

  &__card_text {
    gap: 12px !important;

    &__field {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;

      margin-top: 12px !important;
      margin-bottom: 12px !important;

      width: 352px !important;
      height: 32px !important;

      background: #FEFEFE !important;
      border: 1px solid #4E7AEC !important;
      border-radius: 12px !important;
      flex: none !important;
      order: 1 !important;
      align-self: stretch !important;
      flex-grow: 0 !important;
    }
  }

}

.field {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;

  margin-top: 12px !important;
  margin-bottom: 12px !important;

  width: 352px !important;
  height: 32px !important;

  background: #FEFEFE !important;
  border: 1px solid #4E7AEC !important;
  border-radius: 12px !important;
  flex: none !important;
  order: 1 !important;
  align-self: stretch !important;
  flex-grow: 0 !important;

}

</style>