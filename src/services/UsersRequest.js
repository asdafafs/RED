import HTTPService from "@/services/HTTPService";

export default class UsersRequest extends HTTPService {
    constructor() {
        super("User");
    }

    getUsers(query, isAlertHandler = false, ) {
        return this.get("student" + `?${query}`, isAlertHandler)
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

    getAllActiveUsers(isAlertHandler = false){
        return this.get("active-user-all", isAlertHandler)
    }

    getAccessibleTeacher(isAlertHandler = false){
        return this.get("active-user-for-student", isAlertHandler)
    }

    getCorrectTeacherForSelectedUser(id ,isAlertHandler = false){
        return this.get("active-user-for-student/" + id, isAlertHandler)
    }


    getCorrectStudentsForCurrentUser(isAlertHandler = false){
        return this.get("student-matching-for-active-user", isAlertHandler)
    }

    getCorrectStudentsForSelectedUser(id, isAlertHandler = false){
        return this.get("student-matching-for-active-user/" + id, isAlertHandler)
    }

    getFullStudentInfo(isAlertHandler = false){
        return this.get("student-full-info", isAlertHandler)
    }

    getUserStatInfo(data) {
        return this.post('getUserStatInfo/',data,false)
    }
}