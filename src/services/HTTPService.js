import axios from "axios";
import store from "@/store";
import {errorAlert} from "@/components/Alerts/alert";

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


    get(path, isAlertHandler = false) {
        let response = this.baseRequest(path, "GET")
        response = this._checkErrorHandling(response, isAlertHandler)
        return response
    }

    post(path, body, isAlertHandler = false) {
        let response = this.baseRequest(path, "POST", body)
        response = this._checkErrorHandling(response, isAlertHandler)
        return response
    }

    put(path, body, isAlertHandler = false) {
        let response = this.baseRequest(path, "PUT", body)
        response = this._checkErrorHandling(response, isAlertHandler)
        return response
    }

    delete(path, isAlertHandler = false) {
        let response = this.baseRequest(path, "DELETE");
        response = this._checkErrorHandling(response, isAlertHandler)
        return response
    }

    _checkErrorHandling(promise, isAlertHandler) {
        return this._addErrorHandler(promise, isAlertHandler);
    }

    _addErrorHandler(promise, isAlertHandler) {
        return new Promise((resolve, reject) => {
            promise.catch(error => {
                if(error.response.request.status === 401 || error.response.request.status === 404 || error.response.request.status === 500 || isAlertHandler){
                    const message = this.getErrorMessage(error)
                    errorAlert(message, 4000);

                    reject(false);
                }
                reject()
            })
            resolve(promise)
        });
    }

    getErrorMessage(error){
        return error.message ?? 'Произошла неизвестная ошибка'

    }
}