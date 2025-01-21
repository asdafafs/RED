import HTTPService from "@/services/HTTPService";

export default class IdentityRequest extends HTTPService {
    constructor() {
        super("Identity");
    }

    getIdentity() {
        return this.get("")
    }

    postLoginVkRegistration(code, redirectUri) {
        return this.post("login-vk", {
            code, redirectUri
        })
    }

    postBindVk(code, redirectUri) {
        return this.post("Bind", {
            code, redirectUri
        })
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
        return this.post('ConfirmNewPassword', code)
    }

    postLogout(code) {
        return this.post("logout", code)
    }

    postPasswordNewUser(code){
        return this.post("CreateUserPassword", code)
    }
}