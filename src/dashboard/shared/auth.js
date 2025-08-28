export function getUser() {
    return JSON.parse(localStorage.getItem('user')) || null;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isTokenPresent(token){
    if (!token || token !== getToken()) {
        throw new Error('No hay token de autenticación o es inválido');
    }
}