export default {
    data() {
        return {
            message: null,
            isConfirmRequired: false,
        }
    },
    created() {
        this.isConfirmRequired = this.$route.query.isConfirmRequired
        if (this.isConfirmRequired) {
            this.message = "На указанный адрес электронной почты было отправлено письмо с подтверждением"
        }
    }
}
