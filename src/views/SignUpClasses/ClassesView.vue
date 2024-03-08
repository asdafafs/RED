<template>
  <v-container fluid>
    <v-row class="d-flex mt-0 ga-3 " no-gutters>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[0],}"
               @click="changeButtonState(0); dialog = true">
          <span :class="{ 'tab-button-text':isButtonPressed[0]}">Практики</span>
        </v-btn>
      </v-col>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[1]}"
               @click="changeButtonState(1)">
          <span :class="{ 'tab-button-text':isButtonPressed[1]}">Экзамен</span>
        </v-btn>
      </v-col>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[2]}"
               @click="changeButtonState(2)">
          <span :class="{ 'tab-button-text':isButtonPressed[2]}">Другое</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="discriminatorUser">
      <v-col lg="3" md="4" sm="6">
        <v-select
            no-data-text="Нет данных для отображения"
            v-model="selectedTeacher"
            label="Выберите инструктора"
            :items="teachers"
            :item-text="item => `${item.name} ${item.surname} ${item.middleName} `"
            item-value="id"
            @change="confirm(discriminatorUser)"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet tile height="54" class="d-flex justify-center">
          <v-btn icon class="ma-0  align-self-center" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title v-if="test" class="text-h6 align-self-center">{{ $refs.calendar.title.split(' ')[0] }}
          </v-toolbar-title>
          <v-btn icon class="ma-0  align-self-center" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet height="600">
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
          >
            <template v-slot:event="{event}">
              <v-container class="pa-1 mx-0 d-flex ">
                <v-row class="ma-0">
                  <v-col cols="4" class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.startTime) }}</div>
                  </v-col>
                  <v-col class="d-lg-none pa-0 event">
                    <div class="logo ">
                      <car-logo v-if="event.lectureType === 3"/>
                      <lecture-logo
                          v-if="event.lectureType === 2 || event.lectureType === 1 || event.lectureType === null"/>
                    </div>
                  </v-col>
                  <v-col class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="font-weight-bold text-format" style="width: inherit">{{ event.title }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-calendar>
          <v-dialog v-model="selectedOpen" max-width="60em" persistent v-if="discriminatorUser">
            <!--            <v-menu max-width="200px" min-width="200px"-->
            <!--                    v-model="selectedOpen"-->
            <!--                    :close-on-content-click="false"-->
            <!--                    :activator="selectedElement"-->
            <!--                    offset-x-->
            <!--            >-->
            <v-card
                :style="{ border: (selectedEvent.studentId === null && userID !== selectedEvent.studentId) ? '2px solid #4E7AEC' : '2px solid grey' }"
                flat>
              <v-toolbar>
                <v-toolbar-title>
                  <v-row>
                    <v-col class="flex-column">
                      <div class="text-subtitle-1 text-medium-emphasis">СВЕДЕНИЯ О ЗАПИСИ</div>
                      <div class="text-lg-h4">Вождение</div>
                    </v-col>
                  </v-row>

                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col class="flex-column">
                      <div class="">
                        {{ selectedEvent && selectedEvent.startTime ? selectedEvent.startTime.split('T')[0] : '' }}
                      </div>

                      <div class="text-lg-h5 font-weight-bold">{{ formatTime(selectedEvent.startTime) }}
                        {{ ' - ' }} {{ formatTime(selectedEvent.endTime) }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis">Преподаватель</div>
                      <div class="text-subtitle-2 font-weight-regular">{{ selectedEvent.title }}</div>
                      <div class="text-subtitle-1 text-medium-emphasis">Лимит часов</div>
                      <div>Основные ({{ studentHours[1] }} из {{ studentHours[0] }})</div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false;">
                    Отмена
                  </v-btn>
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

                </v-card-actions>
              </v-card-actions>
            </v-card>
            <!--            </v-menu>-->
          </v-dialog>
        </v-sheet>
      </v-col>
      <v-dialog max-width="500px" persistent v-if="discriminatorUser">
        <v-card>
          <v-card-title>
            <span class="text-h5">Выберите преподавателя</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                      v-model="selectedTeacher"
                      label="Выберите инструктора"
                      :items="teachers"
                      :item-text="item => `${item.name} ${item.surname} ${item.middleName} `"
                      item-value="id"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
              Отмена
            </v-btn>
            <v-btn color="blue darken-1" text @click="confirm(discriminatorUser)">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
import EventsRequest from "@/services/EventsRequest";
import UsersRequest from "@/services/UsersRequest";
import {mapState} from "vuex";

export default {
  components: {LectureLogo, CarLogo},

  computed: {
    ...mapState(['user']),

    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },

    userID() {
      return this.user.userId
    },
  },

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
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  data: () => ({
    dialog: false,
    test: false,
    isMobile: false,
    selectedOpen: false,
    num: 70,
    events: [],
    teachers: [],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    type: 'month',
    mode: 'stack',
    value: '',
    selectedElement: null,
    selectedTeacher: null,
    isButtonPressed: [false, false, false],
    studentHours: []
  }),

  created() {
    this.initialize();

  },

  methods: {
    async getStudent() {
      const student = new UsersRequest()
      let hours
      await student.getUsers().catch(x => console.log(x)).then((response) => {
        const users = response.data.students; // Предположим, что данные находятся в массиве data
        const foundUser = users.find(user => user.id === this.userID);
        if (foundUser) {
          // Здесь вы можете использовать найденного пользователя
          console.log(foundUser)
          hours = [foundUser.generalHours, foundUser.generalHoursSpent]
          return console.log(this.studentHours = hours)
        } else {
          console.log('Пользователь с ID', this.userID, 'не найден.');
        }
      })

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
      this.changeButtonState(0)
      await this.getEventsTeacher();
      await this.getStudent()
      console.log(this.studentHours)
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
      this.close();
    },

    async getEventsSelectedTeacher(teacherId) {
      const practice = new EventsRequest()
      return practice.getPracticeId(teacherId);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {name: ''};
        this.editedIndex = -1;
      });
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

    changeButtonState(index) {
      this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
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
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/monthScheduleStyles.css";
</style>