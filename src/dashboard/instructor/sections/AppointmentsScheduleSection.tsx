import React, { useState, useEffect } from 'react';
import { getUser } from '@/dashboard/shared/authUtils';
import { 
  fetchAppointmentsSent, 
  fetchAppointmentsReceived,
  fetchPutAppointmentConfirm,
  fetchPutAppointmentCancel
} from '@/infrastructure/api/instructor';
import { 
  formatDate, 
  formatTime, 
  getDayName, 
  getAppointmentStatusInfo, 
  getAttendanceInfo 
} from '@/dashboard/shared/appointmentScheduleManager';
import type { AppointmentScheduleSentResponse } from '@/infrastructure/dto/appointment-schedule/AppointmentScheduleSentResponse';
import type { AppointmentScheduleReceivedResponse } from '@/infrastructure/dto/appointment-schedule/AppointmentScheduleReceivedResponse';
import type { StudentAttendanceResponse } from '@/infrastructure/dto/appointment-schedule/StudentAttendanceResponse';

const InstructorAppointmentsScheduleSection: React.FC = () => {
  const [sentAppointments, setSentAppointments] = useState<AppointmentScheduleSentResponse[]>([]);
  const [receivedAppointments, setReceivedAppointments] = useState<AppointmentScheduleReceivedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStudents, setExpandedStudents] = useState<Set<number>>(new Set());

  const instructorData = getUser();
  const instructorId = instructorData?.id;

  // Cargar citas al montar el componente
  useEffect(() => {
    if (instructorId) {
      loadAppointments();
    }
  }, [instructorId]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      if (!instructorId) {
        console.error('No se encontró información del instructor');
        return;
      }

      const sent = await fetchAppointmentsSent(instructorId);
      setSentAppointments(sent);

      const received = await fetchAppointmentsReceived(instructorId);
      setReceivedAppointments(received);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId: number, chosenDateTime: string) => {
    try {
      await fetchPutAppointmentConfirm(appointmentId, chosenDateTime);
      alert('Cita confirmada exitosamente');
      await loadAppointments();
    } catch (err) {
      console.error('Error confirmando cita:', err);
      alert('Error al confirmar la cita');
    }
  };

  const cancelAppointment = async (appointmentId: number) => {
    try {
      await fetchPutAppointmentCancel(appointmentId);
      alert('Cita cancelada exitosamente');
      await loadAppointments();
    } catch (err) {
      console.error('Error cancelando cita:', err);
      alert('Error al cancelar la cita');
    }
  };

  const toggleViewMore = (appointmentId: number) => {
    setExpandedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };

  const renderStudentsList = (
    appointmentId: number,
    students: StudentAttendanceResponse[],
    isExpanded: boolean
  ) => {
    const maxStudentsToShow = 1;
    const hasMoreStudents = students.length > maxStudentsToShow;
    const studentsToShow = students.slice(0, maxStudentsToShow);

    if (students.length === 0) return null;

    return (
      <div className="mt-3 bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/10">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-medium text-sm text-theme-rich-black/80 flex items-center">
            <img src="/icons/group-users.svg" alt="Group Users Icon" className="h-4 w-4 mr-2" />
            Participantes ({students.length})
          </h5>
          {hasMoreStudents && (
            <button
              type="button"
              onClick={() => toggleViewMore(appointmentId)}
              className="text-theme-keppel text-xs font-medium hover:underline"
            >
              {isExpanded ? 'Ver menos' : 'Ver todos'}
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {(isExpanded ? students : studentsToShow).map((student) => {
            const { badgeClass, icon } = getAttendanceInfo(student.attendance);
            return (
              <li key={student.studentId} className="flex items-center justify-between p-2 bg-white rounded-lg border border-theme-rich-black/10">
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-theme-keppel rounded-full mr-2"></span>
                  <span className="text-sm text-theme-rich-black/70">{student.fullName}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass} border flex items-center gap-1`}>
                  {icon}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderVoteStats = (altScheduleCounts: Record<string, number>) => {
    if (!altScheduleCounts || Object.keys(altScheduleCounts).length === 0) return null;

    return (
      <div className="mt-3 bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
        <h5 className="font-medium text-sm text-blue-800 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Preferencias de horario del grupo
        </h5>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(altScheduleCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([dateTime, count]) => {
              const formattedDate = formatDate(dateTime.split('T')[0]);
              const formattedTime = formatTime(dateTime.split('T')[1]);
              const dayName = getDayName(dateTime);
              
              return (
                <div key={dateTime} className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100">
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-blue-900">
                      <span className="font-medium">{formattedDate}</span>
                      <span className="mx-2">•</span>
                      <span>{formattedTime}</span>
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">
                        {dayName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-800">{count}</span>
                    <span className="text-blue-600">👥</span>
                  </div>
                </div>
              );
            })}
        </div>
        <p className="text-xs text-blue-600 mt-2 italic">
          {Object.values(altScheduleCounts).reduce((sum, count) => sum + count, 0)} voto(s) en total
        </p>
      </div>
    );
  };

  const renderAppointmentCard = (
    appointment: AppointmentScheduleSentResponse | AppointmentScheduleReceivedResponse,
    isSent: boolean
  ) => {
    const apptDetails = appointment.appointmentResponse;
    const { senderFullName, receiverFullName, receiverStudents, altScheduleCounts } = appointment;
    
    const formattedDate = apptDetails.date ? formatDate(apptDetails.date) : '--';
    const formattedStartTime = apptDetails.startTime ? formatTime(apptDetails.startTime) : '--:--';
    const formattedEndTime = apptDetails.endTime ? formatTime(apptDetails.endTime) : '--:--';
    
    const { statusClass, statusIcon } = getAppointmentStatusInfo(apptDetails.state);
    
    const showVoteStats = altScheduleCounts && Object.keys(altScheduleCounts).length > 0 && apptDetails.appointmentModality === 'GRUPAL';
    const isExpanded = expandedStudents.has(apptDetails.id);
    const isPending = apptDetails.state === 'PENDIENTE';

    return (
      <div key={apptDetails.id} className="bg-white rounded-xl border border-theme-rich-black/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-fit">
        <div className="bg-gradient-to-r from-theme-keppel/5 to-theme-seasalt p-4 border-b border-theme-rich-black/10">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <img src="/icons/calendar-blank.svg" alt="Calendar Icon" className="h-4 w-4 text-theme-keppel" />
              <span className="text-sm font-medium text-theme-rich-black">{formattedDate}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass} border flex items-center gap-1`}>
              {statusIcon} {apptDetails.state || 'PENDIENTE'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-theme-rich-black/70">
            <img src="/icons/clock.svg" alt="Clock Icon" className="h-4 w-4" />
            <span>{formattedStartTime} - {formattedEndTime}</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-theme-keppel/10 p-2 rounded-lg">
              <img src="/icons/writing-in-paper.svg" alt="Writing in Paper Icon" className="h-4 w-4" />
            </div>
            <h4 className="font-semibold text-theme-rich-black">{apptDetails.typeActivity || 'Cita'}</h4>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
            <div className="flex items-center text-theme-rich-black/70">
              <img src="/icons/instructor-outline.svg" alt="Instructor Icon" className="h-4 w-4 mr-2" />
              <span><strong className="text-theme-rich-black">Con:</strong> {receiverFullName || 'Estudiantes Citados'}</span>
            </div>
            <div className="flex items-center text-theme-rich-black/70">
              <img src="/icons/student-outline.svg" alt="Student Icon" className="h-4 w-4 mr-2" />
              <span><strong className="text-theme-rich-black">De:</strong> {senderFullName || '--'}</span>
            </div>
          </div>
          
          <div className="bg-theme-seasalt rounded-lg p-3 mb-3">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-theme-rich-black/70 font-medium w-1/3">Modalidad:</td>
                  <td className="py-1 text-theme-rich-black">{apptDetails.appointmentModality || '--'}</td>
                </tr>
                <tr>
                  <td className="py-1 text-theme-rich-black/70 font-medium">Método:</td>
                  <td className="py-1 text-theme-rich-black">{apptDetails.appointmentMethod || '--'}</td>
                </tr>
                {apptDetails.specificAppointmentMethod && (
                  <tr>
                    <td className="py-1 text-theme-rich-black/70 font-medium">Método esp.:</td>
                    <td className="py-1 text-theme-rich-black">{apptDetails.specificAppointmentMethod}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1 text-theme-rich-black/70 font-medium">Razón:</td>
                  <td className="py-1 text-theme-rich-black">{apptDetails.appointmentReason || '--'}</td>
                </tr>
                {apptDetails.specificAppointmentReason && (
                  <tr>
                    <td className="py-1 text-theme-rich-black/70 font-medium">Detalles:</td>
                    <td className="py-1 text-theme-rich-black">{apptDetails.specificAppointmentReason}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {showVoteStats && renderVoteStats(altScheduleCounts)}
          
          {receiverStudents && receiverStudents.length > 0 && renderStudentsList(apptDetails.id, receiverStudents, isExpanded)}
          
          {isPending && (
            <div className="mt-3 pt-3 border-t border-theme-rich-black/10 space-y-3">
              {!isSent && (apptDetails as any).altScheduleA && (
                <div className="bg-gradient-to-br from-theme-seasalt to-theme-keppel/5 p-4 rounded-xl border border-theme-keppel/20">
                  <p className="text-sm font-medium text-theme-rich-black mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Selecciona un horario disponible:
                  </p>
                  <div className="space-y-2">
                    {['altScheduleA', 'altScheduleB', 'altScheduleC']
                      .filter(key => (apptDetails as any)[key])
                      .map((key, index) => {
                        const dateTime = (apptDetails as any)[key];
                        const formattedDate = formatDate(dateTime.split('T')[0]);
                        const formattedTime = formatTime(dateTime.split('T')[1]);
                        const dayName = getDayName(dateTime);
                        
                        return (
                          <label key={key} className="flex items-start p-3 rounded-lg border-2 border-theme-rich-black/10 hover:border-theme-keppel/50 cursor-pointer transition-all duration-200 bg-white hover:shadow-md group">
                            <input
                              type="radio"
                              name={`confirm-slot-${apptDetails.id}`}
                              value={dateTime}
                              className="mt-0.5 text-theme-keppel focus:ring-theme-keppel mr-3 transform group-hover:scale-110 transition-transform"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-theme-rich-black">Opción {index + 1}</span>
                                <span className="px-2 py-1 bg-theme-keppel/10 text-theme-keppel text-xs font-medium rounded-full">
                                  {dayName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 mt-1 text-sm text-theme-rich-black/70">
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {formattedDate}
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formattedTime}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
              
              {!isSent && (
                <button
                  className="w-full bg-theme-keppel hover:bg-theme-keppel-dark text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                  onClick={async () => {
                    const selected = document.querySelector(`input[name="confirm-slot-${apptDetails.id}"]:checked`) as HTMLInputElement;
                    if (!selected) {
                      alert('Debes seleccionar un horario antes de confirmar.');
                      return;
                    }
                    await confirmAppointment(apptDetails.id, selected.value);
                  }}
                >
                  ✅ Confirmar cita
                </button>
              )}
              
              <button
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                onClick={() => cancelAppointment(apptDetails.id)}
              >
                ❌ Cancelar cita
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Gestión de Citas</h2>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
          <p className="mt-2 text-gray-500">Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Gestión de Citas</h2>
      
      <div className="space-y-8">
        <h5 className="font-light text-gray-500">Es posible que necesites recargar la página para tener las citas actualizadas</h5>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-theme-rich-black">Citas que he solicitado</h3>
          <div className="space-y-3">
            {sentAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-theme-seasalt to-white rounded-2xl border border-dashed border-theme-rich-black/20">
                <img src="/icons/calendar-blank.svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" alt="Calendar icon" />
                <p className="text-lg font-medium">No hay citas solicitadas</p>
                <p className="text-sm mt-1">Cuando solicites citas, aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentAppointments.map(appointment => renderAppointmentCard(appointment, true))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-theme-rich-black">Citas que he recibido</h3>
          <div className="space-y-3">
            {receivedAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-theme-seasalt to-white rounded-2xl border border-dashed border-theme-rich-black/20">
                <img src="/icons/calendar-blank.svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" alt="Calendar icon" />
                <p className="text-lg font-medium">No hay citas recibidas</p>
                <p className="text-sm mt-1">Cuando recibas citas, aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {receivedAppointments.map(appointment => renderAppointmentCard(appointment, false))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAppointmentsScheduleSection;