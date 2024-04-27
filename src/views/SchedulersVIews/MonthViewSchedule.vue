<template>
  <div class="schedule-main-section">
    <div class="schedule-main-section_actions">
      <div class="d-flex width-full justify-space-between">
        <v-btn-toggle
            v-model="selectedLessonType"
            mandatory
            group
            color="black"
        >
          <v-btn
              v-for="item in calendarButtons"
              :key="item.id"
              height="32"
              class="toggle-button"
              :value="item.id"
              @click="onToggleClick(item.id)"
          >
        <span :class="selectedLessonType === item.id ? 'white--text' : 'black--text'">
          {{ item.title }}
        </span>
          </v-btn>
        </v-btn-toggle>
        <div class="d-flex align-center flex-row mb-4 flex-wrap">
          <span class="mr-3">Показать</span>
          <v-select
              no-data-text="Нет данных для отображения"
              style="max-width: 130px"
              height="32"
              v-model="type"
              :items="types"
              dense
              outlined
              hide-details
              class="select-period"
              :item-text="displayText"
              :item-value="valueText"
              @change="getAllEvents"
          />
        </div>
      </div>
      <div>
        <div class="d-flex flex-row flex-wrap">
          <v-btn
              v-if="isUserTeacher"
              color="#4E7AEC"
              class="add-instructor-btn"
              @click="openNewPractice"
              :disabled="this.selectedTeacher === this.userID && isAdmin"
          >
            <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
              <v-icon color="white">mdi-plus-circle-outline</v-icon>
              <span class="add-instructor-text">Добавить практику</span>
            </section>
          </v-btn>
          <v-select v-model="selectedTeacher" class="select-period " outlined dense hide-details
                    style=" max-width: 312px !important;  border-radius: 12px !important; max-height: 32px !important; margin-left: 8px !important; "
                    no-data-text="Нет данных для отображения" label="Инструктор"
                    :items="[...listTeachers, { id: null, name: 'Преподаватель не назначен' }]"
                    :item-text="item => item ? `${item.surname || ''} ${item.name || ''} ${item.middleName || ''}` : 'Преподаватель не назначен'"
                    item-value="id" @change="acceptEditableTeacher()" v-if="this.$store.state.user.isAdmin"></v-select>
        </div>
      </div>
    </div>
    <div class="schedule-main-section_month_picker">
      <v-btn
          icon
          class="schedule-main-section_month_picker-btn"
          @click="previousMonth()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-if="test" class="month-name">
        {{ month }}
      </v-toolbar-title>
      <v-btn
          icon
          class="schedule-main-section_month_picker-btn"
          @click="nextMonth()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <div class="schedule-main-section_calendar">
      <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :event-overlap-mode="mode"
          :type="type"
          :events="events"
          :event-color="getEventColor"
          @click:event="reviewEvent"
          :event-ripple="false"
          :event-height="num"
          :hide-header=false
          @click:more="viewDay"
          event-more
          event-more-text="+ {0}"
      >
        <template v-slot:event="{event}">
          <v-container class="pa-1 mx-0 d-flex ">
            <v-row class="ma-0" style="height: inherit; width: inherit">
              <v-col class="black--text pa-0 align-self-center" style="height: inherit;">
                <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.startTime) }}</div>
              </v-col>
              <v-col class="black--text pa-0 align-self-center" v-if="$vuetify.breakpoint.lgAndUp">
                <div class="font-weight-bold text-format" style="width: inherit">{{ event.title }}
                </div>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-calendar>
    </div>
  </div>
</template>
<script>
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
import EventsRequest from "@/services/EventsRequest";
import moment from "moment/moment";
import {mapState} from "vuex";
import UsersRequest from "@/services/UsersRequest";


