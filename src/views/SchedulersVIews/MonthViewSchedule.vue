<template>
  <div style="width: 100%; height:100%; padding: 0 12px 12px 12px">
    <div class="flex-row" style="margin-bottom: 12px !important;">
      <v-btn-toggle
          mandatory
          v-model="selectedLessonType"
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
      <v-select v-model="selectedTeacher" class="select-practice-template " outlined dense hide-details
                style=" max-width: 367px !important;  border-radius: 12px !important; max-height: 32px !important;"
                no-data-text="Нет данных для отображения" label="Выберите инструктора для редактирования"
                :items="[...listTeachers, { id: null, name: 'Преподаватель не назначен' }]"
                :item-text="item => item ? `${item.name || ''} ${item.surname || ''} ${item.middleName || ''}` : 'Преподаватель не назначен'"
                item-value="id" @change="acceptEditableTeacher()" v-if="this.$store.state.user.isAdmin"></v-select>
    </div>
    <v-btn
        v-if="discriminatorUser"
        color="#4E7AEC"
        class="add-instructor-btn"
        @click="selectedOpen = true; openEditMode = true; openNewEvent()"
    >
      <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
        <v-icon color="white">mdi-plus-circle-outline</v-icon>
        <span class="add-instructor-text">Добавить практику</span>
      </section>
    </v-btn>
    <div>
      <div>
        <v-sheet
            tile
            height="54"
            class="d-flex justify-center"
        >
          <v-btn
              icon
              class="ma-0 align-self-center"
              @click="$refs.calendar.prev()"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title
              v-if="test"
              class="month-name"
          >
            {{ month }}
          </v-toolbar-title>
          <v-btn
              icon
              class="ma-0 align-self-center"
              @click="$refs.calendar.next()"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="value"
              :weekdays="weekday"
              :event-overlap-mode="mode"
              :type="type"
              :events="events"
              :event-color="getEventColor"
              @click:event="showEvent"
              :event-ripple="false"
              :event-height="num"
              :hide-header=false
              event-more-text="+ {0}"
          >
            <template v-slot:event="{event}">
              <div class="d-flex flex-row" style="width: 100%">
                <div class="d-flex align-center justify-center event-time" style="width: 30%">
                  {{ formatTime(event.startTime) }}
                </div>
                <div class="d-flex align-center justify-center event-type" style="width: 70%">
                  {{ event.title }}
                </div>
              </div>
            </template>
          </v-calendar>
          <v-dialog v-model="selectedOpen" max-width="407px" persistent>
            <v-card class="" style="border-radius: 12px"
                    :style="{ border: (selectedEvent.studentId === null && userID !== selectedEvent.studentId) ? '1px solid #4E7AEC' : '1px solid grey' }"
                    flat>
              <v-toolbar-title class="pa-3">
                <v-row>
                  <v-col class="flex-column">
                    <div class="text-caption text-medium-emphasis grey--text">СВЕДЕНИЯ О ЗАПИСИ</div>
                    <div class="edit-buttons-div" v-if="!openEditMode && !openDeleteMode">
                      <v-btn class="edit-buttons-div__edit-button" @click="openEditMode = true; openDeleteMode = false">
                        <span class="edit-buttons-div__edit-button__text">Изменить</span>
                      </v-btn>
                      <v-btn color="edit-buttons-div__edit-button"
                             @click="openDeleteMode = true; openEditMode = false;">
                        <span class="edit-buttons-div__edit-button__text">Удалить</span>
                      </v-btn>
                    </div>
                    <div class="text-lg-h4 font-weight-bold">Вождение</div>
                  </v-col>
                </v-row>
              </v-toolbar-title>
              <v-card-text class="pa-3 pt-0 pb-0">
                <v-container class="">
                  <v-row class="">
                    <v-col class="flex-column pa-0 flex-wrap">
                      <div style="color: #4E7AEC">
                        {{ selectedEvent && selectedEvent.startTime ? selectedEvent.startTime.split('T')[0] : '' }}
                      </div>
                      <div class="text-lg-h5 font-weight-bold black--text">{{ formatTime(selectedEvent.startTime) }}
                        {{ ' - ' }} {{ formatTime(selectedEvent.endTime) }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis ">Преподаватель</div>
                      <div class="text-subtitle-2 font-weight-regular black--text">{{
                          selectedEvent.title
                        }}
                      </div>
                      <div v-if="openEditMode">
                        <v-text-field v-model="newDateEvent" height="32px" hide-details label="Дата" type="date"
                                      class="v-text-field-custom "
                                      outlined dense :min="minDate"></v-text-field>
                        <v-text-field v-model="newTimeEvent" height="32px" hide-details label="Время начала" type="time"
                                      class="v-text-field-custom " outlined dense></v-text-field>
                        <v-radio-group class="flex-row" row hide-details v-model="newSelectedDuration">
                          <v-radio label="1 Час" :value="1"></v-radio>
                          <v-radio label="2 Час" :value="2"></v-radio>
                        </v-radio-group>
                        <v-select height="32px" class="v-text-field-custom " outlined dense hide-details v-model="selectedStudent"
                                  no-data-text="Нет данных для отображения" label="Ученик" item-value="id"
                                  :items="[...listStudents, { id: null, name: 'Студент не назначен' }]"
                                  :item-text="item => item ? `${item.name || ''} ${item.surname || ''} ${item.middleName || ''}` : 'Студент не назначен'"></v-select>
                      </div>
                      <div v-if="openDeleteMode">
                        <v-radio-group class="flex-row" row hide-details v-model="newSelectedReason">
                          <v-radio label="Отменена" :value="1"></v-radio>
                          <v-radio label="Сгорела" :value="2"></v-radio>
                        </v-radio-group>
                        <v-select no-data-text="Нет данных для отображения" :disabled="newSelectedReason !== 1"
                                  v-model="selectedReason"
                                  :items="reasonsRefusal"
                                  item-value="id"
                                  @change="confirmReason(selectedReason)"
                                  class="v-text-field-custom " outlined dense hide-details
                        ></v-select>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="pa-0">
                <v-container class="pa-0" style="display: flex; justify-content: flex-end;"
                             v-if="!openEditMode && !openDeleteMode">
                  <v-btn @click="selectedOpen = false; selectedEvent = {};" class="close-button">
                    <span style="color: white">Понятно</span>
                  </v-btn>
                </v-container>
                <v-container class="pa-0" style="display: flex; justify-content: space-between;" v-if="openEditMode">
                  <v-btn @click="cancelChanges()" class="" text style="text-transform: none !important;">
                    <span style="color: black">Отмена</span>
                  </v-btn>
                  <v-btn @click="saveChanges()" class="close-button">
                    <span style="color: white">Сохранить</span>
                  </v-btn>
                </v-container>
                <v-container class="pa-0" style="display: flex; justify-content: space-between;" v-if="openDeleteMode">
                  <v-btn @click="cancelChanges()" class="" text style="text-transform: none !important;">
                    <span style="color: black">Отмена</span>
                  </v-btn>
                  <v-btn @click="saveDelete()" class="close-button">
                    <span style="color: white">Сохранить</span>
                  </v-btn>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-sheet>
      </div>
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
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  data: () => ({
    selectedLessonType: null,
    events: [],
    num: 70,
    test: false,
    type: 'month',
    mode: 'stack',
    modes: [
      'column'
    ],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: moment().locale('ru').format('YYYY-MM-DD'),
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    openEditMode: false,
    openDeleteMode: false,
    newEvent: false,
    minDate: moment().locale('ru').format('YYYY-MM-DD'),
    newDateEvent: moment().locale('ru').format('YYYY-MM-DD'),
    newTimeEvent: '06:00',
    newSelectedDuration: 1,
    newSelectedReason: 1,
    lastSelectedJoinType: 0,
    selectedStudent: 0,
    selectedReason: 1,
    reasonsRefusal: ['Ремонт', 'Семейные обстоятельства', 'Экзамен ', 'Здоровье', 'Задачи офиса'],
    listTeachers: [],
    listStudents: [],
    selectedTeacher: null,
    titleNewEvent: '',
  }),
  watch: {
    userID(value) {
      if (value) this.getAllEvents()
    },

    value(newValue) {
      this.confirmOnChangeMonthAndYear(newValue);
    }
  },
  created() {
    if (this.userID) {
      this.getAllEvents()
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
      return this.$refs.calendar.title.split(' ')[0]
    },
    userID() {
      return this.user.userId
    },

    discriminatorUser() {
      return this.user.discriminator === 'Учитель'
    },
  },

  methods: {
    openNewEvent() {
      this.newEvent = true
      const [hours, minutes] = this.newTimeEvent.split(':');
      this.selectedEvent.startTime = moment(this.selectedEvent.startTime)
          .set({hour: parseInt(hours), minute: parseInt(minutes)})
          .format('YYYY-MM-DD HH:mm');
      this.selectedEvent.endTime = moment(this.selectedEvent.startTime)
          .add(this.newSelectedDuration, 'hours')
          .format('YYYY-MM-DD HH:mm');
      if (this.selectedTeacher === null) {
        const selectedTeacherObj = this.listTeachers.find(teacher => teacher.id === this.userID);
        if (selectedTeacherObj) {
          this.titleNewEvent = `${selectedTeacherObj.name || ''} ${selectedTeacherObj.surname || ''} ${selectedTeacherObj.middleName || ''}`;
        }
      } else {
        const selectedTeacherObj = this.listTeachers.find(teacher => teacher.id === this.selectedTeacher);
        if (selectedTeacherObj) {
          this.titleNewEvent = `${selectedTeacherObj.name || ''} ${selectedTeacherObj.surname || ''} ${selectedTeacherObj.middleName || ''}`;
        }
      }
      this.selectedEvent.title = this.titleNewEvent
    },

    async saveChanges() {
      this.openEditMode = false
      this.openDeleteMode = false
      this.selectedOpen = false
      const cal = moment(this.newDateEvent).format('YYYY-MM-DD');
      const [hours, minutes] = this.newTimeEvent.split(':');

      const startTime = moment(cal).hour(parseInt(hours)).minute(parseInt(minutes));
      const endTime = startTime.clone().add(this.newSelectedDuration, 'hours');

      if (this.newEvent) {
        const body = {
          id: this.selectedEvent.id,
          "startTime": startTime,
          "endTime": endTime,
          "studentId": this.selectedStudent
        }
        await this.postNewEvent(body).catch(x => console.log(x)).finally(async () => {
          await this.getAllEvents()
        })
      }
      else {
        const body = {
          id: this.selectedEvent.id,
          "startTime": startTime,
          "endTime": endTime,
          "studentId": this.selectedStudent
        }
        await this.confirmChanges(body).catch(x => console.log(x)).finally(async () => {
          await this.getAllEvents()
        })
      }
      this.newEvent = false
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
      }
    },

    async saveDelete() {
      this.openEditMode = false
      this.openDeleteMode = false
      this.selectedOpen = false
      if (this.newSelectedReason === 1) {
        const body = {
          "id": this.selectedEvent.id,
          "stateEnum": this.newSelectedReason
        }
        await this.closePractice(body)
      } else {
        const body = {
          "id": this.selectedEvent.id,
          "deleteReasonEnum": this.selectedReasonId
        }
        await this.cancelPractice(body)
      }

    },

    async closePractice(body) {
      const event = new EventsRequest()
      await event.closePractice(body).catch(x => console.log(x))
    },

    async cancelPractice(body) {
      const event = new EventsRequest()
      await event.cancelPractice(body).catch(x => console.log(x))
    },

    cancelChanges() {
      this.selectedEvent = {};
      this.openEditMode = false
      this.openDeleteMode = false
      this.selectedOpen = false
    },

    confirmReason(selectedReason) {
      return this.selectedReasonId = this.reasonsRefusal.indexOf(selectedReason) + 1
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

    async confirmChanges(body) {
      const event = new EventsRequest()
      await event.putPractice(body).catch(x => console.log(x))
    },

    async postNewEvent(body){
      const event = new EventsRequest()
      await event.postPractice(body).catch(x => console.log(x))
    },

    async confirmOnChangeMonthAndYear(newValue) {
      const currentMonthAndYear = this.getMonthAndYear(newValue);
      if (currentMonthAndYear !== this.prevMonthAndYear) {
        this.onToggleClick(this.lastSelectedJoinType)
        this.prevMonthAndYear = currentMonthAndYear;
      }
    },

    getMonthAndYear(dateString) {
      const [year, month] = dateString.split('-');
      return `${year}-${month}`;
    },

    showEvent({nativeEvent, event}) {
      console.log(event)
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
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
      const monthTime = `Date=${this.value}`
      await practices.getPracticeActiveUser(userId, monthTime).catch(x => console.log(x)).then(x => {
        cal = x.data.practice.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return cal
    },

    async getAllEvents() {
      const lessons = await this.getLessons(this.userID);
      const practices = await this.getPractices(this.userID);
      this.events = [...lessons, ...practices];
      this.events = this.events.map(item => {
        return {
          ...item,
          start: moment(item.start).format("YYYY-MM-DD HH:mm"),
          end: moment(item.end).format("YYYY-MM-DD HH:mm"),
        }
      })
    },

    async testLessons() {
      this.events = await this.getLessons(this.userID);
    },

    async testPractices() {
      this.events = await this.getPractices(this.userID);
    },

    formatTime(startTime) {
      const date = new Date(startTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    getEventColor(event) {
      if (event.lectureType === 3) {
        return '#9DB9FF';
      } else if (event.lectureType === 2) {
        return '#E9E9E8';
      } else {
        return '#E9E9E8'
      }
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

    async getAllStudents(){
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

.toggle-button {
  margin-right: 0 !important;
  margin-left: 0 !important;
  color: black !important;
  border-radius: 4px !important;
  text-transform: none !important;
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

.edit-buttons-div {
  margin-bottom: 12px !important;
  margin-top: 12px !important;

  &__edit-button {
    border-radius: 12px !important;
    border: 1px solid rgba(0, 0, 0, 0.53) !important;
    height: 32px !important;
    width: 100px !important;
    background-color: #FEFEFE !important;
    text-transform: none !important;
    margin: 0 16px 0 0 !important;

    &__text {
      color: #2B2A29 !important;
      text-transform: none !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 18.75px !important;
    }
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

.select-practice-template {
  .v-input__slot {
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;
  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    max-height: 32px !important;
  }

  .v-input__control {
    max-height: 32px !important;
    .v-input__slot {
      max-height: 32px !important;
    }
  }
}
</style>