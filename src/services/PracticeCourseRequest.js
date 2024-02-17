import HTTPService from "@/services/HTTPService";

export default class PracticeCourseRequest extends HTTPService {
    constructor() {
        super("PracticeCourse");
    }

    postPracticeCourse(code){
        return this.post("", code)
    }

    getPracticeCourseId(practiceCourseId ){
        return this.get("course/" + practiceCourseId )

    }

    getPracticeCourseActiveUser(activeUserId ){
        return this.get("activeUser/" + activeUserId )

    }
}