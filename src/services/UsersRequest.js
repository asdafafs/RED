import HTTPService from "@/services/HTTPService";

export default class UsersRequest extends HTTPService {
    constructor() {
        super("User");
    }

    getUser() {
        return this.get("student")
    }

    postUser(code) {
        return this.post("student", code)
    }

    putUser(code) {
        return this.put("student", code)
    }

    deleteUser(id) {
        return this.delete("student/" + id)
    }

    postActiveUser(code) {
        return this.post('active-user', code)
    }

    putActiveUser(code) {
        return this.put('active-user', code)
    }

    deleteActiveUser(id) {
        return this.delete("active-user/" + id)
    }

    getActiveUserId(id) {
        return this.get("active-user/" + id)
    }

    getActiveUser() {
        return this.get("active-user")
    }
}