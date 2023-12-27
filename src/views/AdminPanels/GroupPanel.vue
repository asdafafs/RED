<template>
  <v-container>
    <v-data-table :headers="headersGroup" :search="search" :items="groups" class="elevation-1"
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
          <v-dialog v-model="dialog" max-width="60em" persistent>
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
                      <v-text-field v-model="editedItem.groups.title" label="Название группы"></v-text-field>
                      <v-select
                          v-model="selectedStudents"
                          :items="studentList"
                          :item-text="item => `${item.name} ${item.surname} ${item.middleName}`"
                          label="Список учеников"
                          multiple
                          hint="Выберите студентов для группы"
                          persistent-hint
                      ></v-select>
                      <v-text-field v-model="globalStartTime" label="Введите время лекций курса"></v-text-field>
                      <v-data-table :headers="headersCourse" :items="lessons" class="elevation-1"
                                    no-data-text="Нет данных для отображения"
                                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                      >
                        <template v-slot:item="{ item: innerItem  }">
                          <tr :class="getTableRowClass(innerItem )">
                            <td>{{ innerItem.title }}</td>
                            <td>
                              {{
                                isItemEdited(innerItem) ? formatDatetime(innerItem.startTime)
                                    : (innerItem.startTime ? formatDatetime(innerItem.startTime) : globalStartTime + " - 00")
                              }}
                            </td>
                            <td>
                              {{
                                isItemEdited(innerItem) ? formatDatetime(innerItem.endTime)
                                    : (innerItem.endTime ? formatDatetime(innerItem.endTime) : globalEndTime + " - 00")
                              }}
                            </td>
                            <td class="text-xs-right">
                              <v-icon small class="mr-2" @click="editItem(innerItem )">mdi-pencil</v-icon>
                              <v-icon small @click="deleteItem(innerItem )">mdi-delete</v-icon>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
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
  </v-container>
</template>
<script>
import GroupsRequest from "@/services/GroupsRequest";
import UsersRequest from "@/services/UsersRequest";
import CoursesRequest from "@/services/CoursesRequest";

export default {
  data: () => ({
    globalStartTime: null,
    globalEndTime: null,
    coursesData: null,
    studentList: null,
    lessons: [],
    selectedStudents: [],
    groupData: null,
    dialog: false,
    dialogDelete: false,
    search: '',
    headersGroup: [
      {text: 'Название', align: 'start', sortable: false, value: 'title',},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    headersCourse: [
      {text: 'Название', align: 'start', sortable: false, value: 'title'},
      {text: 'Начало', align: 'start', sortable: false, value: 'startTime',},
      {text: 'Конец', align: 'start', sortable: false, value: 'endTime',},
      {text: 'Действия', value: 'actions', sortable: false},],
    groups: [],
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      groups: {
        groupId: null,
        title: "",
      },

      lecture: {
        id: null,
        title: '',
        startTime: null,
        endTime: null,
        lectureType: null,
      },
    },
    sortBy: 'startTime',
    sortDesc: false,
    discriminator: [1, 2, 3],
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
        this.studentList = x.data.students
        //console.log(this.studentList)
      })
    },

    async getCourse(id) {
      const course = new CoursesRequest()
      const getItem = {"id": id}
      await course.getCourses(getItem.id).catch(x => console.log(x)).then(x => {
        this.coursesData = x.data.lecture
        this.globalStartTime = x.data.startTime
        this.globalEndTime = x.data.endTime
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

      await this.getCourse(1);
      this.lessons = this.coursesData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: this.formatDatetime(item.startTime),
          endTime: this.formatDatetime(item.endTime),
          lectureType: item.lectureType,
          groupId: item.groupId,
        };
      });
      console.log(this.lessons)
    },

    editItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.editedItem = {
        groups: {
          groupId: item.groupId,
          title: item.title,
        },

        lecture: {
          id: null,
          title: '',
          startTime: null,
          endTime: null,
          lectureType: null,
        },
      };
      console.log(this.editedItem)
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.editedItem = {
        groups: {
          groupId: item.groupId,
          title: item.title,
        },

        lecture: {
          id: null,
          title: '',
          startTime: null,
          endTime: null,
          lectureType: null,
        },
      };
      this.deletedIndex = item.groupId
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
        this.editedItem = {
          groups: {
            groupId: null,
            title: "",
          },
          lecture: {
            id: null,
            title: '',
            startTime: null,
            endTime: null,
            lectureType: null,
          },
        };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {
          groups: {
            groupId: null,
            title: "",
          },
        };
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
        console.log(this.editedItem.groups)
        this.groups.push(this.editedItem.groups);
        const body = {
          "title": this.editedItem.groups.title,
        }
        console.log(body)
        await this.postGroups(body)
        this.close();
      }
    },

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}-${day} ${hours}:${minutes}`;
    },

    getTableRowClass(item) {
      return {
        'blue-background': item.lectureType === 3,
        'gray-background': item.lectureType === 2,
      };
    },

    isItemEdited(innerItem) {
      return innerItem.id === this.editedItem.lecture.id;
    },
  },


};
</script>

<style>
.blue-background {
  background-color: #9DB9FF;
}

.gray-background {
  background-color: #E9E9E8;
}
</style>