import axios from "axios";
import store from "@/store";

export default class HttpService {
    basePath = 'api'
    frontPageUrl = process.env.FRONT_PAGE_URL
    backendUrl = process.env.BACKEND_URL

    constructor(controller) {
        this.basePath = `${this.backendUrl}/${this.basePath}/${controller}`
    }

    baseRequest(path, methodType, body) {
        const url = `${this.basePath}/${path}`
        const requestConfig = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            baseURL: this.backendUrl
        }

        let request
        switch (methodType) {
            case "GET":
                request = axios.get(url, requestConfig)
                break
            case "POST":
                request = axios.post(url, body, requestConfig)
                break
            case "PUT":
                request = axios.put(url, body, requestConfig)
                break
            case "DELETE":
                request = axios.delete(url, requestConfig)
                break
        }

        request.catch(async error => {
            if (error.response.request.status === 401) {
                window.location.replace(`${this.frontPageUrl}?retry=${true}`);
            } else {
                await store.dispatch('AlertStore/CALL_ALERT', {
                    message: error.response.data.message,
                    delay: 5000,
                    alertType: 'error'
                })
            }
        });


        return request
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

    delete(path) {
        return this.baseRequest(path, "DELETE");
    }
}