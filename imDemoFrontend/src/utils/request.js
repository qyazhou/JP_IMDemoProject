import axios from 'axios'

export const get = function (url) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'GET'
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    })
};

export const post = function (url, data) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'POST',
            data: data
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    })
};