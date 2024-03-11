<template>
  <v-container fluid>
    <div class="text-h4 font-weight-medium px-4">
      Группы и планы обучения
    </div>
    <v-data-table :headers="headersGroup" :search="search" :items="groups" class="elevation-1 custom-header-table"
                  v-if="!discriminatorUser" no-data-text="Нет данных для отображения"
                  :hide-default-footer="true" disable-pagination :header-props="{ class: 'blue--text text--darken-2' }"
                  mobile-breakpoint="0">
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn color="#4E7AEC" dark class="ma-0 rounded-lg" @click="transitionNewCourse">
            <v-col cols="1" class="px-0">
              <i class="mdi mdi-plus-circle-outline" style="transform: scale(1.5)"></i>
            </v-col>
            <v-col cols="">
              Добавить группу
            </v-col>
          </v-btn>
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
          <td>{{ item.groupNumber }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.globalStartDate }} - {{ item.courseEnd.split('T')[0] }}</td>
          <td>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
        <span v-if="item.students" v-for="(student, index) in item.students"
              :key="index">
          {{ student.name }} {{ student.surname }} {{ student.middleName }}, &nbsp;
          <br>
        </span>
            </div>
          </td>
          <td class="text-xs-right">
            <v-icon small class="mr-2 blue--text" @click="editGroupItem(item)">mdi-pencil</v-icon>
            <v-icon class="red--text" small @click="deleteItem(item)">mdi-delete</v-icon>
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
import CoursesRequest from "@/services/CoursesRequest";
import {mapState} from "vuex";
import moment from 'moment';
import Item from "@/views/AdminPanels/GroupTemplate.vue";
import CoursesList from "@/views/AdminPanels/CoursesList.vue";

export default {
  components: {CoursesList, Item},
  data: () => ({
    globalStartTime: null,
    coursesData: null,
    studentList: null,
    globalStartDate: null,
    lessons: [],
    selectedChips: [],
    selectedStudents: [],
    selectedStudentsIds: [],
    teachers: [],
    groupData: null,
    groupDisabled: false,
    lessonDisabled: false,
    dialog: false,
    lessonDelete: false,
    groupDelete: false,
    showCoursesList: false,
    search: '',
    chips: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    headersGroup: [
      {text: '№', align: 'start', sortable: false, width: '5%'},
      {text: 'Название', align: 'start', sortable: false, width: '20%'},
      {text: 'Даты обучения', align: 'start', sortable: false, width: '20%'},
      {text: 'Ученики', align: 'start', sortable: false, width: '50%'},
      {text: 'Действия', value: 'actions', sortable: false, width: '5%'},
    ],
    groups: [],
    editedIndex: -1,
    deletedIndex: -1,
    editedItem: {
      groups: {
        groupId: null,
        title: ``,
        startDate: null,
        startTime: null,
        fullGroupName: null,
        groupNumber: null,
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
    },
    dateOfWeek: [false, false, false, false, false, false, false],
    cursorDateOfWeek: 0,
    cursorDate: moment(new Date())
  }),

  mounted() {
  },

  computed: {
    ...mapState(['user']),

    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async getCourseLast() {
      const course = new CoursesRequest()
      await course.getCourseNull().catch(x => console.log(x)).then(x => {
        this.coursesData = x.data.lecture
        this.globalStartTime = x.data.startTime
        this.globalStartDate = this.formatDatetime(x.data.startDate)
        this.groupNumber = x.data.groupNumber
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

    async deleteGroups() {
      const groups = new GroupsRequest();
      const deletedItem = {"id": this.deletedIndex}
      await groups.deleteGroup(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      this.groups = await this.getGroups();
      await this.getCourseLast();
      this.lessons = this.coursesData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: item.startTime,
          endTime: item.endTime,
          lectureType: item.lectureType,
          activeUser: item.activeUser,
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


    editGroupItem(item) {
      const selectedGroupID = item.groupId;
      this.$router.push({name: 'groupItem', params: {selectedGroupID}}).catch(() => {
      });
    },

    transitionNewCourse() {
      const selectedGroupID = '-1';
      this.$router.push({name: 'groupItem', params: {selectedGroupID}}).catch(() => {
      });
    },

    async deleteItemConfirm() {
      await this.deleteGroups().finally(async () => {
            this.groups = await this.getGroups();
            this.closeDelete()
          }
      )
    },

    close() {
      this.dialog = false;
      this.showCoursesList = false;
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
      this.selectedChips = []
      this.lessons = []
      this.studentList = []
      this.initialize()
    },

    closeDelete() {
      this.groupDelete = false;
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

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },

};
</script>
<style>
@import "@/assets/styles/dataTableStyles.css";

.theme--light.v-chip:not(.v-chip--active) {
  background: rgba(255, 255, 255, 0.7);
}
</style>