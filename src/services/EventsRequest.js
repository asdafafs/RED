import HTTPService from "@/services/HTTPService";

export default class EventsRequest extends HTTPService {
    constructor() {
        super("Event");
    }

    getLecture() {
        return this.get("lecture")
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

    getPractice() {
        return this.get("practice")
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

}