# TÍTULO: Ciudad más accesible.

### DESCRIPCIÓN
Implementar una API que permita publicar lugares de la ciudad con problemas de accesibilidad para denunciarlos.

### USUARIOS ANÓNIMOS
Pueden escoger un barrio de la ciudad y ver la lista de lugares con problemas de accesibilidad en ese barrio, tanto los problemas activos como los que fueron resueltos.
El administrador de la web debería poder acceder mediante un formulario de login y acceder a la zona de administración.

### ADMINISTRADOR
- Crear un nuevo lugar con problema de accesibilidad
  - Título
  - Descripción
  - Foto
  - Ciudad
  - Barrio
- Marcar un problema de accesibilidad como resuelto

## DETALLES.
Al iniciar/reiniciar la base de datos con el archivo initDB.js, se crea un usuario **administrador (rol de admin)** de forma automática. El administrador podrá realizar las tareas de:

- Crear un nuevo lugar con problema de accesibilidad.
- Marcar un problema de accesibilidad como resuelto.

El resto de usuarios registrados **(rol normal)** tendrán un la posibilidad de:

- Consultar todos los problemas de accesibilidad.
- Consultar todos los problemas de accesibilidad de una ciudad y barrio. Podrán también, en este caso, filtrar las respuestas según el estado de dichas incidencias (resuelta/pendiente).

## INSTRUCCIONES DE USO.
Se adjunta archivo de POSTMAN con las consultas que se pueden realizar. Están divididos en 2 tipos:

- ### Relativas a usuarios (users):

  - Register
  - Login

- ### Relativas a consultas de incidencias de accesibilidad (issues):
  - New Issue: registrar nuevo problema de accesibilidad.
  - Get Issues: consultar probemas de accesibilidad de una ciudad/barrio. En el caso de no introducir el nombre del barrio, existe la posibilidad de consultar todas las incidencias de una misma ciudad.
  - Get Single Issue: consultar problema de accesibilidad por id.
  - Update Single Isue: cambiar el estado (status) del problema de accesibilidad (resuelto/pendiente).
