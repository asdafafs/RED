<script>
import EventsRequest from "@/services/EventsRequest";
import CoursesRequest from "@/services/CoursesRequest";

export default {
  data: () => ({
    sortBy: 'startTime',
    sortDesc: false,
    globalStartTime: null,
    globalEndTime: null,
    coursesData: null,
    dialog: false,
    dialogDelete: false,
    headers: [
      {text: 'Название', align: 'start', sortable: false, value: 'title'},
      {text: 'Начало', align: 'start', sortable: false, value: 'startTime',},
      {text: 'Конец', align: 'start', sortable: false, value: 'endTime',},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    courses: [],
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      lecture: {
        id: null,
        title: '',
        startTime: null,
        endTime: null,
        lectureType: null,
      },
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новое занятие' : 'Редактировать занятие';
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
    async getCourse(id) {
      const course = new CoursesRequest()
      const getItem = {"id": id}
      await course.getCourses(getItem.id).catch(x => console.log(x)).then(x => {
        this.coursesData = x.data.lecture
        this.globalStartTime = x.data.startTime
        this.globalEndTime = x.data.endTime
      })
    },

    async postLecture(body) {
      const event = new EventsRequest();
      await event.postLecture(body).catch(x => console.log(x))
    },

    async putLecture(body) {
      const event = new EventsRequest();
      await event.putLecture(body).catch(x => console.log(x))
    },

    async deleteLecture() {
      const event = new EventsRequest();
      const deletedItem = {"id": this.deletedIndex}
      await event.deleteLecture(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      await this.getCourse(1);
      this.courses = this.coursesData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: this.formatDatetime(item.startTime),
          endTime: this.formatDatetime(item.endTime),
          lectureType: item.lectureType,
          groupId: item.groupId,
        };
      });
    },

    editItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = {
        "lecture": {
          id: item.id,
          title: item.title,
          startTime: this.formatDatetime(item.startTime),
          endTime: this.formatDatetime(item.endTime),
          lectureType: parseInt(item.lectureType),
        }
      };
      console.log(this.editedItem, 'editItem')
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = {
        lecture: {
          id: item.id,
          title: item.title,
          startTime: this.formatDatetime(item.startTime),
          endTime: this.formatDatetime(item.endTime),
          lectureType: parseInt(item.lectureType),
        },
      };
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.courses.splice(this.editedIndex, 1);
      await this.deleteLecture()
      await this.initialize()
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {
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
        this.editedItem = this.editedItem = {
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

    async save() {
      if (this.editedIndex > -1) {
        this.$set(this.courses, this.editedIndex, this.editedItem);
        const body = this.editedItem
        await this.putLecture(body)
        await this.initialize()
        this.close();
      } else {
        const body = {
          "title": this.editedItem.lecture.title,
          "startTime": this.editedItem.lecture.startTime,
          "endTime": this.editedItem.lecture.endTime,
          "lectureType": parseInt(this.editedItem.lecture.lectureType),
          "groupId": 1,
        }
        console.log(body, 'push')
        await this.postLecture(body)
        this.courses.push(this.editedItem);
        await this.initialize()
        this.close();
      }
    },

    isItemEdited(item) {
      return item.id === this.editedItem.lecture.id;
    },

    getTableRowClass(item) {
      return {
        'blue-background': item.lectureType === 3,
        'gray-background': item.lectureType === 2,
      };
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

  },
};
</script>
<template>
  <v-data-table :headers="headers" :items="courses" class="elevation-1" no-data-text="Нет данных для отображения"
                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :footer-props="{
      'items-per-page-text': 'Записей на странице:',
      'items-per-page-all-text': 'Все',
      'page-text': '{0}-{1} из {2}',
      'prev-icon': 'mdi-chevron-left',
      'next-icon': 'mdi-chevron-right',
      'no-data-text': 'Нет данных для отображения'}"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Новое занятие
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
                    <v-text-field v-model="editedItem.lecture.title" label="Название"></v-text-field>
                    <v-text-field v-model="editedItem.lecture.startTime" label="Начало занятия" type="datetime-local">
                    </v-text-field>
                    <v-text-field v-model="editedItem.lecture.endTime" label="Конец занятия" type="datetime-local">
                    </v-text-field>
                    <v-text-field v-model="editedItem.lecture.lectureType" label="Тип занятия"></v-text-field>
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
            <v-card-title class="text-h5">Удалить занятие?</v-card-title>
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
      <tr :class="getTableRowClass(item)">
        <td>{{ item.title }}</td>
        <td>
          {{
            isItemEdited(item) ? formatDatetime(item.startTime)
                : (item.startTime ? formatDatetime(item.startTime) : globalStartTime + " - 00")
          }}
        </td>
        <td>
          {{
            isItemEdited(item) ? formatDatetime(item.endTime)
                : (item.endTime ? formatDatetime(item.endTime) : globalEndTime + " - 00")
          }}
        </td>
        <td class="text-xs-right">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style>
.blue-background {
  background-color: #9DB9FF;
}

.gray-background {
  background-color: #E9E9E8;
}
</style>