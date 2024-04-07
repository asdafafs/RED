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
        class="custom-header-table"
        style="border-bottom: thin solid rgba(0, 0, 0, 0.12); border-radius: unset !important;"
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true"
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2 header-grid-text' }"
        mobile-breakpoint="0"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" width="auto" persistent>
            <v-card class="card-edit-student">
              <v-card-title class="pa-3 pb-0 ">
                <span class="card-edit-student__type_edit">{{ formTitle }}</span>
                <span class="card-edit-student__title">Общая информация</span>
              </v-card-title>
              <v-card-text class="pa-3 pt-0">
                <v-container class="">
                  <v-row class="pa-0">
                    <v-col class="flex-column pa-0 flex-wrap">
                      <v-text-field v-model="editedStudent.name" label="Имя" height="32px" dense hide-details
                                    :rules="[nameRule.required]" outlined
                                    class="v-text-field-custom-admin"></v-text-field>
                      <v-text-field v-model="editedStudent.surname" outlined label="Фамилия" height="32px" dense
                                    hide-details
                                    :rules="[surnameRule.required]" class="v-text-field-custom-admin "></v-text-field>
                      <v-text-field v-model="editedStudent.middleName" outlined label="Отчество" height="32px" dense
                                    hide-details
                                    :rules="[middleNameRule.required]"
                                    class="v-text-field-custom-admin "></v-text-field>
                      <v-text-field v-model="editedStudent.email" outlined label="email" height="32px" dense
                                    hide-details
                                    :rules="[emailRule.required]" class="v-text-field-custom-admin "></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedStudent.phoneNumber" :mask="mask"
                                    :rules="[phoneRule.required]"></vue-text-mask>
                      <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                                v-model="editedStudent.groupId"
                                :items="groups"
                                :item-value="item => item.groupId"
                                :item-text="item => `${item.title}`"
                                label="Группа"
                                no-data-text="Нет данных для отображения"
                                height="32px"
                                hide-details
                                dense
                      ></v-select>
                      <div class="card-edit-student__title" style="margin-top: 12px !important;">Часы</div>
                      <v-text-field outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                                    v-model="editedStudent.generalHours"
                                    label="Количество основных часов"
                                    height="32px"
                                    hide-details
                                    dense
                      ></v-text-field>
                      <v-text-field outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                                    v-model="editedStudent.additinalHours"
                                    label="Количество дополнительных часов"
                                    height="32px"
                                    hide-details
                                    dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-container class="pa-0" style="display: flex; justify-content: space-between; margin-bottom: auto">
                  <v-btn text @click="close" style="text-transform: none !important;">
                    <span style="color: black">Отмена</span>
                  </v-btn>
                  <v-btn class="close-button" @click="save" :disabled="isSaveButtonDisabled">
                    <span style="color: white">Изменить</span>
                  </v-btn>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Вы действительно хотите удалить ученика</v-card-title>
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
          <td class="text-xs-right grid-actions">
            <v-icon class="mr-2 blue--text" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
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
      {text: 'Действия', align: 'end', value: 'actions', sortable: false},
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
    availableHoursOptions: [0, 1, 2, 3, 4, 5, 20],
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
    testClick(hours) {
    },

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
              fullName: `${student.surname} ${student.name} ${student.middleName} `
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
        generalHours: item.generalHours,
        additinalHours: item.additinalHours
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
          phoneNumber: '7',
          generalHours: 0,
          additinalHours: 0,
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
          "generalHours": this.editedStudent.generalHours,
          "additinalHours": this.editedStudent.additinalHours,
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

.v-text-field-custom-admin.v-text-field--outlined .v-input__control .v-input__slot {
  width: 367px !important;
  min-height: 32px !important;
  margin-top: 24px !important;
}

.v-text-field-custom-admin.v-text-field--outlined .v-input__control .v-input__slot .v-select {
  min-height: 32px !important;
}

.card-edit-student {
  width: 392px !important;
  height: 614px !important;
  border-radius: 12px !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  background: #FFFFFF !important;
  border: 1px solid #AAA7A6 !important;

  &__type_edit {
    width: 100% !important;
    height: 12px !important;
    margin-bottom: 12px !important;
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
  }
}

.close-button {
  border-radius: 12px !important;
  background-color: #4E7AEC !important;
  height: 32px !important;
  width: 89px !important;
  text-transform: none !important;
  margin-bottom: 12px !important;
  margin-right: 12px !important;

  &__text {
    text-transform: none !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    line-height: 18.75px !important;
  }
}

.v-text-field--outlined, {
  border-radius: 12px !important;
}

.big-title {
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 46px !important;
}
</style>