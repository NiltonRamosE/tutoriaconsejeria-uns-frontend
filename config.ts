/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 **/

export const config = {
  apiUrl:"http://localhost:8080/api",
  environment:"development",
  endpoints: {
    auth:{
      login: "/auth/login",
    },
    administrator:{
      listAssignedStudents: "/administrator/assign/list",
      assignStudents: "/administrator/students/assign",
      listInstructors: "/administrator/instructors/list",
      create: "/administrator",
      update: "/administrator/update",
      delete: "/administrator/:id",
      list: "/administrator",
      studentsByFilter: "/administrator/:endpoint",
    },
    schedule:{
      compare: "/academic-schedule/compare/:studentId/:instructorId",
      byCycle: "/academic-schedule",
      instructorSchedule: "/instructor-schedule",
    }
  },
};