import HTTPService from "@/services/HTTPService";

export default class IdentityRequest extends HTTPService {
    constructor() {
        super("Identity");
    }

    getIdentity() {
        return this.get("")
    }

    postLoginVk() {
        return this.post("login-vk")
    }

    postRegister(code) {
        return this.post("register", code)
    }

    postLogin(code) {
        return this.post("login", code)
    }

    postEmail(code) {
        return this.post("confirm-email", code)
    }

    postForgetPassword(code) {
        return this.post('ForgetPassword', code)
    }

    postNewPassword(code) {
        return this.post('ConfirmNewPassword',code)
    }

    postLogout() {
        return this.post("logout")
    }
}