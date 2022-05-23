import {get, post} from "../utils/request";

let baseUrl = 'http://localhost:3000';

let urlFactory = {
    userLogin: () => (baseUrl + '/login'),
};

export const userLogin = (data) => get(urlFactory.userLogin() + data);
