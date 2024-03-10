import HTTPService from "@/services/HTTPService";

export default class UsersRequest extends HTTPService {
    constructor() {
        super("User");
    }

    getUsers(isAlertHandler = false) {
        return this.get("student", isAlertHandler)
    }

    getStudentId(id, isAlertHandler = false){
        return this.get("student/" + id, isAlertHandler)
    }

    getStudentNullGroup(isAlertHandler = false){
        return this.get("student/nullGroup", isAlertHandler)
    }

    postUser(code, isAlertHandler = false) {
        return this.post("student", code, isAlertHandler)
    }

    putUser(code, isAlertHandler= false) {
        return this.put("student", code, isAlertHandler)
    }

    deleteUser(id, isAlertHandler = false) {
        return this.delete("student/" + id, isAlertHandler)
    }

    putStudentGroup(code, isAlertHandler= false){
        return this.put("studentGroup", code, isAlertHandler)
    }

    postActiveUser(code, isAlertHandler= false) {
        return this.post('active-user', code, isAlertHandler)
    }

    putActiveUser(code, isAlertHandler= false) {
        return this.put('active-user', code, isAlertHandler)
    }

    deleteActiveUser(id, isAlertHandler = false) {
        return this.delete("active-user/" + id, isAlertHandler)
    }

    getActiveUserId(id, isAlertHandler = false) {
        return this.get("active-user/" + id, isAlertHandler)
    }

    getActiveUser(isAlertHandler = false) {
        return this.get("active-user", isAlertHandler)
    }
}