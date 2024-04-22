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
                                    class="v-text-field-custom-admin"/>
                      <v-text-field v-model="editedStudent.surname" outlined label="Фамилия" height="32px" dense
                                    hide-details
                                    :rules="[surnameRule.required]" class="v-text-field-custom-admin "/>
                      <v-text-field v-model="editedStudent.middleName" outlined label="Отчество" height="32px" dense
                                    hide-details
                                    :rules="[middleNameRule.required]"
                                    class="v-text-field-custom-admin "/>
                      <v-text-field v-model="editedStudent.email" outlined label="email" height="32px" dense
                                    hide-details
                                    :rules="[emailRule.required]" class="v-text-field-custom-admin "></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedStudent.phoneNumber" :mask="mask"
                                     :rules="[phoneRule.required]"/>
                      <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                                v-model="editedStudent.groupId"
                                :items="groups"
                                :item-value="item => item.groupId"
                                :item-text="item => `${item.title}`"
                                label="Группа"
                                no-data-text="Нет данных для отображения"
                                height="32px"
                                hide-details
                                dense/>
                      <v-checkbox v-model="editedStudent.block_student" label="Заблокировать студента" hide-details/>
                      <div class="card-edit-student__title" style="margin-top: 16px !important;">Параметры обучения
                      </div>
                      <v-radio-group class="px-0 py-0 align-center ma-0 mt-3" v-model="editedStudent.gearboxType"
                                     hide-details>
                        <v-radio label="АКП" :value="1">
                          <template v-slot:label>
                            <strong style="color:#2B2A29; font-weight: 400">АКП</strong>
                          </template>
                        </v-radio>
                        <v-radio label="МКП" :value="2">
                          <template v-slot:label>
                            <strong style="color:#2B2A29; font-weight: 400">МКП</strong>
                          </template>
                        </v-radio>
                      </v-radio-group>
                      <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                                v-model="editedStudent.city"
                                :items="availableCity"
                                multiple
                                label="Город"
                                no-data-text="Нет данных для отображения"
                                height="32px"
                                hide-details
                                dense/>
                      <div class="card-edit-student__title" style="margin-top: 16px !important;">Часы</div>
                      <v-checkbox v-model="editedStudent.can_signUp" label="Может записываться на практики"
                                  hide-details/>
                      <v-text-field outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                                    v-model="editedStudent.generalHoursSpent"
                                    label="Текущий остаток"
                                    height="32px"
                                    :hint="`Из них дополнительных: ${editedStudent.generalHoursSpent - 56}`"
                                    persistent-hint
                                    dense/>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-container class="pa-0" style="display: flex; justify-content: space-between; margin-bottom: auto">
                  <v-btn text @click="close" style="text-transform: none !important;">
                    <span style="color: black">Отмена</span>
                  </v-btn>
                  <v-btn class="close-button" @click="save" :disabled="isSaveButtonDisabled && blockButtonWhenRequest ">
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
                <v-spacer/>
                <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm" :disabled="blockButtonWhenRequest">OK
                </v-btn>
                <v-spacer/>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.fullName }}
            <v-chip color="#E31E24" label v-if="false"
                    style="height: 20px; width: 36px; border-radius: 4px; padding: 4px !important;">
              <span class="white--text" style="font-weight: 600; font-size: 12px; line-height: 14px;">
                Долг
              </span>
            </v-chip>
          </td>
          <td>{{ item.email }}</td>
          <td>{{ item.generalHours }}</td>
          <td>{{ item.generalHoursSpent }}</td>
          <td>{{ item.additinalHours }}</td>
          <td class="text-xs-right grid-actions">
            <v-icon class="mr-2 blue--text" @click="editItem(item)">mdi-pencil</v-icon>
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
    blockButtonWhenRequest: false,
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    headers: [
      {text: 'ФИО', align: 'start', sortable: false, value: 'fullName', width: '30%'},
      {text: 'E-mail', align: 'start', sortable: false, value: 'email', width: '15%'},
      {text: 'Оплаченные Всего', align: 'start', sortable: false, value: 'generalHours', width: '15%'},
      {text: 'Оплаченные Остаток', sortable: false, value: 'generalHoursSpent', width: '15%'},
      {text: 'Неоплаченные Всего', sortable: false, value: 'additinalHours', width: '15%'},
      {text: 'Действия', align: 'end', value: 'actions', sortable: false, width: '10%'},
    ],
    availableCity: ['Северодвинск', 'Новодвинск'],
    groups: [],
    persons: [],
    editedIndex: -1,
    deletedIndex: -1,
    addHour: 0,
    editedStudent: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      groupId: null,
      phoneNumber: '7',
      generalHours: 0,
      generalHoursSpent: 56,
      additinalHours: 0,
      additinalHoursSpent: 0,
      gearboxType: 1,
      city: '',
      block_student: false,
      can_signUp: true,
      hasDebt: true,
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
        generalHoursSpent: parseInt(item.generalHoursSpent),
        additinalHours: item.additinalHours
      };
      this.dialog = true;
    },

    async deleteItemConfirm() {
      await this.deleteUser().finally(async () => {
        this.persons = await this.getStudents();
        this.closeDelete();
      })

    },

    close() {
      this.dialog = false;
      this.blockButtonWhenRequest = false
      this.$nextTick(() => {
        this.editedStudent = {
          name: '',
          surname: '',
          middleName: '',
          groupId: 0,
          email: '',
          phoneNumber: '7'
        };
      })
      this.addHour = 0
      this.editedIndex = -1;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedStudent = {
          name: '',
          surname: '',
          middleName: '',
          groupId: null,
          email: '',
          phoneNumber: '7',
          generalHours: 0,
          additinalHours: 0,
        };
        this.editedIndex = -1;
      });
    },

    async save() {
      this.blockButtonWhenRequest = true
      if (this.editedIndex > -1) {
        const body = {
          "id": this.editedStudent.id,
          "email": this.editedStudent.email,
          "phoneNumber": this.editedStudent.phoneNumber,
          "name": this.editedStudent.name,
          "surname": this.editedStudent.surname,
          "middleName": this.editedStudent.middleName,
          "groupId": this.editedStudent.groupId,
          "generalHours": this.editedStudent.generalHoursSpent,
        }
        await this.putUser(body).catch(() => {
          this.dialogDelete = false;
        }).finally(() => {
          this.close();
          this.initialize()
        })
      } else {
        const body = {
          "email": this.editedStudent.email,
          "phoneNumber": this.editedStudent.phoneNumber,
          "name": this.editedStudent.name,
          "surname": this.editedStudent.surname,
          "middleName": this.editedStudent.middleName,
          "groupId": this.editedStudent.groupId,
          "generalHours": this.editedStudent.generalHours + parseInt(this.addHour),
          "additinalHours": this.editedStudent.additinalHours,
        }
        await this.postUser(body).catch(() => {
          this.dialogDelete = false;
        }).finally(() => {
          this.close();
          this.initialize()
        })
      }


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
  height: 847px !important;
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