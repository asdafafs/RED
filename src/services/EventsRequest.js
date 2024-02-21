import HTTPService from "@/services/HTTPService";

export default class EventsRequest extends HTTPService {
    constructor() {
        super("Event");
    }

    getLecture() {
        return this.get("lecture")
    }

    getLectureActiveUser(id) {
        return this.get("lecture/" + id)
    }

    getLectureGroupId(groupId) {
        return this.get("lecture/" + groupId)
    }

    getPracticeActiveUser(id) {
        return this.get("practice/" + id)
    }


    postPractice(code) {
        return this.post("practice", code)
    }

    putPractice(code) {
        return this.put("practice", code)
    }

    getPracticeId(id) {
        return this.get("practice/" + id)
    }


    setStudent(code) {
        return this.put("practice/setstudent", code)
    }

    closePractice(code) {
        return this.put("practice/close", code)
    }
}