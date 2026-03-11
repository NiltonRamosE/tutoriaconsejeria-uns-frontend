import React, { useState } from 'react';
import type { UserType } from '@/domain/types/UserType';
import type { LoginRequest } from '@/infrastructure/dto/auth/LoginRequest';
import { login } from '@/infrastructure/api/auth';

export function LoginSection() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    institutionalEmail: '',
    password: ''
  });

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setShowLoginForm(true);
  };

  const handleBackToSelection = () => {
    setShowLoginForm(false);
    setSelectedUserType(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      institutionalEmail: formData.institutionalEmail,
      password: formData.password
    };

    try {
      const data = await login(payload);
      
      if (data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.userResponse));
        window.location.href = `/dashboard/${data.userType}`;
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getFormTitle = (): string => {
    switch(selectedUserType) {
      case 'student':
        return 'Inicio de sesión para Estudiantes';
      case 'instructor':
        return 'Inicio de sesión para Docentes';
      case 'administrator':
        return 'Inicio de sesión para Administradores';
      default:
        return '';
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 pt-22 md:pt-20">
      {/* PARA PC */}
      <div className="hidden md:block">
        <img
          src="/images/bg-login-pc.webp"
          alt="Imagen de bienvenida"
          className="w-md h-md lg:w-lg lg:h-lg xl:w-4xl xl:h-4xl"
          loading="lazy"
        />
      </div>

      <div className="md:hidden w-full relative p-0">
        <div className="m-0 h-full w-full absolute">
          <div className="overflow-hidden h-full absolute w-full">
            <img
              src="/images/bg-message.webp"
              alt="Imagen de bienvenida"
              className="w-full h-full scale-160 object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="relative w-full h-full pt-18 p-8 md:p-10 md:pb-0 sm:p-15 sm:pb-0 pb-0">
          <div>
            <h1 className="text-5xl sm:text-6xl font-semibold mb-2">¡Bienvenido!</h1>
          </div>
          <div className="flex w-full mb-0 p-0 justify-between flex-wrap">
            <p className="w-1/2 text-xl sm:text-3xl font-light">
              Probar o crecer, todo comienza aquí.
            </p>

            <div className="w-1/2">
              <img
                src="/images/bg-login-guy.webp"
                alt="Imagen de bienvenida"
                className="object-cover scale-x-[-1]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 sm:px-10 lg:px-0 md:rounded-none md:mt-0 rounded-b-none rounded-4xl z-20 mt-[-50px] bg-white pt-10">
        <div className="w-full max-w-md">
          <div className="transition-all duration-300">
            {!showLoginForm ? (
              <div className="w-full">
                <h2 className="text-3xl font-bold mb-10 text-center">¿Cómo deseas ingresar?</h2>
                <div className="grid grid-cols-1 gap-8 mb-8">
                  {/* Tarjeta Estudiante */}
                  <button
                    onClick={() => handleUserTypeSelect('student')}
                    className="group bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium p-8 rounded-3xl hover:bg-theme-keppel/5 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-theme-keppel/20 text-left h-full flex flex-col"
                  >
                    <div className="flex items-start mb-6">
                      <div className="mr-6 w-16 h-16 bg-theme-keppel rounded-2xl flex items-center justify-center group-hover:bg-theme-keppel-dark transition-colors duration-300">
                        <span className="text-2xl">👨‍🎓</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl mb-2">Estudiante</h3>
                        <p className="text-base font-light text-gray-600">Programa tus citas de tutoría y consejería.</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-theme-rich-black/20">
                      <div className="flex items-center text-theme-keppel font-medium">
                        <span>Ingresar como estudiante</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Tarjeta Docente */}
                  <button
                    onClick={() => handleUserTypeSelect('instructor')}
                    className="group bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium p-8 rounded-3xl hover:bg-theme-keppel/5 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-theme-keppel/20 text-left h-full flex flex-col"
                  >
                    <div className="flex items-start mb-6">
                      <div className="mr-6 w-16 h-16 bg-theme-keppel rounded-2xl flex items-center justify-center group-hover:bg-theme-keppel-dark transition-colors duration-300">
                        <span className="text-2xl">👩‍🏫</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl mb-2">Docente</h3>
                        <p className="text-base font-light text-gray-600">Gestiona tus tutorados y aconsejados, además de agilizar tus reportes.</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-theme-rich-black/20">
                      <div className="flex items-center text-theme-keppel font-medium">
                        <span>Ingresar como docente</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Tarjeta Administrador */}
                  <button
                    onClick={() => handleUserTypeSelect('administrator')}
                    className="group bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium p-8 rounded-3xl hover:bg-theme-keppel/5 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-theme-keppel/20 text-left h-full flex flex-col"
                  >
                    <div className="flex items-start mb-6">
                      <div className="mr-6 w-16 h-16 bg-theme-keppel rounded-2xl flex items-center justify-center group-hover:bg-theme-keppel-dark transition-colors duration-300">
                        <span className="text-2xl">👨‍💼</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl mb-2">Administrador</h3>
                        <p className="text-base font-light text-gray-600">Gestiona la plataforma, usuarios y configuración del sistema</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-theme-rich-black/20">
                      <div className="flex items-center text-theme-keppel font-medium">
                        <span>Ingresar como administrador</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div 
                  className="flex items-center mb-6 cursor-pointer" 
                  onClick={handleBackToSelection}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Volver a selección</span>
                </div>

                <h2 className="text-2xl font-bold mb-6">{getFormTitle()}</h2>
                
                <form onSubmit={handleSubmit}>
                  <input type="hidden" value={selectedUserType || ''} />
                  
                  <div className="mb-10 md:mb-5 xl:mb-10">
                    <label htmlFor="institutionalEmail" className="block text-sm font-bold">
                      Correo Institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="institutionalEmail"
                      name="institutionalEmail"
                      required
                      autoComplete="username"
                      value={formData.institutionalEmail}
                      onChange={handleInputChange}
                      className="w-full md:w-xs lg:w-full border rounded-md px-4 py-2 mt-1 border-theme-rich-black/40"
                    />
                  </div>

                  <div className="mb-10 md:mb-5 xl:mb-10 relative">
                    <label htmlFor="password" className="block text-sm font-bold">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full md:w-xs lg:w-full border rounded-md px-4 py-2 mt-1 border-theme-rich-black/40 pr-12"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-theme-keppel focus:outline-none"
                        aria-label="Mostrar/ocultar contraseña"
                      >
                        {!showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-xs lg:w-full bg-theme-keppel text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-3 px-6 rounded-2xl hover:bg-theme-keppel/90 transition-colors duration-200"
                  >
                    Iniciar sesión
                  </button>
                </form>

                <div className="w-full md:w-xs lg:w-full my-10 md:my-4 lg:my-10 border-t border-theme-rich-black/40"></div>

                <div className="flex items-center justify-between mb-6 w-full md:w-xs lg:w-full">
                  <p className="mb-2 font-light">¿Tienes alguna duda?</p>
                  <a
                    href="/nosotros"
                    className="text-theme-keppel hover:underline font-medium"
                  >
                    Contactate con nosotros
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};