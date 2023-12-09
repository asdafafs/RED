<script>
import EventsRequest from "@/services/EventsRequest";
import CoursesRequest from "@/services/CoursesRequest";

export default {
  data: () => ({
    sortBy: 'startTime',
    sortDesc: false,
    test: null,
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
      name: '',
    },
    defaultItem: {
      name: '',
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
    async getCourse(id){
      const course = new CoursesRequest()
      const getItem = {"id": id}
      await course.getCourses(getItem.id).catch(x => console.log(x)).then(x => {
        this.test = x.data.lecture
      })
    },

    async getLecture() {
      const user = new EventsRequest();
      await user.getLecture().catch(x => console.log(x)).then(x => {
        this.test = x.data
      })
    },

    async postLecture(body) {
      const user = new EventsRequest();
      await user.postLecture(body).catch(x => console.log(x))
    },

    async putLecture(body) {
      const user = new EventsRequest();
      await user.putLecture(body).catch(x => console.log(x))
    },

    async deleteLecture() {
      const user = new EventsRequest();
      const deletedItem = {"id": this.deletedIndex}
      await user.deleteLecture(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      await this.getCourse(1);
      this.courses = this.test.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: this.formatDatetime(item.startTime),
          endTime: this.formatDatetime(item.endTime),
          lectureTypeId: item.lectureTypeId,
          groupId: item.groupId,
        };
      });
    },

    editItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = {
        id: item.id,
        title: item.title,
        startTime: this.formatDatetime(item.startTime),
        endTime: this.formatDatetime(item.endTime),
        lectureTypeId: this.editedItem.lectureTypeId,
        groupId: 1,
      };
      this.dialog = true;
    },

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      // const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}-${day} ${hours}:${minutes}`;
    },

    getTableRowClass(item) {
      return {
        'blue-background': item.lectureTypeId === 1,
        'gray-background': item.lectureTypeId === 2,
      };
    },

    deleteItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = {name: item.title};
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
        this.editedItem = {name: ''};
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {name: ''};
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        this.$set(this.courses, this.editedIndex, this.editedItem);
        const body = this.editedItem
        console.log(body)
        await this.putLecture(body)
        await this.initialize()
        this.close();
      } else {
        const body = {
          "title": this.editedItem.title,
          "startTime": this.editedItem.startTime,
          "endTime": this.editedItem.endTime,
          "lectureTypeId": this.editedItem.lectureTypeId,
          "groupId": 1,
        }
        await this.postLecture(body)
        console.log(body)
        this.courses.push(this.editedItem);
        await this.initialize()
        this.close();
      }
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
        <v-dialog v-model="dialog" max-width="500px">
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
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                    <v-text-field v-model="editedItem.startTime" label="Начало занятия" type="datetime-local">
                    </v-text-field>
                    <v-text-field v-model="editedItem.endTime" label="Конец занятия" type="datetime-local">
                    </v-text-field>
                    <v-text-field v-model="editedItem.lectureTypeId" label="Тип занятия"></v-text-field>
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
      <tr :class="getTableRowClass(item)">
        <td>{{ item.title }}</td>
        <td>{{ formatDatetime(item.startTime) }}</td>
        <td>{{ formatDatetime(item.endTime) }}</td>
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