import React, { useState, useEffect, useRef } from 'react';
import Pagination from '@/dashboard/shared/Pagination';
import { createPagination } from '@/dashboard/shared/paginationManager';
import { 
  fetchAdministratorsList, 
  fetchCreateAdministrator, 
  fetchUpdateAdministrator, 
  fetchDeleteAdministrator,
} from '@/infrastructure/api/administrator';
import type { AdministratorResponse } from '@/infrastructure/dto/administrator/AdministratorResponse';
import type { AdministratorRequest } from '@/infrastructure/dto/administrator/AdministratorRequest';
const ManageAdministratorSection: React.FC = () => {
  const [allAdministrators, setAllAdministrators] = useState<AdministratorResponse[]>([]);
  const [filteredAdministrators, setFilteredAdministrators] = useState<AdministratorResponse[]>([]);
  const [visibleAdministrators, setVisibleAdministrators] = useState<AdministratorResponse[]>([]);
  const [currentAdministratorId, setCurrentAdministratorId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nuevo Administrador');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<AdministratorRequest>({
    id: 0,
    administratorName: '',
    administratorPaternalSurname: '',
    administratorMaternalSurname: '',
    password: '',
    gender: ''
  });

  // Referencia para el paginationManager
  const paginationRef = useRef(createPagination('administrators', 5));

  // Cargar administradores al montar el componente
  useEffect(() => {
    loadAdministrators();
    paginationRef.current.setupPagination(loadAdministrators);
  }, []);

  // Actualizar tabla cuando cambien los filtros o la página
  useEffect(() => {
    updateVisibleAdministrators();
  }, [filteredAdministrators, paginationRef.current]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allAdministrators.filter(admin => 
        admin.administratorInstitutionalEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdministrators(filtered);
    } else {
      setFilteredAdministrators(allAdministrators);
    }
  }, [searchTerm, allAdministrators]);

  const loadAdministrators = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdministratorsList();
      
      setAllAdministrators(data);
      setFilteredAdministrators(data);
      
      paginationRef.current.updateIndicators(data.length);
      paginationRef.current.updatePaginationControls(loadAdministrators, data.length);
    } catch (error) {
      console.error('Error al cargar los administradores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisibleAdministrators = () => {
    const visible = paginationRef.current.calculateVisibleElements(filteredAdministrators);
    setVisibleAdministrators(visible);
  };

  const openAddModal = () => {
    setCurrentAdministratorId(null);
    setModalTitle('Nuevo Administrador');
    setIsModalOpen(true);
  };

  const openEditModal = (id: number) => {
    const admin = allAdministrators.find(a => a.id === id);
    if (!admin) return;
    
    const genderValue = admin.gender === 'FEMENINO' ? 'F' : 'M';
    
    setFormData({
      id: admin.id,
      administratorName: admin.administratorName,
      administratorPaternalSurname: admin.administratorPaternalSurname,
      administratorMaternalSurname: admin.administratorMaternalSurname,
      password: '',
      gender: genderValue as 'M' | 'F'
    });
    
    setModalTitle('Editar Administrador');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: 0,
      administratorName: '',
      administratorPaternalSurname: '',
      administratorMaternalSurname: '',
      password: '',
      gender: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value as 'M' | 'F'
    }));
  };
  
  const confirmDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este administrador?')) return;
    
    try {
      await fetchDeleteAdministrator(String(id));
      await loadAdministrators();
    } catch (error) {
      console.error('Error al eliminar el administrador:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const requestData: AdministratorRequest = {
      id: formData.id || 0,
      administratorName: formData.administratorName,
      administratorPaternalSurname: formData.administratorPaternalSurname,
      administratorMaternalSurname: formData.administratorMaternalSurname,
      password: formData.password,
      gender: formData.gender as 'M' | 'F'
    };
    
    try {
      if (formData.id) {
        await fetchUpdateAdministrator(requestData);
      } else {
        await fetchCreateAdministrator(requestData);
      }
      
      await loadAdministrators();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${formData.id ? 'actualizar' : 'crear'} el administrador`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-theme-rich-black">Gestión de Administradores</h2>
        
        <div className="flex flex-col md:flex-row items-stretch gap-2 w-full sm:w-auto">
          <button 
            id="addAdministratorBtn"
            onClick={openAddModal}
            className="bg-theme-keppel text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-4 rounded-2xl hover:bg-theme-keppel/90 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Nuevo
          </button>
          
          <div className="relative flex-grow">
            <input
              type="text"
              id="administratorSearchInput"
              placeholder="Ingresar correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-4 pl-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200 w-full xs:w-64"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-rich-black/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-theme-rich-black/20">
          <thead className="bg-theme-keppel/10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">Administrador</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">Género</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">Correo Institucional</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody id="administratorsTableBody" className="bg-white divide-y divide-theme-rich-black/20">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : visibleAdministrators.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No hay administradores para mostrar
                </td>
              </tr>
            ) : (
              visibleAdministrators.map((admin) => (
                <tr key={admin.id} data-id={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-theme-keppel/20 flex items-center justify-center">
                        <span className="text-theme-keppel">
                          {admin.gender === 'FEMENINO' ? (
                            <img src="/icons/female-user.svg" alt="Icono de Usuario Mujer" className="h-5 w-5" />
                          ) : (
                            <img src="/icons/male-user.svg" alt="Icono de Usuario Hombre" className="h-5 w-5" />
                          )}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-theme-rich-black">
                          {admin.administratorName} {admin.administratorPaternalSurname} {admin.administratorMaternalSurname}
                        </div>
                        <div className="text-sm text-gray-500">{admin.administratorInstitutionalEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
                    {admin.gender === 'FEMENINO' ? 'Femenino' : 'Masculino'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
                    {admin.administratorInstitutionalEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => openEditModal(Number(admin.id))}
                      className="text-theme-keppel hover:text-theme-keppel-dark mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => confirmDelete(Number(admin.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <Pagination idPrefix="administrators" />
      </div>

      {/* Modal para agregar/editar administrador */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" 
          role="dialog" 
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-theme-rich-black">{modalTitle}</h3>
              <button 
                onClick={closeModal}
                className="text-theme-rich-black hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="hidden" value={formData.id || ''} />
              
              <div>
                <label htmlFor="administratorNameInput" className="block text-sm font-medium text-theme-rich-black/70 mb-1">Nombres</label>
                <input 
                  type="text" 
                  id="administratorNameInput"
                  name='administratorName'
                  value={formData.administratorName}
                  onChange={handleInputChange}
                  autoComplete="given-name" 
                  required 
                  className="w-full border rounded-md px-3 py-2 border-theme-rich-black/40"
                />
              </div>
              
              <div>
                <label htmlFor="administratorPaternalSurnameInput" className="block text-sm font-medium text-theme-rich-black/70 mb-1">Apellido Paterno</label>
                <input 
                  type="text" 
                  id="administratorPaternalSurnameInput"
                  name='administratorPaternalSurname'
                  value={formData.administratorPaternalSurname}
                  onChange={handleInputChange}
                  autoComplete="family-name" 
                  required 
                  className="w-full border rounded-md px-3 py-2 border-theme-rich-black/40"
                />
              </div>
              
              <div>
                <label htmlFor="administratorMaternalSurnameInput" className="block text-sm font-medium text-theme-rich-black/70 mb-1">Apellido Materno</label>
                <input 
                  type="text" 
                  id="administratorMaternalSurnameInput"
                  name='administratorMaternalSurname'
                  value={formData.administratorMaternalSurname}
                  onChange={handleInputChange}
                  autoComplete="additional-name" 
                  required 
                  className="w-full border rounded-md px-3 py-2 border-theme-rich-black/40"
                />
              </div>
              
              <div>
                <label htmlFor="passwordInput" className="block text-sm font-medium text-theme-rich-black/70 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  id="passwordInput"
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 border-theme-rich-black/40" 
                  placeholder="Dejar vacío para no cambiar" 
                  autoComplete="new-password"
                />
              </div>
              
              <div>
                <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">Género</span>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="genderM" 
                      name="gender" 
                      value="M"
                      checked={formData.gender === 'M'}
                      onChange={handleGenderChange}
                      className="text-theme-keppel" 
                    />
                    <label htmlFor="genderM" className="ml-2">Masculino</label>
                  </div>

                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="genderF" 
                      name="gender" 
                      value="F"
                      checked={formData.gender === 'F'}
                      onChange={handleGenderChange}
                      className="text-theme-keppel" 
                    />
                    <label htmlFor="genderF" className="ml-2">Femenino</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-theme-keppel text-white px-4 py-2 rounded-md hover:bg-theme-keppel-dark"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdministratorSection;