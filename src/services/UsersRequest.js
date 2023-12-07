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

    deleteUser() {
        return this.delete("student")
    }
}