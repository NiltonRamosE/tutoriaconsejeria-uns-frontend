/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 **/

export const config = {
  apiUrl:"http://localhost:8080",
  environment:"development",
  endpoints: {
    auth:{
      login: "/api/auth/login",
    },
  },
};