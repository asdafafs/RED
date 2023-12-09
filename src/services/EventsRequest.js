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
}