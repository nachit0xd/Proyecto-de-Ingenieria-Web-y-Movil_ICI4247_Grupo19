export type RolUsuario = 'ciudadano' | 'gestor';

// Definición de la interfaz de Usuario, que incluye un ID único, RUT, nombre, correo electrónico y rol dentro del sistema (ciudadano o gestor)

export interface Usuario {
  id: string;
  rut: string; // Formato esperado: 12345678-9
  nombre: string;
  email: string;
  rol: RolUsuario;
}
