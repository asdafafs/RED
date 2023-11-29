import HttpService from "@/services/HttpService";

export default class IdentityService extends HttpService {

    constructor() {
        super("identity");
    }

    registerWithVk(code) {
        return this.post("login-vk", {
            code
        })
    }
    
    register(body) {
        return this.post("register", body)
    }
}