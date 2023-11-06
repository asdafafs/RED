import HttpService from "@/services/HttpService";

export default class VkAuthorizationService extends HttpService {

    constructor() {
        super("vk");
    }

    authenticate(code) {
        return this.post("authenticate", {
            code
        })
    }
    
    getUserVkId() {
        return this.get("user-vk-id")
    }
}