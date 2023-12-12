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
            // Check if the current URL is not equal to "https://anton.mlsat.ru"
            console.log(window.location.href !== "https://anton.mlsat.ru/")
            if (window.location.href !== "https://anton.mlsat.ru/") {
                // Check if the error status is 401 (Unauthorized)
                if (error.response && error.response.status === 401 && window.location.href !== "https://anton.mlsat.ru/") {
                    // Display an alert
                    alert("Не авторизован (Not authorized)");

                    // Redirect the user to "https://anton.mlsat.ru"
                    window.location.replace("https://anton.mlsat.ru");
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