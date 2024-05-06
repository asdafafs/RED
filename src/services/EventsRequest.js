import HTTPService from "@/services/HTTPService";

export default class EventsRequest extends HTTPService {
    constructor() {
        super("Event");
    }

    getLectureActiveUser(id, query) {
        return this.get("lecture/" + id + `?${query}`)
    }

    getLectureGroupId(groupId, query) {
        return this.get("lecture/group/" + groupId + `?${query}`)
    }

    getPracticeActiveUser(id, query) {
        return this.get("practice/" + id + `?${query}`)
    }

    getPracticeAssigned(query) {
        return this.get("practice/assigned" + `?${query}`)
    }

    getOnlyAssigned(query) {
        return this.get("practice/assignedOnly" + `?${query}`)
    }

    getPracticeFreeOrAssigned(query) {
        return this.get("practice/freeOrAssigned" + `?${query}`)
    }

    getPracticeId(id, query) {
        return this.get("practice/" + id + `?${query}`)
    }

    putPractice(code) {
        return this.put("practice", code)
    }

    postPractice(code) {
        return this.post("practice", code)
    }

    setStudent(code) {
        return this.put("practice/setstudent", code)
    }

    closePractice(code) {
        return this.put("practice/close", code)
    }

    cancelPractice(code) {
        return this.put("practice/cancel", code)
    }

    postAdminPractice(code) {
        return this.post("admin/practice", code)
    }

    putAdminPractice(code) {
        return this.put("admin/practice", code)
    }

    setAdminStudent(code) {
        return this.post("admin/practice/setstudent", code)
    }

    closeAdminStudent(code) {
        return this.post("admin/practice/close", code)
    }

    canselAdminStudent(code) {
        return this.post("admin/practice/cansel", code)
    }

    getFreePracticeActiveUser(query) {
        return this.get("practice/free" + `?${query}`)
    }

    getPractices(query) {
        return this.get("practice" + `?${query}`)
    }

    getLessons(query) {
        return this.get("lecture" + `?${query}`)
    }

    getPracticesActiveUser(query) {
        return this.get("practice/null" + `?${query}`)
    }

    getLecturesStudent(id, query) {
        return this.get("lecture/student/" + id + `?${query}`)
    }

    getLectureCurrentUser(query) {
        return this.get("lecture/null" + `?${query}`)
    }
}