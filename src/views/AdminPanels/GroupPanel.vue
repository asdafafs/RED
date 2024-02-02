<template>
  <v-container fluid>
    <v-data-table :headers="headersGroup" :search="search" :items="groups" class="elevation-1" v-if="!discriminatorUser"
                  no-data-text="Нет данных для отображения"
                  :hide-default-footer="true"
                  disable-pagination
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
                <span class="text-h5">{{ formTitle() }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.groups.title" label="Название группы"
                                    :rules="[titleRules.required]"></v-text-field>
                      <v-text-field v-model="editedItem.groups.startDate" label="Дата начала курса"
                                    type="date" :rules="[startDateRules.required]"></v-text-field>
                      <v-select
                          v-model="selectedStudents"
                          :value="editedItem.lecture.activeUser"
                          :items="studentList"
                          :item-text="item => `${item.name} ${item.surname} ${item.middleName}`"
                          label="Список учеников"
                          multiple
                          hint="Выберите студентов для группы"
                          persistent-hint
                          no-data-text="Нет данных для отображения"
                          item-value="id"
                          @change="updateSelectedStudentsIds"
                      ></v-select>
                      <v-col cols="4">
                        <v-text-field
                            label="Выберите время начала занятий"
                            :value="globalStartTime"
                            type="time"
                            suffix="PST"
                            @input="updateGlobalStartTime"
                            :rules="[startTimeRules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <template>
                          <div>
                            <v-chip
                                v-for="(chip, index) in chips"
                                :key="index"
                                :color="selectedChips.includes(chip) ? 'blue' : null"
                                @click="toggleSelectedChip(chip)"
                            >
                              <strong>{{ chip }}</strong>&nbsp;
                            </v-chip>
                          </div>
                        </template>
                      </v-col>
                      <CoursesList :start-time="globalStartTime" :coursesData="lessons" :lectors="teachers"
                                   :end-time="globalEndTime" @courses-updated="handleCoursesUpdated"></CoursesList>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close" :disabled="groupDisabled">
                  Отмена
                </v-btn>
                <v-btn color="blue darken-1" text @click="save" :disabled="isSaveButtonDisabled">
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="lessonDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Удалить занятие?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete" :disabled="lessonDisabled">Отмена</v-btn>
                <v-btn color="blue darken-1" text @click="deleteLessonConfirm" :disabled="lessonDisabled">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="groupDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Удалить группу?</v-card-title>
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
    <div v-else>
      <p>Вы не авторизованы для просмотра этой страницы</p>
    </div>
  </v-container>
</template>
<script>
import GroupsRequest from "@/services/GroupsRequest";
import UsersRequest from "@/services/UsersRequest";
import CoursesRequest from "@/services/CoursesRequest";
import {mapState} from "vuex";
import EventsRequest from "@/services/EventsRequest";
import CoursesList from "@/views/AdminPanels/CoursesList.vue";
import moment from 'moment';

export default {
  components: {CoursesList},
  data: () => ({
    globalStartTime: null,
    globalEndTime: null,
    coursesData: null,
    studentList: null,
    globalStartDate: null,
    lessons: [],
    selectedChips: [],
    selectedStudents: [],
    selectedStudentsIds: [],
    selectedDates: [],
    teachers: [],
    groupData: null,
    groupDisabled: false,
    lessonDisabled: false,
    dialog: false,
    lessonDelete: false,
    groupDelete: false,
    search: '',
    chips: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    items: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
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
        title: ``,
        startDate: null,
        startTime: null,
      },

      lecture: {
        id: null,
        title: '',
        startTime: null,
        endTime: null,
        activeUser: null,
        lectureType: null,
      },
    },
    titleRules: {
      required: value => !!value
    },
    startDateRules: {
      required: value => !!value
    },
    startTimeRules: {
      required: value => !!value
    }
  }),

  computed: {
    ...mapState(['user']),

    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },

    isSaveButtonDisabled() {
      return !(this.titleRules.required(this.editedItem.groups.title) === true
          && this.startDateRules.required(this.editedItem.groups.startDate)
          && this.startTimeRules.required(this.globalStartTime));
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новая группа' : 'Редактировать группу';
    },

    async getEventsTeacher() {
      const teachers = new UsersRequest();
      let activeUsers
      await teachers.getActiveUser().catch(x => console.log(x)).then(x => {
        activeUsers = x.data.activeUsers
      })
      return activeUsers
    },

    handleCoursesUpdated(courses) {
      this.lessons = courses
    },

    async getFreeUsers() {
      const user = new UsersRequest();
      let studentList
      await user.getStudentNullGroup().catch(x => console.log(x)).then(x => {
        studentList = x.data.students
      })
      return studentList
    },

    async getCourse(id) {
      const course = new CoursesRequest()
      const getItem = {"id": id}
      await course.getCourse(getItem.id).catch(x => console.log(x)).then(x => {
        this.coursesData = x.data.lecture
        this.globalStartTime = x.data.startTime + ':00'
        this.globalEndTime = x.data.endTime
        this.globalStartDate = this.formatDatetime(x.data.startDate)

        this.studentList = this.studentList.concat(x.data.students);
        this.selectedStudents = x.data.students
      })
    },

    async getGroups() {
      const groups = new GroupsRequest();
      let groupData
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        groupData = x.data
      })
      return groupData
    },

    async postCourse(body) {
      const course = new CoursesRequest();
      await course.postCourse(body).catch(x => console.log(x))
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

    async deleteSelectedLesson() {
      const lesson = new EventsRequest()
      const deletedItem = {"id": this.deletedIndex}
      await lesson.deleteLecture(deletedItem.id).catch(x => console.log(x))
    },
    async initialize() {
      this.groups = await this.getGroups();
      this.studentList = await this.getFreeUsers()
      this.teachers = await this.getEventsTeacher()
      await this.getCourse(1);
      this.lessons = this.coursesData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: (item.startTime),
          endTime: (item.endTime),
          lectureType: item.lectureType,
          activeUser: item.activeUser,
          groupId: item.groupId,
        };
      });
      const nextGroupNumber = this.groups.length + 1;
      this.editedItem.groups.title = `Группа №${nextGroupNumber}`;
    },

    deleteItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.editedItem = {
        groups: {
          groupId: item.groupId,
          title: item.title,
          startDate: this.globalStartDate,
          startTime: null,
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
      this.groupDelete = true;
    },

    editItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.editedItem = {
        groups: {
          groupId: item.groupId,
          title: item.title,
          startDate: this.globalStartDate,
          studentId: item.student
        },

        lecture: {
          id: null,
          title: '',
          startTime: null,
          endTime: null,
          activeUser: null,
          lectureType: null,
        },
      };
      this.dialog = true;
    },

    async deleteItemConfirm() {
      this.groups.splice(this.editedIndex, 1);
      await this.deleteGroups()
      this.closeDelete()
    },

    async deleteLessonConfirm() {
      this.lessonDelete = true
      this.lessons.splice(this.editedIndex, 1);
      await this.deleteSelectedLesson()
      this.closeDelete()
    },

    close() {
      this.dialog = false;
      const nextGroupNumber = this.groups.length + 1;
      this.$nextTick(() => {
        this.editedItem = {
          groups: {
            groupId: null,
            title: `Группа №${nextGroupNumber}`,
            startDate: null,
          },
          lecture: {
            id: null,
            title: '',
            startTime: null,
            endTime: null,
            activeUser: null,
            lectureType: null,
          },
        };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.lessonDelete = true
      this.groupDelete = false;
      this.lessonDelete = false;
      const nextGroupNumber = this.groups.length + 1;
      this.$nextTick(() => {
        this.editedItem = {
          groups: {
            groupId: null,
            title: `Группа №${nextGroupNumber}`,
            startDate: null,
          },
          lecture: {
            id: null,
            title: '',
            startTime: null,
            endTime: null,
            activeUser: null,
            lectureType: null,
          },
        };
        this.editedIndex = -1;
      });
    },

    save: async function () {
      this.groupDisabled = true
      if (this.editedIndex > -1) {
        this.$set(this.groups, this.editedIndex, this.editedItem.groups);
        const body = {
          "id": this.editedItem.groups.groupId,
          "title": this.editedItem.groups.title,
        }
        await this.putGroups(body)
      } else {

        const body = {
          "courseStartDate": this.editedItem.groups.startDate,
          "groupName": this.editedItem.groups.title,
          "startTime": parseInt(this.globalStartTime.split(':')[0], 10),
          "groupId": this.editedItem.groups.groupId,
          "studentId": this.selectedStudentsIds,
          "lecture": this.lessons
        }
        console.log("Что отправляем", body)
        await this.postCourse(body).finally(() => {
          this.groupDisabled = false;
          this.groups.push(this.editedItem.groups);
        })
      }
      this.close();
    },

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },


    toggleSelectedChip(chip) {
      const dayOfWeekMapping = {
        'Пн': 1,
        'Вт': 2,
        'Ср': 3,
        'Чт': 4,
        'Пт': 5,
        'Сб': 6,
        'Вс': 7,
      };

      const index = this.selectedChips.indexOf(chip);
      if (index !== -1) {
        this.selectedChips.splice(index, 1);
      } else {
        this.selectedChips.push(chip);
      }

      const today = moment();
      const nextSixMonths = today.clone().add(6, 'months');

      const selectedDates = [];
      this.selectedChips.forEach(selectedChip => {
        let currentDay = today.clone().isoWeekday(dayOfWeekMapping[selectedChip]);

        while (currentDay.isBefore(nextSixMonths)) {
          selectedDates.push(currentDay.format('YYYY-MM-DD'));
          currentDay.add(7, 'days');
        }
      });

      selectedDates.sort((a, b) => moment(a).valueOf() - moment(b).valueOf());

      console.log(this.selectedDates = selectedDates);
    },

    updateGlobalStartTime(value) {
      this.globalStartTime = value;
    },

    updateSelectedStudentsIds() {
      this.selectedStudentsIds = this.selectedStudents.map(selectedStudent => {
        this.studentList.find(student => {
          const fullName = `${student.name} ${student.surname} ${student.middleName}`;
          return fullName === selectedStudent;
        });
        return selectedStudent;
      });
    }
    ,
  },
};
</script>
<style>
</style>