import {HTTPService} from "@/services/HTTPService";

export default class TestRequest extends HTTPService {
    constructor() {
        super("user");
    }

    getUser(){
        return this.get("GetStudent")
    }

    postUser(code){
        return this.post("AddStudent", code)
    }

    putUser(code){
        return this.put("UpdateStudent", code)
    }

    deleteUser(code){
        return this.delete("DeleteStudent", {id : code})
    }
}