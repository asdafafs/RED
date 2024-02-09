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

    postLecture(code) {
        return this.post("lecture", code)
    }

    putLecture(code) {
        return this.put("lecture", code)
    }

    deleteLecture(id) {
        return this.delete("lecture/" + id)
    }

    getPracticeActiveUser(id) {
        return this.get("practice/" + id)
    }

    getPractice() {
        return this.get("practice")
    }

    getPracticeId(id){
        return this.get("practice/" + id)
    }

    postPractice(code) {
        return this.post("practice", code)
    }

    putPractice(code) {
        return this.put("practice", code)
    }

    deletePractice(id) {
        return this.delete("practice/" + id)
    }

    setStudent(code){
        return this.put("practice/setstudent", code)
    }
}