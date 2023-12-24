import HTTPService from "@/services/HTTPService";

export default class GroupsRequest extends HTTPService {
    constructor() {
        super("Group");
    }

    getGroups() {
        return this.get("")
    }

    getGroup(id) {
        return this.get("" + id)
    }

    postGroup(code) {
        return this.post("", code)
    }

    putGroup(code) {
        return this.put("", code)
    }

    deleteGroup(id) {
        return this.delete("" + id)
    }
}