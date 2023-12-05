import axios from "axios";

export default class HttpService {
    basePath = 'api'
    backendUrl = 'http://localhost:5105'

    //backendUrl = 'https://red.mlsat.ru'

    constructor(controller) {
        this.basePath = `${this.backendUrl}/${this.basePath}/${controller}`
    }

    baseRequest(path, methodType, body) {
        const url = `${this.basePath}/${path}`
        const requestConfig = {
            withCredentials: false,
            baseURL: this.backendUrl
        }

        try {
            switch (methodType) {
                case "GET":
                    return axios.get(url, requestConfig)
                case "POST":
                    return axios.post(url, body, requestConfig)
                case "PUT":
                    return axios.put(url, body, requestConfig)
                case "DELETE":
                    return axios.delete(url, requestConfig)
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("Не авторизован");
                this.$router.push('/main').catch(err => {})
            }
            return error

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

    delete(path) {
        return this.baseRequest(path, "DELETE");
    }
}