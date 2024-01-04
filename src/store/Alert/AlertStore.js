export const AlertStore = {
    namespaced: true,
    state: {
        isActive: false,
        message: '',
        timeoutId: 0,
        alertType: 'error',
    },
    actions: {
        CALL_ALERT: function ({state}, {message, delay, alertType}) {
            delay ??= 5000;
            alertType ??= 'error'
            state.alertType = alertType;
            state.isActive = true;
            state.message = message;
            state.timeoutId = setTimeout(() => state.isActive = false, delay)
        }
    }
}