import axios from "axios";

export default class HttpService {
    basePath = 'api'
    //backendUrl = 'http://localhost:5105'

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
            withCredentials: false,
            baseURL: this.backendUrl
        }

        let request
        console.log(methodType)
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
            console.log(window.location.href !== (`https://anton.mlsat.ru`))
            if (window.location.href !== (`https://anton.mlsat.ru`)) {
                if (error.response.status === 401) {
                    alert("Не авторизован");
                    window.location.replace(`https://anton.mlsat.ru`)
                }
            }

        })

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