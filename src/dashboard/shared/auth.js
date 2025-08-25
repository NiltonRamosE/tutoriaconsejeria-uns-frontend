export function getUser() {
    return JSON.parse(localStorage.getItem('user')) || null;
}

export function getToken() {
    return localStorage.getItem('token');
}
