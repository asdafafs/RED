import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import Alert from "@/components/Alerts/Alert.vue";

const $alert = (message, type, timeout) => {
    const props = {message, type, timeout}
    const component = new Vue({
        vuetify, render: (createElement) => createElement(Alert, {props})
    });


    component.$mount();
    document.getElementById('main').appendChild(component.$el);
    console.log(document.getElementById('main'))
    const destroy = () => {
        component.$off('destroy');
        document.getElementById('main').removeChild(component.$el)

    }


    setTimeout(destroy, timeout)


};

const defaultTimeOut = 4000

const successAlert = (message, timeout = defaultTimeOut) => {
    $alert(message, 'success', timeout)
}

const errorAlert = (message, timeout = defaultTimeOut) => {
    $alert(message, 'error', timeout)
}

const warningAlert = (message, timeout = defaultTimeOut) => {
    $alert(message, 'warning', timeout)
}

export {successAlert, errorAlert, warningAlert}