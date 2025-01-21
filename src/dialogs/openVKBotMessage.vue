<template>
  <v-dialog max-width="470px" v-model="localVisible" persistent>
    <v-card
        class="vkBot-message-dialog"
        flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="vkBot-message-dialog_first-title">ПОДКЛЮЧЕНИЕ ПРОФИЛЯ VK</span>
        <span class="vkBot-message-dialog_second-title">Вы добавляете профиль VK</span>
      </v-card-title>
      <v-card-text class="pa-5 pt-0 pb-0">
        <div class="vkBot-message-dialog_text-panel">
          <div class="d-flex flex-column">
              <span class="vkBot-message-dialog_text-panel_text">
                Сейчас вы будете перенаправлены в окно авторизации через VK.
                После выполнения входа через VK в RED: Расписание вы можете использовать аккаунт VK при авторизации .
                Вход по e-mail также останется доступным.
                </span>
            <span class="vkBot-message-dialog_text-panel_title">Как получать уведомления</span>
            <span class="vkBot-message-dialog_text-panel_text">
                До выполнения входа перейдите и вступите в группу
              <span style="font-weight: 600">Red Автошкола - система уведомлений.</span>
                Чтобы получать уведомления VK об изменениях в расписании, напишите в сообщения сообществу — <span
                style="font-weight: 600">Хочу уведомления.</span>
              </span>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="pa-5">
        <div class="vkBot-message-dialog_actions" v-if="isWideEnough">
          <v-btn
              class="vkBot-message-dialog_actions_cancel-button"
              text
              @click="transitionVk"
          >
            <span>Перейти в группу</span>
          </v-btn>
          <v-btn
              class="vkBot-message-dialog_actions_save-button"
              @click="bindingVK"
          >
            <span>Войти через VK</span>
          </v-btn>
        </div>
        <div class="vkBot-message-dialog_actions_mobile" v-if="!isWideEnough">
          <v-btn
              class="vkBot-message-dialog_actions_mobile_cancel-button"
              text
              @click="transitionVk"
          >
            <span>Перейти в группу</span>
          </v-btn>
          <v-btn
              class="vkBot-message-dialog_actions_mobile_save-button"
              @click="bindingVK"
          >
            <span>Войти через VK</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "deletePracticeDialog",
  data: () => ({
    selectedReasonId: 1,
    typeOfReasonId: 1,
    localVisible: true,
    isWideEnough: window.innerWidth >= 400
  }),
  props: {
    data: {
      type: Object,
      default: {}
    },
  },

  mounted() {
    window.addEventListener('resize', this.updateWidth);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth);
  },

  methods: {
    updateWidth() {
      this.isWideEnough = window.innerWidth >= 400;
    },

    transitionVk() {
      const vkBotURL = 'https://vk.com/red_bot';
      window.open(vkBotURL, '_blank');
      this.$emit('destroy', false);
    },

    bindingVK() {
      this.linkVk()
      this.$emit('destroy', false)
    },

    async linkVk() {
      const clientId = process.env.CLIENT_ID
      const redirectUri = `${process.env.FRONT_PAGE_URL}/post-login`
      const display = process.env.DISPLAY
      const responseType = process.env.RESPONSE_TYPE
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    },
  }
}

</script>
<style scoped lang="scss">
.vkBot-message-dialog {
  border-radius: 12px;
  border: 1px solid grey;

  &_text-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &_text {
      color: #000000;
      font-size: 16px;
      font-weight: 400;
      line-height: 18.75px;
    }

    &_title {
      padding: 0 10px 0 10px;
      margin-bottom: 10px;
      margin-top: 10px;
      max-width: 290px;
      font-size: 20px;
      font-weight: 800;
      line-height: 24px;
      text-transform: none;
      color: #FEFEFE;
      background-color: #4E7AEC;
    }

  }

  &_first-title {
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    color: #A6A8AA;
    line-height: 14.06px;
    width: 100%;
    margin-bottom: 12px;
  }

  &_second-title {
    font-size: 32px;
    font-weight: 700;
    text-transform: none;
    color: black;
    line-height: 37.5px;
    width: 100%;
    word-break: keep-all;
  }

  &_third-title {
    background-color: #4E7AEC;
    font-size: 20px;
    font-weight: 800;
    text-transform: none;
    color: white;
    line-height: 24px;
    width: 100%
  }

  &_actions {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-transform: none !important;

    &_cancel-button {
      border-radius: 12px !important;
      border: 1px solid rgba(0, 0, 0, 0.53) !important;
      height: 32px !important;
      width: 155px !important;
      text-transform: none !important;

      span:first-of-type {
        color: black;
      }
    }

    &_save-button {
      border-radius: 12px !important;
      background-color: #4E7AEC !important;
      height: 32px !important;
      width: 142px !important;
      text-transform: none !important;

      span:first-of-type {
        color: white;
        font-weight: 600;
      }
    }
  }
  &_actions_mobile {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-transform: none !important;
    gap: 12px;

    &_cancel-button {
      border-radius: 12px !important;
      border: 1px solid rgba(0, 0, 0, 0.53) !important;
      height: 32px !important;
      width: 100% !important;
      text-transform: none !important;

      span:first-of-type {
        color: black;
      }
    }

    &_save-button {
      border-radius: 12px !important;
      background-color: #4E7AEC !important;
      height: 32px !important;
      width: 100% !important;
      text-transform: none !important;

      span:first-of-type {
        color: white;
        font-weight: 600;
      }
    }
  }
}
</style>