export default {
  components: {LectureLogo, CarLogo},
  mounted() {
    const buttonStyleReplace = [
      'v-btn',
      'v-btn--fab',
      'v-btn--has-bg',
      'v-btn--round',
      'theme--light',
      'v-size--small',
      'transparent',
    ]
    this.$refs.calendar.$el
        .querySelectorAll('.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--light.v-size--small.primary')
        .forEach(item => {
          item.classList = '';
          buttonStyleReplace.forEach(x => {
            item.classList.toggle(x)
          })
        })
    this.test = true
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.prevMonthAndYear = this.getMonthAndYear(this.value);
    if (!this.$vuetify.breakpoint.lgAndUp) {
      this.types = [['month', 'месяц'], ['day', 'день']]
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  data: () => ({
    selectedLessonType: null,
    events: [],
    moreEvents: [],
    num: 70,
    test: false,
    type: 'month',
    mode: 'stack',
    modes: ['column'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: moment().format('YYYY-MM-DD'),
    currentDate: moment(),
    selectedMoreElement: null,
    lastSelectedJoinType: 0,
    selectedActiveUser: 0,
    // types: [['month', 'месяц'], ['week', 'неделя'], ['day', 'день']],
    types: [['month', 'месяц'], ['day', 'день']],
    listTeachers: [],
    listStudents: [],
    selectedTeacher: null,
  }),
  watch: {
    value(newValue) {
      this.confirmOnChangeMonthAndYear(newValue);
    },

    userID(newValue) {
      if (newValue !== null) {
        this.onToggleClick(0)
        this.getAllTeachers()
        this.getAllStudents()
        if (this.user.discriminator && this.isUserTeacher) {
          this.selectedTeacher = this.userID
          this.selectedActiveUser = this.userID
        }
      }

    },
  },
  created() {
    if (this.userID !== null) {
      this.onToggleClick(0)
    }
    this.getAllTeachers()
    this.getAllStudents()
  },
  computed: {
    ...mapState(['user']),
    calendarButtons() {
      return [
        {
          id: 0,
          title: 'Смотреть всё',
        },
        {
          id: 1,
          title: 'Теория',
        },
        {
          id: 2,
          title: 'Практика',
        },
      ]
    },

    month() {
      return this.$refs.calendar.title
    },
    userID() {
      return this.user.userId
    },
    userName() {
      return `${this.user.surname} ${this.user.name[0]}. ${this.user.middleName[0]}. `
    },
    isUserTeacher() {
      return this.user.discriminator === 'Учитель'
    },

    isAdmin(){
      return this.user.isAdmin
    },
  },

  methods: {
    async openNewPractice() {
      const teacher = this.listTeachers.find(teacher => teacher.id === this.selectedTeacher)
      const userName = teacher ? `${teacher.surname || ''} ${teacher.name || ''} ${teacher.middleName || ''}`.trim() : '';
      const data = {
        listStudents: this.listStudents,
        userName: userName,
        userId: this.selectedActiveUser,
        isAdmin: this.isAdmin
      }
      await this.$openNewPracticeDialogPlugin(data, true).then((isCancel) => {
        if (!isCancel) {
          this.getAllEvents()
        }
      });
    },
    viewDay({date}) {
      this.selectedMoreElement = nativeEvent.target
      this.value = date
      this.type = 'day'
    },
    displayText(item) {
      return item[1];
    },

    valueText(item) {
      return item[0];
    },

    async acceptEditableTeacher() {
      const selectedId = this.selectedTeacher;
      if (selectedId !== null) {
        const lessons = await this.getLessons(selectedId);
        const practices = await this.getPractices(selectedId);
        this.events = [...lessons, ...practices];
        this.events = this.events.map(item => {
          return {
            ...item,
            start: moment(item.start).format("YYYY-MM-DD HH:mm"),
            end: moment(item.end).format("YYYY-MM-DD HH:mm"),
          }
        })

        this.selectedActiveUser = selectedId
      }
    },

    onToggleClick(id) {
      this.lastSelectedJoinType = id;
      switch (id) {
        case 0:
          return this.getAllEvents()
        case 1:
          return this.testLessons()
        case 2:
          return this.testPractices()
      }
    },

    async previousMonth() {
      this.$refs.calendar.prev()
      if (this.type === 'week') {
        this.currentDate = this.currentDate.clone().subtract(1, 'week');
        await this.getAllEvents()
      }
    },

    async nextMonth() {
      this.$refs.calendar.next()
      if (this.type === 'week') {
        this.currentDate = this.currentDate.clone().add(1, 'week');
        await this.getAllEvents()
      }
    },

    async confirmOnChangeMonthAndYear(newValue) {
      if (this.type !== 'week') {
        const currentMonthAndYear = this.getMonthAndYear(newValue);
        if (currentMonthAndYear !== this.prevMonthAndYear) {
          this.onToggleClick(this.lastSelectedJoinType);
          this.prevMonthAndYear = currentMonthAndYear;
        }
      }
    },

    getMonthAndYear(dateString) {
      const [year, month] = dateString.split('-');
      return `${year}-${month}`;
    },

    async reviewEvent(e) {
      //TODO: Доработать дату
      console.log(e)
      const student = this.listStudents.find(student => student.id === e.event.studentId);
      console.log(student)
      const fullName = student ? `${student.surname || ''} ${student.name || ''} ${student.middleName || ''}`.trim() : '';
      const data = {
        teacher: e.event.title,
        city: 'Северодвинск',
        student: fullName,
        e: e,
        listStudents: this.listStudents,
        userTeacher: this.isUserTeacher,
        isAdmin: this.isAdmin
      }
      await this.$reviewPracticeDialogPlugin(data).then((isCancel) => {
        if (!isCancel) this.getAllEvents()
      })
    },

    async getLessons(userId) {
      const lessons = new EventsRequest()
      let lessonsData
      const monthTime = `Date=${this.value}`
      await lessons.getLectureActiveUser(userId, monthTime).catch(x => console.log(x)).then(x => {
        lessonsData = x.data.lecture.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return lessonsData
    },

    async getPractices(userId) {
      const practices = new EventsRequest()
      let cal
      if (this.type === 'week') {
        const monday = this.currentDate.clone().startOf('isoWeek').format('YYYY-MM-DD')
        const sunday = this.currentDate.clone().endOf('isoWeek').format('YYYY-MM-DD')
        const query = `Date=${monday}&Date2=${sunday}`
        await practices.getPracticeActiveUser(userId, query).catch(x => console.log(x)).then(x => {
          cal = x.data.practice.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        })
      } else {
        const query = `Date=${this.value}`
        await practices.getPracticeActiveUser(userId, query).catch(x => console.log(x)).then(x => {
          cal = x.data.practice.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        })
      }
      return cal
    },

    async getPracticeStudent() {
      const practices = new EventsRequest()
      let cal
      if (this.type === 'week') {
        const monday = this.currentDate.clone().startOf('isoWeek').format('YYYY-MM-DD')
        const sunday = this.currentDate.clone().endOf('isoWeek').format('YYYY-MM-DD')
        const query = `Date=${monday}&Date2=${sunday}`
        await practices.getOnlyAssigned(query).catch(x => console.log(x)).then(x => {
          cal = x.data.practice.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        })
      } else {
        const query = `Date=${this.value}`
        await practices.getOnlyAssigned(query).catch(x => console.log(x)).then(x => {
          cal = x.data.practice.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        })
      }

      return cal
    },

    async getLessonsStudent() {
      const groupId = this.$store.state.user.groupId
      if (groupId) {
        const lessons = new EventsRequest()
        let lessonsData = []
        const monthTime = `Date=${this.value}`
        await lessons.getLectureGroupId(groupId, monthTime).catch(x => console.log(x)).then(x => {
          lessonsData = x.data.lecture.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        })
        return lessonsData
      } else {
        return []
      }
    },

    async getAllEvents() {
      this.currentDate = moment(this.value)
      if (this.isUserTeacher) {
        const lessons = await this.getLessons(this.selectedActiveUser);
        const practices = await this.getPractices(this.selectedActiveUser);
        this.events = [...lessons, ...practices];
        this.events = this.events.map(item => {
          return {
            ...item,
            start: moment(item.start).format("YYYY-MM-DD HH:mm"),
            end: moment(item.end).format("YYYY-MM-DD HH:mm"),
          }
        })
      } else {
        const lessons = await this.getLessonsStudent();
        const practices = await this.getPracticeStudent();
        this.events = [...lessons, ...practices];
        this.events = this.events.map(item => {
          return {
            ...item,
            start: moment(item.start).format("YYYY-MM-DD HH:mm"),
            end: moment(item.end).format("YYYY-MM-DD HH:mm"),
          }
        })
      }
    },

    async testLessons() {
      if (this.isUserTeacher) {
        this.events = await this.getLessons(this.userID);
      } else {
        this.events = await this.getLessonsStudent();
      }

    },

    async testPractices() {
      if (this.isUserTeacher) {
        this.events = await this.getPractices(this.userID);
      } else {
        this.events = await this.getPracticeStudent();
      }

    },
    formatTime(startTime) {
      const date = new Date(startTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    getEventColor(event) {
      if (event.studentId === null)
        return '#9DB9FF';
      else
        return '#E9E9E8';
    },

    handleResize() {
      if (window.innerWidth < 1260) {
        this.num = 30;
      } else {
        this.num = 70;
      }
    },

    async getAllTeachers() {
      const teachers = new UsersRequest();
      let activeUsers
      await teachers.getActiveUser().catch(x => console.log(x)).then(x => {
        activeUsers = x.data.activeUsers
      })
      return this.listTeachers = activeUsers
    },

    async getAllStudents() {
      const student = new UsersRequest()
      let studentList
      await student.getUsers().catch(x => console.log(x)).then(x => {
        studentList = x.data.students
      })
      return this.listStudents = studentList
    }
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/monthScheduleStyles.css";

.schedule-main-section {
  width: 100%;
  height: 100%;
  padding: 0 12px 12px 12px;

  &_actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 12px !important;
    flex-wrap: wrap;
  }

  &_month_picker {
    height: 54px;
    display: flex;
    width: 100%;
    justify-content: center;

    &-btn {
      margin: 0;
      align-self: center;
    }
  }

  &_calendar {
    height: 100%;
    width: 100%;
  }
}

.toggle-button {
  margin-right: 0 !important;
  margin-left: 0 !important;
  color: black !important;
  border-radius: 4px !important;
  text-transform: none !important;
  padding: 0 16px !important;
}

.v-btn--active::before {
  opacity: 1 !important;
}

.v-btn:hover,
.v-btn:focus,
{
  color: black !important;
}

.month-name {
  font-size: 24px !important;
  font-weight: 700 !important;
  display: flex !important;
  align-items: center !important;
  margin-right: 8px !important;
  margin-left: 8px !important;
}

.event-time {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: black !important;
}

.event-type {
  font-weight: 600 !important;
  font-size: 12px !important;
  color: black !important;
}

.event-instructor,
.event-long {
  font-weight: 400 !important;
  font-size: 12px !important;
  color: black !important;
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

.v-text-field-custom {
  width: 367px !important;
  height: 32px !important;
  margin-bottom: 24px !important;
  margin-top: 24px !important;
}

.v-text-field--outlined, {
  border-radius: 12px !important;
}

.flex-row {
  display: flex;
  align-items: center;
}

.select-instructor-template {
  .v-input__control {
    max-height: 32px !important;

    .v-input__slot {
      max-height: 32px !important;
      display: flex !important;
      align-items: center !important;
      min-height: 32px !important;
    }
  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    max-height: 32px !important;
  }


}
</style>