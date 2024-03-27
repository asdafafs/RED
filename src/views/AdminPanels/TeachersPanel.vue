<template>
  <div style="width: 100%">
    <div class="big-title">
      Инструкторы и планы
    </div>
    <hr>
    <div class="d-flex flex-row justify-space-between align-center mb-3">
      <v-btn
          color="#4E7AEC"
          class="add-instructor-btn"
          @click="dialog=true"
      >
        <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
          <v-icon color="white">mdi-plus-circle-outline</v-icon>
          <span class="add-instructor-text">Добавить инструктора</span>
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
          <v-dialog v-model="dialog" max-width="500px">
            <v-card class="rounded-xl">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text class="">
                <v-container class="pa-0">
                  <v-row class="pa-0">
                    <v-col cols="12" sm="12" md="12" class="pb-0">
                      <v-text-field v-model="editedTeacher.name" label="Имя" :rules="[nameRule.required()]" outlined
                                    class="rounded-xl"></v-text-field>
                      <v-text-field v-model="editedTeacher.surname" label="Фамилия" :rules="[surnameRule.required()]"
                                    outlined class="rounded-xl"></v-text-field>
                      <v-text-field v-model="editedTeacher.middleName" label="Отчество"
                                    :rules="[middleNameRule.required()]" outlined class="rounded-xl"></v-text-field>
                      <v-text-field v-model="editedTeacher.email" label="email" :rules="[emailRule.required()]"
                                    class="rounded-xl" outlined></v-text-field>
                      <vue-text-mask class="phone-field" v-model="editedTeacher.phoneNumber" :mask="mask"
                                     placeholderChar="#" :rules="[phoneRule.required()]"></vue-text-mask>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container style="display: flex; justify-content: space-between;" class="py-0">
                  <v-btn color="blue darken-1" text @click="close">
                    Отмена
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save" :disabled="isSaveButtonDisabled">
                    OK
                  </v-btn>
                </v-container>
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
          <td>
            <v-btn
                class="grid-button"
                color="#4E7AEC"
                @click="openPlanTemplate(item)"
            >
              <span class="white--text">Определить план</span>
            </v-btn>

          </td>
          <td class="text-xs-right grid-actions">
            <v-icon class="mr-2 blue--text" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    <router-view></router-view>
  </div>
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
      {text: 'ФИО', align: 'start', sortable: false, value: 'fullName'},
      {text: 'E-mail', align: 'start', sortable: false, value: 'email'},
      {text: 'Практики', align: 'start', sortable: false,},
      {text: 'Действия', align: 'end', value: 'actions', sortable: false},
    ],
    persons: [],
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
      return this.editedIndex === -1 ? 'Новый инструктор' : 'Редактировать инструктора';
    },

    isSaveButtonDisabled() {
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
    openPlanTemplate(item) {
      const selectedUserID = item.id;
      this.$router.push({name: 'plan-template', params: {selectedUserID}}).catch(() => {
      });
    },

    async getActiveUsers() {
      const user = new UsersRequest();
      let teachersData;
      await user.getActiveUser()
          .then(response => {
            teachersData = response.data.activeUsers.map(user => ({
              ...user,
              fullName: `${user.name} ${user.surname} ${user.middleName}`
            }));
          })
          .catch(error => {
            console.error(error);
          });
      console.log(teachersData);
      return teachersData;
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
      console.log(item)
      this.editedIndex = this.persons.indexOf(item);
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
      this.editedIndex = this.persons.indexOf(item);
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
        const body = this.editedTeacher
        await this.putActiveUser(body).finally(async () => {
          this.persons = await this.getActiveUsers();
        })
      } else {
        const body = {
          "email": this.editedTeacher.email,
          "phoneNumber": this.editedTeacher.phoneNumber,
          "name": this.editedTeacher.name,
          "surname": this.editedTeacher.surname,
          "middleName": this.editedTeacher.middleName,
        }
        await this.postActiveUser(body).finally(async () => {
          this.persons = await this.getActiveUsers();
        })
        this.close();
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

.big-title {
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 46px !important;
}
</style>