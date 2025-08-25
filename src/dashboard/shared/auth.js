export function getUser() {
    return JSON.parse(localStorage.getItem('user')) || null;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isTokenPresent(token){
    if (!token) {
        console.error('No hay token de autenticación');
        return;
    }
}