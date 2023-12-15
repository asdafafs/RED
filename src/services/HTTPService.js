import axios from "axios";

export default class HttpService {
    basePath = 'api'
    //backendUrl = 'http://localhost:5105'
    //frontPageUrl = 'http://localhost:8080/'

    frontPageUrl = 'https://anton.mlsat.ru/'
    backendUrl = 'https://kamen.mlsat.ru'

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

        request.catch(error => {
            if (window.location.href !== this.frontPageUrl) {
                if (error.response && error.response.status === 401 && window.location.href !== this.frontPageUrl) {
                    alert("Не авторизован (Not authorized)");
                    window.location.replace(this.frontPageUrl);
                }
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