import {get, post} from "../utils/request";

let baseUrl = 'http://localhost:3000';

let urlFactory = {
    msgList: () => (baseUrl + '/msgList'),
};

export const msgList = (data) => get(urlFactory.msgList() + data);
