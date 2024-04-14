<template>
  <div class="alert" ref="snackbar" id="snackbar">
    <success-icon style="width: 18px; height: 18px" v-if="type === 'success'" class="icon"/>
    <warning-icon style="width: 18px; height: 18px" v-else-if="type === 'warning'" class="icon"/>
    <span>{{ message }}</span>
  </div>
</template>

<script>

import WarningIcon from "@/components/Icons/WarningIcon.vue";
import SuccessIcon from "@/components/Icons/SuccessIcon.vue";

export default {
  name: "Alert.vue",
  components: {SuccessIcon, WarningIcon},

  props: {
    message: {
      type: String,
      default: ''
    },
    type: String,
    infinity: false,
    timeout: {type: Number, default: 300},
    link: {
      type: Object,
      default: () => ({
        href: '',
        onClick: false,
        bind: {},
        text: '',
        target: '_self',
      }),
      required: false,
    }
  },
  mounted() {
    this.showSnackbar();
    // if (!document.querySelector('#snackbar')) {
    //   this.showSnackbar();
    // }

  },
  created() {
  },
  computed: {
    icon() {
      switch (this.type) {
        case 'success':
          return '$success'
        case 'warning':
          return '$warning'
        case 'error':
          return '$error'
        default:
          return ''
      }
    },
  },

  methods: {
    showSnackbar() {
      let x = this.$refs.snackbar;
      x.className = `show custom-${this.type}-alert`;
      if (!this.infinity) {
        setTimeout(() => {
              x.className = x.className.replace('show', '');
              this.$emit('destroy');
            },
            this.timeout,
        );
      }
    },

    destroyAlert() {
      let x = this.$refs.snackbar;
      x.className = x.className.replace('show', '');
      this.$emit('destroy')
    }
  }
}
</script>

<style scoped>
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: white;
  color: black;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border-radius: 12px;
  padding: 16px;
  position: fixed;
  z-index: 10000;
  left: 50%;
  bottom: 30px;
  line-height: 19px;
}

.icon {
  vertical-align: bottom;
  margin-right: 8px;
  margin-bottom: 1px;
}

.custom-info-alert {
  color: white !important;
  background-color: #2196f3 !important;
}

.custom-warning-alert {
  color: #2B2A29 !important;
  background-color: #FFCD6D !important;
}

.custom-success-alert {
  color: #2B2A29 !important;
  background-color: #8CED7C !important;
}

.custom-error-alert {
  color: #2B2A29 !important;
  background-color: #FF5252 !important;
}

.custom-dark-alert {
  color: white !important;
  background-color: #322F35 !important;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s;
  animation: fadein 0.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0
  }
}
</style>