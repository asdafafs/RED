<template>
  <div style="width: 100%">
    <div class="desk-title">
      Аналитика
    </div>
    <hr>
    <div :class="isMobile ? 'analytics-mobile-filters' : 'analytics-desktop-filters'">
      <v-autocomplete
          v-for="filter in filterItems"
          v-model="filters[filter.key]"
          class="select-user-template v-text-field-custom-h-32 mr-3"
          :class="isMobile ? 'mobile-filter-item' : 'desktop-filter-item'"
          outlined
          dense
          hide-details
          height="41"
          :placeholder="filter.placeholder"
          no-data-text="Нет данных для отображения"
          :items="filter.items"
          :item-text="filter.textField"
          :item-value="filter.valueField"
          clearable
      />
      <v-menu
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px">
        <template v-slot:activator="{ on }">
          <v-text-field
              v-on="on"
              v-model="selectedPeriodText"
              placeholder="Период"
              outlined
              dense
              append-icon="event"
              class="text-field-date-template mr-3"
              :class="isMobile ? 'mobile-filter-item' : 'desktop-filter-item'"
              hide-details
          />
        </template>
        <v-date-picker
            v-model="filters.selectedPeriod"
            ref="startDatePicker"
            no-title
            range
            class="date-picker"
            :first-day-of-week="1"
        />
      </v-menu>
      <v-btn
          color="#4E7AEC"
          class="add-instructor-btn"
          style="max-width: 150px"
          @click="clearFilters"
      >
        <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
          <span class="add-instructor-text ml-0">Сбросить</span>
        </section>
      </v-btn>
    </div>
    <span class="total-count-text">
      Всего записей: {{ analyticsDataCount }}
    </span>
    <v-data-table
        :headers="headers"
        :items="analyticsData"
        class="custom-header-table"
        style="border-bottom: thin solid rgba(0, 0, 0, 0.12); border-radius: unset !important;"
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true"
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2 header-grid-text px-0' }"
        mobile-breakpoint="0"
    >
      <template v-slot:item="{ item }">
        <tr style="height: 64px !important;">
          <td>{{ item.activeUserFullName || '-' }}</td>
          <td>{{ item.studentFullName || '-'}}</td>
          <td>{{ item.startTime || '-' }}</td>
          <td>{{ getStatusName(item.practiceStateEnum) }}</td>
          <td>{{ getReasonName(item.practiceDeleteReasonEnum)}}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import VueTextMask from "vue-text-mask";
