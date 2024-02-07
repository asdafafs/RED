import HTTPService from "@/services/HTTPService";

export default class CoursesRequest extends HTTPService {
    constructor() {
        super("Course");
    }

    getCourse(id) {
        return this.get("" + id)
    }

    getCourseNull() {
        return this.get("")
    }

    postCourse(code) {
        return this.post("", code)
    }

}