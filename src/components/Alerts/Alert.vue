<template>
  <div class="alert" ref="snackbar" id="snackbar">
    {{ message }}

    <v-btn
        v-bind="link.bind"
        :href="link.href"
        :target="link.target"
        class="letter-spacing__unset ml-2"
        light
        @click="destroyAlert(link)">
      {{ link.text }}
    </v-btn>
  </div>
</template>

<script>

export default {
  name: "Alert.vue",

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
    let x = this.$refs.snackbar;
    console.log(x)
    x.className = `show custom-${this.type}-alert`;
    console.log(x.className )

    if (!this.infinity) {

      setTimeout(() => {
            console.log('setTimeout')
            x.className = x.className.replace('show', '');
            this.$emit('destroy');
          },
          this.timeout,
      );
      console.log(this.timeout)

    }
  },
  created() {
    console.log('я родился', this.link)
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
    destroyAlert() {
      let x = this.$refs.snackbar;
      x.className = x.className.replace('show', '');
      this.$emit('destroy')
      console.log('destroy')
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
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 10000;
  left: 50%;
  bottom: 30px;
}

.custom-info-alert {
  color: white !important;
  background-color: #2196f3 !important;
}

.custom-warning-alert {
  color: white !important;
  background-color: #FF5722 !important;
}

.custom-success-alert {
  color: white !important;
  background-color: #4CAF50 !important;
}

.custom-error-alert {
  color: white !important;
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