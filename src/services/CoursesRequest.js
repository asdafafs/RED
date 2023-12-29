import HTTPService from "@/services/HTTPService";

export default class CoursesRequest extends HTTPService {
    constructor() {
        super("Course");
    }

    getCourses(id) {
        return this.get("" + id)
    }

    postCourse(code) {
        return this.post("", code)
    }

}