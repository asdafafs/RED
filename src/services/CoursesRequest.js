import HTTPService from "@/services/HTTPService";

export default class CoursesRequest extends HTTPService {
    constructor() {
        super("");
    }

    getCourses() {
        return this.get("")
    }

    postCourse(code) {
        return this.post("", code)
    }

    putCourse(code) {
        return this.put("", code)
    }

    deleteCourse(id) {
        return this.delete("" + id)
    }
}