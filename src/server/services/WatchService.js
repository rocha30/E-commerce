
import axios from 'axios';
import { API_BASE_URL, API_KEY } from '../config/apiConfig';


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }
});

export function fetchBrands() {
    return api.get('/brands');
}

export function fetchModels(brand) {
    return api.get('/models', { params: { brand } });
}

export function fetchWatchByReference(reference) {
    return api.get('/watch', { params: { reference } });
}
