import React, { useState, useEffect } from 'react';
import { fetchViewStudentSchedule } from '@/infrastructure/api/instructor';
import type { AcademicScheduleResponse } from '@/infrastructure/dto/academic-schedule/AcademicScheduleResponse';
import { formatTime } from '@/dashboard/shared/appointmentScheduleManager';

interface StudentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
  studentName: string;
}

const courseColors: Record<string, string> = {};
const colorPalette = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
  'bg-red-100 border-red-300 text-red-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-lime-100 border-lime-300 text-lime-800',
  'bg-cyan-100 border-cyan-300 text-cyan-800',
];

const getCourseColor = (course: string): string => {
  if (!courseColors[course]) {
    const index = Object.keys(courseColors).length % colorPalette.length;
    courseColors[course] = colorPalette[index];
  }
  return courseColors[course];
};

const StudentScheduleModal: React.FC<StudentScheduleModalProps> = ({ 
  isOpen, 
  onClose, 
  studentId,
  studentName 
}) => {
  const [schedules, setSchedules] = useState<AcademicScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  
  const hours: string[] = [];
  for (let hour = 7; hour <= 22; hour++) {
    hours.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  useEffect(() => {
    if (isOpen && studentId) {
      loadSchedule();
    }
  }, [isOpen, studentId]);

  const loadSchedule = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchViewStudentSchedule(studentId!);
      setSchedules(data);
    } catch (err) {
      console.error('Error loading student schedule:', err);
      setError('Error al cargar el horario del estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  const getScheduleForSlot = (day: string, time: string): AcademicScheduleResponse[] => {
    return schedules.filter(schedule => {
      if (schedule.day !== day) return false;
      
      const [startHour] = schedule.startTime.split(':').map(Number);
      const [endHour] = schedule.endTime.split(':').map(Number);
      const [currentHour] = time.split(':').map(Number);
      
      return currentHour >= startHour && currentHour < endHour;
    });
  };

  const getDuration = (startTime: string, endTime: string): number => {
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    return endHour - startHour;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] flex flex-col">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-theme-keppel/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-theme-rich-black">Horario Académico</h2>
                  <p className="text-sm text-gray-500">{studentName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 py-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
                <p className="mt-2 text-gray-500">Cargando horario...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={loadSchedule}
                  className="mt-4 bg-theme-keppel text-white px-4 py-2 rounded-lg hover:bg-theme-keppel-dark transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">No hay horarios registrados</p>
                <p className="text-sm mt-1">Este estudiante no tiene cursos asignados en el ciclo actual</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-visible">
                <div className="min-w-max">
                  <div className="grid grid-cols-[auto_repeat(6,minmax(200px,1fr))] gap-px bg-theme-rich-black/20 rounded-lg overflow-hidden border border-theme-rich-black/20">
                    <div className="bg-theme-keppel/10 p-3 font-bold text-theme-rich-black text-center sticky left-0 z-10">
                      Hora
                    </div>
                    {days.map(day => (
                      <div key={day} className="bg-theme-keppel/10 p-3 font-bold text-theme-rich-black text-center">
                        {day}
                      </div>
                    ))}

                    {hours.map(time => (
                      <React.Fragment key={time}>
                        <div className="bg-theme-seasalt p-2 text-xs text-theme-rich-black text-center border-b border-theme-rich-black/10 sticky left-0 z-10 font-medium">
                          {formatTime(time)}
                        </div>
                        
                        {days.map(day => {
                          const courses = getScheduleForSlot(day, time);
                          
                          return (
                            <div key={`${day}-${time}`} className="p-1 bg-white border-b border-theme-rich-black/10 min-h-[60px]">
                              {courses.length > 0 ? (
                                <div className="h-full flex flex-col gap-1">
                                  {courses.map((course, idx) => {
                                    const duration = getDuration(course.startTime, course.endTime);
                                    const colorClass = getCourseColor(course.course);
                                    const typeClass = course.type === 'TEO' 
                                      ? 'border-l-4 border-l-blue-500' 
                                      : 'border-l-4 border-l-green-500';
                                    
                                    return (
                                      <div 
                                        key={idx}
                                        className={`p-2 rounded-lg border ${colorClass} ${typeClass} shadow-sm hover:shadow-md transition-shadow`}
                                        style={{ height: `${duration * 56}px` }}
                                      >
                                        <p className="font-medium text-xs truncate" title={course.course}>
                                          {course.course.length > 40 ? course.course.substring(0, 40) + '...' : course.course}
                                        </p>
                                        <p className="text-2xs mt-1 font-semibold">
                                          {course.type === 'TEO' ? 'Teoría' : 'Laboratorio'}
                                        </p>
                                        <p className="text-2xs text-gray-500 mt-1">
                                          {formatTime(course.startTime)} - {formatTime(course.endTime)}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <span className="text-gray-300 text-xs">-</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-between items-center z-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Teoría</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Laboratorio</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentScheduleModal;