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
      viewStudent: "/administrator/view/student/:studentId",
      viewInstructor: "/administrator/view/instructor/:instructorId",
    },
    schedule:{
      compare: "/academic-schedule/compare/:studentId/:instructorId",
      byCycle: "/academic-schedule",
      instructorSchedule: "/instructor-schedule",
    },
    student: {
      assignedInstructor: "/student/assigned/instructor/:studentId",
      assignedByInstructor: "/student/assigned/:instructorId",
      individualAppointment: "/student/appointment/individual",
      groupAppointment: "/student/appointment/group",
      getById: "/student/:id",
      appointmentsSent: "/student/appointments/sent/:studentId",
      appointmentsReceived: "/student/appointments/received/:studentId",
      confirmIndividual: "/student/appointments/confirm/:appointmentId",
      confirmGroup: "/student/appointments/confirm/:appointmentId/:studentId",
      cancelIndividual: "/student/appointments/cancel/:appointmentId",
      cancelGroup: "/student/appointments/cancel/:appointmentId/:studentId",
    },
    instructor: {
      assignedStudents: "/instructor/assigned/:instructorId",
      individualAppointment: "/instructor/appointment/individual",
      groupAppointment: "/instructor/appointment/group",
      appointmentsSent: "/instructor/appointments/sent/:instructorId",
      appointmentsReceived: "/instructor/appointments/received/:instructorId",
      confirmAppointment: "/instructor/appointments/confirm/:appointmentId",
      cancelAppointment: "/instructor/appointments/cancel/:appointmentId",
    },
  },
};