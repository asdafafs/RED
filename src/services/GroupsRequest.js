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
    deleteGroup(id) {
        return this.delete("" + id)
    }

    getGroupStudent() {
        return this.get("student")
    }
}