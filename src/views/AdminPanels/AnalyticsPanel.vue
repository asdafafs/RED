<template>
  <div style="width: 100%;height: calc(100% - 40px)">
    <div class="desk-title" :class="{'ml-4': !isMobile}">
      Аналитика
    </div>
    <hr :class="{'ml-4': !isMobile}">
    <div :class="isMobile ? 'analytics-mobile-filters' : 'analytics-desktop-filters'">
      <v-autocomplete
          v-for="filter in filterItems"
          multiple
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
          
      >
        <template #selection="{ item, index }">
          <span v-if="filters[filter.key].length === 1">
            {{ item[filter.textField] }}
          </span>
          <span v-else>
            {{ index === 0 ? `${item[filter.textField]} + ${filters[filter.key].length - 1}` : '' }}
          </span>
        </template>
      </v-autocomplete>
<!--      @click:clear="onClear(filter.key)"-->
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
      <div class="d-flex flex-row" :class="{'justify-space-between': isMobile}" :style="{'width: 100%': isMobile}">
        <v-btn
            color="#fff"
            class="clear-filters-btn"
            style="max-width: 150px"
            @click="clearFilters"
        >
          <section class="d-flex flex-row align-center" style="padding: 12px 0 !important;">
            <span class="clear-filters-text ml-0">Сбросить все</span>
          </section>
        </v-btn>
        <v-btn
            color="#4E7AEC"
            class="add-instructor-btn"
            :class="{'ml-3': !isMobile}"
            style="max-width: 90px"
            @click="downloadExcel"
        >
          <section class="d-flex flex-row align-center" style="padding: 12px 0 !important;">
            <span class="add-instructor-text ml-0">Скачать</span>
          </section>
        </v-btn>
      </div>
    </div>
    <div :class="{'ml-4':!isMobile}" style="height: calc(100%  - 150px); background-color: firebrick" > 
      <ag-grid-vue
          ref="analyticsGrid"
          style="width: 100%; height: 100%;"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :rowData="analyticsData"
          groupDisplayType="groupRows"
          suppressAggFuncInHeader
      />
    </div>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-enterprise';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the grid
import VueTextMask from "vue-text-mask";
import {Icon} from '@iconify/vue2'
import UsersRequest from "@/services/UsersRequest";
import moment from "moment";
import {mapState} from "vuex";
import {ValueFormatterParams} from "ag-grid-community";
export default {
  name:'AnalyticsPanel',
  components: {
    VueTextMask,
    Icon,
    AgGridVue
  },
  data: () => ({
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      suppressHeaderMenuButton: true,
      resizable: false
    },
    autoGroupColumnDef: {
      headerName: "Группы",
      cellRendererParams: {
        suppressCount: true,
      },
    },
    filters: {
      activeUserId: null,
      studentId: null,
      practiceStateEnum: null,
      practiceDeleteReasonEnum: null,
      selectedPeriod: null,
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
        if (newVal.selectedPeriod.length === 1 || this.clearingFilters || this.firstChangeOfFilters) return
        this.getAnalyticsData()
      },
      deep: true,
    }
  },
  computed:{
    ...mapState(['isMobile']),
    columnDefs() {
      return [
        {
          field: 'all',
          hide: true,
          rowGroup: true,
          valueFormatter: params => {
            return this.customGroupCellRenderer(params)
          },
        },
        {
          field: "activeUserFullName",
          rowGroup: true,
          hide: true,
          valueFormatter:  params => {
            return this.customGroupCellRenderer(params)
          },
        },
        {
          field: "startTime",
          headerName:'Дата практики'
        },
        { 
          field: "studentFullName",
          rowGroup: true,
          hide: true ,
          valueFormatter: params => {
            return this.customGroupCellRenderer(params)
          },
        },
        { 
          field: "duration",
          valueFormatter: params => params.value + ' ч',
          headerName:'Длительность',
          aggFunc: 'sum'
        },
        { 
          field: "practiceStateEnum" ,
          valueFormatter: params => this.getStatusName(params.value),
          headerName:'Статус практики',
        },
        { 
          field: "practiceDeleteReasonEnum",
          valueFormatter: params => this.getReasonName(params.value),
          headerName:'Причина',
        },
      ]
    },
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
          items: [ { id: 0, shortName: 'Студент не назначен' }, ...this.studentsList],
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
  },
  methods: {
    downloadExcel() {
      this.$refs.analyticsGrid.api.exportDataAsExcel({
        processCellCallback: (params) => {
          const colDef = params.column.getColDef()
          if (colDef.valueFormatter) {
            const valueFormatterParams = {
              ...params,
              data: params.node.data,
              node: params.node, 
              colDef: params.column.getColDef(),
            }
            return colDef.valueFormatter(valueFormatterParams);
          }
          if (params.node.group) {
            if (params.node.field === 'all') return `Всего ${params.node.aggData.duration} ч`
            if (params.node.field === 'activeUserFullName') return `Инструктор ${params.node.key} ${params.node.aggData.duration} ч`
            if (params.node.field === 'studentFullName') return `Студент ${params.node.key} ${params.node.aggData.duration} ч`
          }
          return params.value;
        },
      })
    },
    customGroupCellRenderer(params) {
      const { node, value } = params;
      if (node.group) {
        const totalHours = node.aggData.duration;
        if (node.field === 'activeUserFullName') {
          return `Инструктор ${value}  ${totalHours} ч`;
        }
        if (node.field === 'studentFullName') {
          return `Студент ${value ? value : 'не назначен'}  ${totalHours} ч`;
        }
        if (node.field === 'all') {
          return `Всего ${value}  ${totalHours} ч`;
        }
      }
      return value;
    },
    getStartDate() {
      const today = moment();
      const firstDayOfWeek = today.clone().weekday(1);
      const lastDayOfWeek = today.clone().weekday(7);
      return [firstDayOfWeek.format('YYYY-MM-DD'), lastDayOfWeek.format('YYYY-MM-DD')];
    },
    async getAnalyticsData() {
      console.log(this.filters.studentId)
      const data = {
        activeUserId: this.filters.activeUserId?.length ? this.filters.activeUserId : null,
        studentId: this.filters.studentId?.length ? this.filters.studentId[0] === 0 ? [] : this.filters.studentId : null ,
        practiceStateEnum: this.filters.practiceStateEnum?.length ? this.filters.practiceStateEnum : null,
        practiceDeleteReasonEnum: this.filters.practiceDeleteReasonEnum?.length ? this.filters.practiceDeleteReasonEnum : null,
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
      this.filters.activeUserId = null;
      this.filters.studentId = null;
      this.filters.practiceStateEnum = null;
      this.filters.practiceDeleteReasonEnum = null;
      this.filters.selectedPeriod = this.getStartDate()
      this.clearingFilters = false
    },
    /*onClear(key) {
      if (key === 'studentId') {
        this.filters.studentId = ''
      }
    }*/
  },
};
</script>
<style lang="scss">
.total-count-text {
  font-weight: 600;
  font-size: 16px;
  line-height: 18.75px;
  color: #2B2A29;
}

.analytics-mobile-filters {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-bottom: 8px;
}

.analytics-desktop-filters {
  margin-left: 16px;
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
.header-no-padding {
  th:first-of-type {
    padding-left: 0 !important;
  }
}

.ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-2 {
  padding-left: 17px;
  background-color: #EAEFF3;
  font-weight: 600;
}
.ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-1 {
  padding-left: 17px;
  background-color: #D6DAE1;
  font-weight: 600;
}
.ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-0 {
  background-color: #A6A8AA;
  font-weight: 600;
}
.ag-group-child-count {
  display: none !important;
}
.ag-theme-alpine {
  --ag-header-height: 30px;
  --ag-header-foreground-color: #4E7AEC;
  --ag-header-background-color: white;
}
.ag-theme-alpine .ag-header-cell {
  font-size: 16px;
  font-weight: 600;
  padding-left: 0 !important;
}
.ag-theme-alpine {
  /* disable all borders */
  --ag-borders: none;
  /* then add back a border between rows */
  --ag-row-border-width: 1px;
}

.clear-filters {
  &-btn {
    border-radius: 12px !important;
    height: 32px !important;
    width: 225px !important;
    text-transform: none !important;
    box-shadow: none;
  }

  &-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: black !important;
    line-height: 18.75px !important;
  }
}
</style>