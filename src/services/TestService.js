import HttpService from "@/services/HTTPService";

export default class TestService extends HttpService {
    constructor() {
        super("test");
    }

    getTest() {
        return this.get("test")
    }

    getTestException() {
        return this.get("test-exception")
    }
}