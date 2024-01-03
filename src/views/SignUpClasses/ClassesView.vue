<template>
  <v-container fluid>
    <v-row class="d-flex mt-0 ga-3 " no-gutters>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[0],}"
               @click="changeButtonState(0); dialog = true">
          <span :class="{ 'custom_text':isButtonPressed[0]}">Практики</span>
        </v-btn>
      </v-col>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[1]}"
               @click="changeButtonState(1)">
          <span :class="{ 'custom_text':isButtonPressed[1]}">Экзамен</span>
        </v-btn>
      </v-col>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[2]}"
               @click="changeButtonState(2)">
          <span :class="{ 'custom_text':isButtonPressed[2]}">Другое</span>
        </v-btn>
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
          <v-menu max-width="200px" min-width="200px"
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
          >
            <v-card color="grey lighten-4" flat >
              <v-toolbar>
                <v-toolbar-title v-html="formatTime(selectedEvent.startTime)"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.title"></span>
                <span v-html="selectedEvent.studentId === null && !discriminatorUser() ? 'Можно записаться' : selectedEvent.title"></span>
              </v-card-text>
              <v-card-actions>
                <v-card-actions>
                  <v-btn text color="secondary" v-if="selectedEvent.studentId === null && !discriminatorUser() && userID !== selectedEvent.studentId" @click="addEventStudent">
                    Подписаться
                  </v-btn>
                  <v-btn text color="secondary" v-else @click="selectedOpen = false">
                    Закрыть
                  </v-btn>
                </v-card-actions>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
      <v-dialog v-model="dialog" max-width="500px" persistent>
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
            <v-btn color="blue darken-1" text @click="confirm">
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
      return this.user.id
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
    isButtonPressed: [false, false, false,],
    num: 70,
    events: [],
    teachers: [],
    classesSelectorsToRemove: [],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    type: 'month',
    mode: 'stack',
    modes: [
      'column'
    ],
    value: '',
    selectedElement: null,
    selectedTeacher: null
  }),

  created() {
    this.initialize();
  },

  methods: {

    async addEventStudent(){

    },

    async initialize() {
      await this.getEventsTeacher();
    },

    async getEventsTeacher() {
      const teachers = new UsersRequest();
      await teachers.getActiveUser().catch(x => console.log(x)).then(x => {
        this.teachers = x.data.activeUsers
      })
    },

    async confirm() {
      let cal
      if (this.selectedTeacher) {
        await this.getEventsSelectedTeacher(this.selectedTeacher).catch(x => console.log(x)).then(x => {
          cal = x.data.practice.map(event => ({
            ...event,
            start: new Date(event.startTime),
            end: new Date(event.endTime)
          }));
        });
      }

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
      if (event.lectureType === 3) {
        return '#9DB9FF';
      } else if (event.lectureType === 2) {
        return '#E9E9E8';
      } else {
        return '#E9E9E8'
      }
    },

    changeButtonState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
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
.v-calendar-weekly__week {
  min-height: 20em;
}

@media screen and (max-width: 1260px) {
  .v-calendar-weekly__week {
    min-height: 10em;
  }
}

@media screen and (max-width: 600px) {
  .v-calendar-weekly__week {
    min-height: 5em;
  }
}

.theme--light.v-btn {
  color: #4E7AEC;
}

.v-event {
  display: flex;
  justify-content: center;
  max-width: 98%;
  background-color: rgb(157, 185, 255);
  border: black 1px;
  margin: 0 0 0 1.1%;
}

.v-event.v-event-start.v-event-end.white--text {
  min-width: 98%;
  max-width: 98%;
}

.v-event-more {
  font-size: 1em !important;
}

.btn {
  text-transform: unset !important;
  font-size: 1.5em;
}

.custom-bg {
  background-color: #1e1f22;
}

.custom_text {
  color: white;
}

.event {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-format {
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6em;
  max-width: 10em;
}
</style>