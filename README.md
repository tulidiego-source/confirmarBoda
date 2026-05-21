# confirmarBoda

Sitio web estático para una boda, inspirado en [carmenjavi.com](https://www.carmenjavi.com/).
Incluye pantalla con código de invitación, cuenta atrás, detalles del evento y formulario de confirmación de asistencia (RSVP).

## Estructura

- [index.html](index.html) — marcado de la página
- [styles.css](styles.css) — estilos
- [script.js](script.js) — lógica (código de invitación, cuenta atrás, envío del RSVP)

## Cómo personalizarlo

Abre [script.js](script.js) y edita el objeto `CONFIG` al principio del archivo:

```js
const CONFIG = {
  weddingDate: '2026-09-12T17:00:00',
  validCodes:  ['boda2026', 'invitado'],
  rsvpEndpoint: '' // p. ej. https://formspree.io/f/XXXXXXXX
};
```

Después edita los textos en [index.html](index.html):
- Nombres de los novios (`Novia & Novio`)
- Fecha mostrada en el hero
- Direcciones de la ceremonia y banquete
- Hoteles recomendados
- IBAN de la lista de regalo

### Imagen del hero
Por defecto se usa una imagen de Unsplash. Puedes sustituirla por una propia editando la regla `.hero` en [styles.css](styles.css#L101).

### Formulario RSVP
El formulario no tiene backend. Las opciones más sencillas para recibir las respuestas son servicios gratuitos como **Formspree**, **Getform** o **Basin**:

1. Crea una cuenta y obtén la URL del endpoint.
2. Pégala en `CONFIG.rsvpEndpoint` dentro de [script.js](script.js).

Si lo dejas vacío, las respuestas solo se mostrarán en la consola del navegador.

## Cómo probarlo en local

Solo abre [index.html](index.html) en el navegador, o sirve la carpeta con cualquier servidor estático, por ejemplo:

```powershell
# Con Python 3
python -m http.server 8080
```

Y abre http://localhost:8080

Códigos de invitación de prueba: `boda2026` o `invitado`.

## Despliegue

Cualquier hosting estático sirve:
- **Netlify**: arrastra la carpeta a https://app.netlify.com/drop
- **GitHub Pages**: sube los archivos a un repo y activa Pages
- **Vercel**, **Cloudflare Pages**, etc.

## Aviso de seguridad

El código de invitación está validado **en el navegador**, por lo que cualquiera con conocimientos técnicos puede ver los códigos válidos en `script.js`. Es una barrera estética, no una protección real. Si necesitas seguridad de verdad, hace falta un backend (por ejemplo, validar el código mediante una función serverless).
