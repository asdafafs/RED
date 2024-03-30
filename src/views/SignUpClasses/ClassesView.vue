<template>
  <div style="width: 100%; height:100%; padding: 0 12px 12px 12px">
    <div class="d-flex justify-space-between mb-1 flex-wrap" style="width: 100%">
      <v-btn-toggle
          mandatory
          v-model="selectedJoinType"
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
        <span :class="selectedJoinType === item.id ? 'white--text' : 'black--text'">
          {{ item.title }}
        </span>
        </v-btn>
      </v-btn-toggle>
      <div class="d-flex align-center flex-row">
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
        />
      </div>
    </div>
    <div v-if="discriminatorUser">
      <v-select
          class="rounded-lg"
          no-data-text="Нет данных для отображения"
          v-model="selectedTeacher"
          label="Выберите инструктора"
          :items="teachers"
          :item-text="item => `${item.name} ${item.surname} ${item.middleName} `"
          item-value="id"
          @change="confirm(discriminatorUser)"
          hide-details
          outlined
          height="36px"
          style="width: 350px;"
          dense
      />
    </div>
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
              @click="prev()"
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
              @click="next()"
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
              @change="updateRange"
              event-more-text="+ {0}"
              :first-interval=6
              :interval-minutes=60
              :interval-count=18
          >
            <template v-slot:event="{event}">
              <v-container class="pa-1 mx-0 d-flex ">
                <v-row class="ma-0">
                  <v-col cols="4" class="black--text pa-0 align-self-center">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.startTime) }}</div>
                  </v-col>
                  <v-col class="black--text pa-0 align-self-center">
                    <div class="font-weight-bold text-format" style="width: inherit">{{ event.title }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-calendar>
          <v-dialog v-model="selectedOpen" max-width="407px" persistent>
            <v-card class="" style="border-radius: 12px"
                    :style="{ border: (selectedEvent.studentId === null && userID !== selectedEvent.studentId) ? '2px solid #4E7AEC' : '2px solid grey' }"
                    flat>
              <v-toolbar-title class="pa-3">
                <v-row>
                  <v-col class="flex-column">
                    <div class="text-caption text-medium-emphasis grey--text">СВЕДЕНИЯ О ЗАПИСИ</div>
                    <div class="text-lg-h4 font-weight-bold">Вождение</div>
                  </v-col>
                </v-row>
              </v-toolbar-title>
              <v-card-text class="pa-3 pt-0">
                <v-container class="">
                  <v-row class="">
                    <v-col class="flex-column pa-0 flex-wrap">
                      <div style="color: #4E7AEC">
                        {{ selectedEvent && selectedEvent.startTime ? selectedEvent.startTime.split('T')[0] : '' }}
                      </div>
                      <div class="text-lg-h5 font-weight-bold black--text">{{ formatTime(selectedEvent.startTime) }}
                        {{ ' - ' }} {{ formatTime(selectedEvent.endTime) }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis " v-if="discriminatorUser">Преподаватель</div>
                      <div class="text-subtitle-2 font-weight-regular black--text" v-if="discriminatorUser">{{
                          selectedEvent.title
                        }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis" v-if="!discriminatorUser">Студент</div>
                      <div class="text-subtitle-2 font-weight-regular black--text" v-if="!discriminatorUser">{{
                          selectedEvent.studentId
                        }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis" v-if="discriminatorUser">Лимит часов</div>
                      <div v-if="discriminatorUser" class="black--text">Основные <span
                          style="color: #4E7AEC">({{ studentHours[1] }} из {{ studentHours[0] }})</span></div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="pa-0">
                <v-container class="pa-0" style="display: flex; justify-content: space-between;">
                  <v-btn text color="secondary" @click="selectedOpen = false;">
                    Отмена
                  </v-btn>
                  <div>
                    <v-btn text color="primary"
                           v-if="selectedEvent.studentId === null && discriminatorUser && userID !== selectedEvent.studentId"
                           @click="addEventStudent">
                      Записаться
                    </v-btn>
                    <v-btn text color="secondary"
                           v-else-if="discriminatorUser && userID === selectedEvent.studentId"
                           @click="removeEventStudent">
                      Отписаться
                    </v-btn>
                    <v-btn text color="secondary"
                           v-else-if="!discriminatorUser"
                           @click="openRefusalModal()">
                      Удалить
                    </v-btn>
                  </div>
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
import UsersRequest from "@/services/UsersRequest";
import {mapState} from "vuex";
import moment from "moment/moment";

export default {
  components: {LectureLogo, CarLogo},
  data: () => ({
    selectedJoinType: 0,
    dialog: false,
    test: false,
    isMobile: false,
    selectedOpen: false,
    refusalModal: false,
    num: 70,
    events: [],
    teachers: [],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    type: 'month',
    types: [['month', 'месяц'], ['week', 'неделя'], ['day', 'день']],
    mode: 'stack',
    value: moment().locale('ru').format('YYYY-MM-DD'),
    currentDate: moment(),
    selectedElement: null,
    selectedTeacher: null,
    studentHours: [],
    selectedReason: null,
    selectedState: null,
    lastSelectedJoinType: 0,
    reasonsRefusal: ['Ремонт', 'Семейные обстоятельства', 'Экзамен ', 'Здоровье', 'Задачи офиса'],
    stateRefusal: ['Закрыта', 'Сгорела', 'Отменена'],
    selectedReasonId: 0,
    selectedStateId: 0,
    prevMonthAndYear: '',
  }),
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

  watch: {
    value(newValue) {
      this.confirmOnChangeMonthAndYear(newValue);
    }
  },

  computed: {
    ...mapState(['user']),
    calendarButtons() {
      return [
        {
          id: 0,
          title: 'Практики',
        },

      ]
    },
    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },

    userID() {
      return this.user.userId
    },

    month() {
      return this.$refs.calendar.title.split(' ')[0]
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  created() {
    this.selectedReason = this.reasonsRefusal[0];
    this.initialize();
  },

  methods: {
    onToggleClick(id) {
      this.lastSelectedJoinType = id;
      switch (id) {
        case 0:
          return this.confirm(this.discriminatorUser)
      }
    },
    displayText(item) {
      return item[1];
    },

    valueText(item) {
      return item[0];
    },

    async confirmOnChangeMonthAndYear(newValue) {
      if (this.type !== 'week'){
        const currentMonthAndYear = this.getMonthAndYear(newValue);
        if (currentMonthAndYear !== this.prevMonthAndYear) {

          console.log(this.lastSelectedJoinType)
          this.onToggleClick(this.lastSelectedJoinType);
          this.prevMonthAndYear = currentMonthAndYear;
        }
      }
    },
    getMonthAndYear(dateString) {
      const [year, month] = dateString.split('-');
      return `${year}-${month}`;
    },

    async prev() {
      this.$refs.calendar.prev()
      if (this.type === 'week') {
        this.currentDate = this.currentDate.clone().subtract(1, 'week');
        await this.confirm(this.discriminatorUser)
      }
    },

   async next() {
      this.$refs.calendar.next()
     if (this.type === 'week') {
       this.currentDate = this.currentDate.clone().add(1, 'week');
       await this.confirm(this.discriminatorUser)
     }
    },

    async confirmClosePractice() {
      const body = {
        "id": this.selectedEvent.id,
        "stateEnum": this.selectedStateId,
      }
      await this.closePractice(body).catch(x => console.log(x)).finally(this.closeModal)
    },

    async confirmDeletePractice() {
      const body = {
        "id": this.selectedEvent.id,
        "stateEnum": this.selectedStateId,
        "deleteReasonEnum": this.selectedReasonId
      }
      await this.closePractice(body).catch(x => console.log(x)).finally(this.closeModal)
      await this.confirm(this.discriminatorUser)

    },

    closeModal() {
      this.selectedOpen = false;
    },

    openRefusalModal() {
      this.refusalModal = true
    },

    confirmReason(selectedReason) {
      return this.selectedReasonId = this.reasonsRefusal.indexOf(selectedReason) + 1
    },

    confirmState(selectedState) {
      return this.selectedStateId = this.stateRefusal.indexOf(selectedState) + 1
    },

    async getStudent() {
      const student = new UsersRequest()
      let hours
      await student.getUsers().catch(x => console.log(x)).then((response) => {
        const users = response.data.students;
        const foundUser = users.find(user => user.id === this.userID);
        if (foundUser) {
          hours = [foundUser.generalHours, foundUser.generalHoursSpent]
          return console.log(this.studentHours = hours)
        } else {
          console.log('Пользователь с ID', this.userID, 'не найден.');
        }
      })

    },

    async closePractice(body) {
      const practice = new EventsRequest()

      await practice.closePractice(body).catch(x => console.log(x))
    },

    async signPractice(body) {
      const practice = new EventsRequest()
      await practice.setStudent(body).catch(x => console.log(x))
    },

    async addEventStudent() {
      let test = this.selectedEvent

      const body = {
        eventId: test.id,
        studentId: this.userID,
      }
      await this.signPractice(body)

      await this.loadUpdatedEvents();

      this.selectedOpen = false
    },

    async removeEventStudent() {
      let test = this.selectedEvent

      const body = {
        eventId: test.id,
        studentId: null,
      }
      await this.signPractice(body)

      await this.loadUpdatedEvents();

      this.selectedOpen = false
    },

    async loadUpdatedEvents() {
      let cal;
      await this.getEventsSelectedTeacher(this.selectedTeacher).catch((x) => console.log(x)).then((x) => {
        cal = x.data.practice.map((event) => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
        }));
      });
      this.events = cal;
    },

    async initialize() {
      await this.getEventsTeacher();
      await this.getStudent()

      if (this.discriminatorUser === false) {
        await this.confirm(this.discriminatorUser)
      }
    },

    async getEventsTeacher() {
      const teachers = new UsersRequest();
      await teachers.getActiveUser().catch(x => console.log(x)).then(x => {
        this.teachers = x.data.activeUsers
      })
    },

    async confirm(discriminator) {
      let cal
      if (discriminator === true) {
        if (this.selectedTeacher) {
          await this.getEventsSelectedTeacher(this.selectedTeacher).catch(x => console.log(x)).then(x => {
            cal = x.data.practice.map(event => ({
              ...event,
              start: new Date(event.startTime),
              end: new Date(event.endTime)
            }));
          });
        }
      } else
        await this.getEventsSelectedTeacher(this.userID).catch(x => console.log(x)).then(x => {
          cal = x.data.practice.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        });

      this.events = cal
      console.log(this.events)
      this.close();
    },

    async getEventsSelectedTeacher(teacherId) {
      if (this.type === 'week'){
        const practice = new EventsRequest()
        console.log(this.currentDate)
        const monday = this.currentDate.clone().startOf('isoWeek').format('YYYY-MM-DD')
        const sunday = this.currentDate.clone().endOf('isoWeek').format('YYYY-MM-DD')
        console.log(monday, sunday)
        const interval = `Date=${monday}&Date2=${sunday}`
        return practice.getPracticeId(teacherId, interval);
      }
      console.log('huy')
      const practice = new EventsRequest()
      const monthTime = `Date=${this.value}`
      return practice.getPracticeId(teacherId, monthTime);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {name: ''};
        this.editedIndex = -1;
      });
      this.selectedOpen = false;
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

    formatTime(startTime) {
      const date = new Date(startTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    updateRange() {
    },

    getEventColor(event) {
      if (this.discriminatorUser && event.studentId === null && this.userID !== event.studentId) {
        return '#9DB9FF';
      } else if (this.discriminatorUser && this.userID === event.studentId) {
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
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/monthScheduleStyles.css";

.day-event {
  display: flex;
  height: 100%;
  border-radius: 12px;
  align-items: center;

  padding: 15px;

  .day {
    display: flex;
    color: #000000;
    font-size: 40px;
    font-family: Roboto, sans-serif;
    font-weight: bold;
    min-width: 120px;
    margin: 0px 0px 0px 0px;
  }

  .custom-info {
    font-size: 16px;
    color: #000000;
    padding-left: 8px;
    font-family: Roboto, sans-serif;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    white-space: normal;

    .teacher {
      font-family: Roboto, sans-serif;
      font-weight: normal;
      font-size: 12px;
    }

  }

}

.day-calendar {
  :only-child {
    .theme--light.v-calendar-daily .v-calendar-daily__day-interval {
      border-top: #e0e0e0 0;
    }

    .theme--light.v-calendar-daily {
      border-top: none;
    }
  }

  border-top: none;
}

.v-calendar-daily__scroll-area {
  overflow-y: hidden;
}

.toggle-button {
  margin-right: 0 !important;
  margin-left: 0 !important;
  color: black !important;
  border-radius: 4px !important;
  text-transform: none !important;
  font-size: 16px !important;

  .v-btn:hover,
  .v-btn:focus,
  {
    color: black !important;
  }
}

.v-btn--active::before {
  opacity: 1 !important;
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

.select-period {
  border-radius: 12px;

  .v-input__slot {
    height: 32px !important;
    min-height: 32px !important;
    display: flex !important;
    align-items: center !important;
  }

  .v-select__selection--comma {
    margin: 0 !important;
  }
}

</style>