import {Icon} from '@iconify/vue2'
import UsersRequest from "@/services/UsersRequest";
import moment from "moment";
import {formatTransmissions} from "@/utils/utils";
import {mapState} from "vuex";
import {nextTick} from "vue";
export default {
  name:'AnalyticsPanel',
  components: {
    VueTextMask,
    Icon
  },
  data: () => ({
    headers: [
      {text: 'Инструктор', align: 'start', sortable: false, value: 'activeUserFullName', width: '25%'},
      {text: 'Студент', align: 'start', sortable: false, value: 'studentFullName', width: '25%'},
      {text: 'Дата практики', align: 'start', sortable: false, value: 'startTime', width: '15%'},
      {text: 'Статус практики', align: 'start', sortable: false, value: 'practiceStateEnum', width: '15%'},
      {text: 'Причина', align: 'start', sortable: false, value: 'practiceDeleteReasonEnum', width: '20%'},
    ],
    filters: {
      activeUserId: '',
      studentId: '',
      practiceStateEnum: '',
      practiceDeleteReasonEnum: '',
      selectedPeriod: '',
    },
    selectedPeriod: '',
    analyticsData: [],
    studentsList: [],
    teachersList: [],
    reasonsList: [
      {
        id: 1,
        value: 'Ремонт'
      },
      {
        id: 2,
        value: 'Семейные обстоятельства'
      },
      {
        id: 3,
        value: 'Экзамен'
      },
      {
        id: 4,
        value: 'Здоровье'
      },
      {
        id: 5,
        value: 'Задачи офиса'
      }
    ],
    statusesList: [
      {
        id: 0,
        value: 'Актуальная'
      },
      {
        id: 1,
        value: 'Закрыта'
      },
      {
        id: 2,
        value: 'Сгорела'
      },
      {
        id: 3,
        value: 'Отменена'
      }
    ],
    clearingFilters: false,
    firstChangeOfFilters: false
  }),
  async beforeMount() {
    this.firstChangeOfFilters = true
    this.filters.selectedPeriod = this.getStartDate()
    await this.getAnalyticsData();
    this.firstChangeOfFilters = false
    await this.getInstructors()
    await this.getStudents()
  },
  watch:{
    filters: {
      handler(newVal) {
        if (newVal) {
          if (newVal.selectedPeriod.length === 1 || this.clearingFilters || this.firstChangeOfFilters) return
          this.getAnalyticsData()
        }
      },
      deep: true,
    }
  },
  computed:{
    ...mapState(['isMobile']),
    selectedPeriodText() {
      if (this.filters.selectedPeriod.length === 2) {
        this.filters.selectedPeriod.sort()
        return moment(this.filters.selectedPeriod[0]).format('DD.MM.YY') + ' - ' + moment(this.filters.selectedPeriod[1]).format('DD.MM.YY')
      }
      if (this.filters.selectedPeriod.length === 1) {
        return moment(this.filters.selectedPeriod[0]).format('DD.MM.YY')
      }
      return ''
    },
    filterItems() {
      return [
        {
          id: 1,
          placeholder: 'Инструктор',
          key: 'activeUserId',
          items: this.teachersList,
          textField: 'shortName',
          valueField: 'id'
        },
        {
          id: 2,
          placeholder: 'Студент',
          key: 'studentId',
          items: [ { id: null, shortName: 'Студент не назначен' }, ...this.studentsList],
          textField: 'shortName',
          valueField: 'id'
        },
        {
          id: 3,
          placeholder: 'Статус',
          key: 'practiceStateEnum',
          items: this.statusesList,
          textField: 'value',
          valueField: 'id'
        },
        {
          id: 4,
          placeholder: 'Причина',
          key: 'practiceDeleteReasonEnum',
          items: this.reasonsList,
          textField: 'value',
          valueField: 'id'
        },
      ]
    },
    usersRequest() {
      return new UsersRequest();
    },
    analyticsDataCount() {
      return this.analyticsData.length ? this.analyticsData.length : 0
    }
  },
  methods: {
    getStartDate() {
      const today = moment();
      const firstDayOfWeek = today.clone().weekday(1);
      const lastDayOfWeek = today.clone().weekday(7);
      return [firstDayOfWeek.format('YYYY-MM-DD'), lastDayOfWeek.format('YYYY-MM-DD')];
    },
    async getAnalyticsData() {
      const data = {
        activeUserId: this.filters.activeUserId,
        studentId: this.filters.studentId,
        practiceStateEnum: this.filters.practiceStateEnum,
        practiceDeleteReasonEnum: this.filters.practiceDeleteReasonEnum,
        start: this.filters.selectedPeriod[0],
        end: this.filters.selectedPeriod[1],
      }
      await this.usersRequest.getUserStatInfo(data).then(({data}) => {
        this.analyticsData = data.practice
        this.analyticsData.forEach(x => x.startTime = moment(x.startTime).format('DD.MM.YY HH:mm'))
      })
    },
    async getInstructors() {
      await this.usersRequest.getActiveUser().then(({data}) => {
        this.teachersList = data.activeUsers;
        this.teachersList = this.teachersList.map(x => ({
          shortName: x.surname + " " + x.name.charAt(0) + ". " + x.middleName.charAt(0) + ".",
          ...x
        }))
      })
    },
    async getStudents() {
      const query = 'ShowDeleted=false'
      await this.usersRequest.getUsers(query).then((response) => {
        this.studentsList = response.data.students;
        this.studentsList = this.studentsList.map(x => ({
          shortName: x.surname + " " + x.name.charAt(0) + ". " + x.middleName.charAt(0) + ".",
          ...x
        }))
      })
    },
    getStatusName(statusNumber) {
      return (this.statusesList.find(x => x.id === statusNumber)?.value || '-')
    },
    getReasonName(reasonNumber) {
      return (this.reasonsList.find(x => x.id === reasonNumber)?.value || '-')
    },
    clearFilters() {
      this.clearingFilters = true
      this.filters.activeUserId = '';
      this.filters.studentId = '';
      this.filters.practiceStateEnum = '';
      this.filters.practiceDeleteReasonEnum = '';
      this.filters.selectedPeriod = this.getStartDate()
      this.clearingFilters = false
    }
  },
};
</script>
<style lang="scss">
.total-count-text {
  font-weight: 600;
  font-size: 16px;
  line-height: 18.75px;
  color: #2B2A29;
  margin-left: 16px;
}

.analytics-mobile-filters {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-bottom: 8px;
}

.analytics-desktop-filters {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
}

.mobile-filter-item {
  width: 100%;
  border-radius: 12px !important;
  max-height: 32px !important;
}

.desktop-filter-item {
  width: 256px;
  max-width: 256px;
  border-radius: 12px !important;
  max-height: 32px !important;
}

.date-picker {
  .v-date-picker-table .v-btn.v-btn--active {
    color: #82b1ff;

    .v-btn__content {
      color: white;
    }
  }
}
</style>