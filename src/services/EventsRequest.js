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
        return this.get("practice/assigned" + `?${query}` )
    }

    getPracticeId(id, query) {
        return this.get("practice/" + id + `?${query}`)
    }

    putPractice(code){
        return this.put("practice", code)
    }

    postPractice(code){
        return this.post("practice", code)
    }

    setStudent(code) {
        return this.put("practice/setstudent", code)
    }

    closePractice(code) {
        return this.put("practice/close", code)
    }

    cancelPractice(code){
        return this.put("practice/cancel", code)
    }
}