import axios from "axios";

export class HTTPService{
    basePath = 'api'
    backendUrl = 'https://localhost:7012'

    constructor(controller) {
        this.basePath = `${this.backendUrl}/${this.basePath}/${controller}`
    }

    baseRequest(path, methodType, body){
        const url = `${this.basePath}/${path}`
        const requestConfig = {
            withCredentials: false,
            baseURL: this.backendUrl,
            headers: {
                'Content-Type': 'application/json'
            },
        }

        switch (methodType){
            case "GET":
                return axios.get(url, requestConfig )
            case "POST":
                return axios.post(url,  body, )
            case "PUT":
                return axios.put(url, body, requestConfig)
            case "DELETE":
                return axios.delete(url, { data: body});
        }
    }

    get(path) {
        return this.baseRequest(path, "GET")
    }

    post(path, body) {
        return this.baseRequest(path, "POST", body)
    }

    put(path, body) {
        return this.baseRequest(path, "PUT", body)
    }

    delete(path, body) {
        return this.baseRequest(path, "DELETE", body);
    }
}