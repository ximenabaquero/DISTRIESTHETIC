# Guía: Configurar n8n + OpenAI para Blog automatizado

## Resumen
Este flujo automatiza la creación de posts de blog:
1. **Telegram Trigger** → Escucha mensajes en tu bot
2. **OpenAI Chat Model** → Genera un artículo completo
3. **Code** → Transforma la respuesta a JSON
4. **HTTP Request** → Publica el post en tu blog

---

## Paso 1: Crear un Bot de Telegram

1. Abre Telegram y busca **@BotFather**
2. Envía `/newbot`
3. Dale un nombre (ej: DistriEstheticBlogBot)
4. Dale un username (debe terminar en `bot`, ej: distriesthetic_blog_bot)
5. **Copia el token** que te devuelve (lo necesitarás en n8n)

**Ejemplo:**
```
Congratulations on your new bot. You will find it at t.me/distriesthetic_blog_bot.
You can now add a description, about section and profile picture for your bot. 
See /help for a list of commands. By the way, when you've finished with your bot, 
remember that you can always create a new one by calling /newbot again.

Use this token to access the HTTP API:
1234567:ABCDEFGHIjklmnopqrstuvwxyz...
```

---

## Paso 2: Obtener API Key de OpenAI

1. Ve a https://platform.openai.com/api/keys
2. Click **Create new secret key**
3. **Copia la clave** (solo la verás una vez)

---

## Paso 3: Configurar el Workflow en n8n

### Nodo 1: Telegram Trigger

1. En n8n Cloud, crea un **nuevo workflow**
2. Agrega un nodo **Telegram**
3. **Credential**: Crea una nueva credencial de Telegram
   - **Bot Token**: Pega el token de BotFather
   - Click **Test Connection** → Debe decir "Success!"
4. **Event**: Selecciona `message`
5. **Qué esperar**: Cuando alguien envíe un mensaje al bot, se activa

---

### Nodo 2: OpenAI Chat Model

1. Agrega un nuevo nodo **OpenAI → Chat Model**
2. **Credential**: Crea una nueva credencial de OpenAI
   - **API Key**: Pega tu clave de OpenAI
3. **Model**: Selecciona `gpt-4o-mini` (más barato, suficiente)
4. **User message**: Pega esto (usa la sintaxis de n8n):
   ```
   {{ $json.message.text }}
   ```
5. **System message** (COPIA EXACTO):
   ```
   Eres el redactor de contenido de DistriEsthetic S.A.S., una distribuidora colombiana de insumos médico-estéticos. Cuando recibas una idea de tema, genera un artículo de blog completo en español con:
   - Título atractivo en la primera línea (sin "Título:" antes)
   - 3 a 4 párrafos de contenido útil para esteticistas y médicos estéticos
   - Menciona naturalmente los productos o ingredientes del tema
   - Tono profesional pero cercano
   - Máximo 400 palabras
   Solo devuelve el artículo, sin explicaciones adicionales.
   ```

---

### Nodo 3: Code (Procesar respuesta)

1. Agrega un nodo **Code**
2. **Language**: JavaScript
3. **Pega este código exacto**:

```javascript
const texto = $input.first().json.message?.content
  || $input.first().json.choices?.[0]?.message?.content
  || '';

const lineas = texto.trim().split('\n').filter(l => l.trim());
const titulo = lineas[0].replace(/^#+\s*/, '').trim();
const slug = titulo
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim().replace(/\s+/g, '-')
  + '-' + Date.now();

return [{ 
  json: { 
    titulo, 
    contenido: texto, 
    slug,
    estado: 'publicado'
  } 
}];
```

---

### Nodo 4: HTTP Request (Publicar post)

1. Agrega un nodo **HTTP Request**
2. **Method**: `POST`
3. **URL**:
   ```
   https://tu-dominio.vercel.app/api/blog
   ```
   (O si es local: `http://localhost:3000/api/blog`)

4. **Headers** (Click en "Add header row"):
   - **Name**: `Content-Type`
   - **Value**: `application/json`
   
   - **Name**: `x-n8n-secret`
   - **Value**: `distriesthetic_blog_n8n_secret_2026` (el mismo de tu `.env.local`)

5. **Body**:
   - **Body type**: `JSON`
   - **Body**:
   ```json
   {{ $json }}
   ```

6. **Response**:
   - Marca ✅ **Use Response Body** (para ver la respuesta)

---

## Paso 4: Conectar los nodos

1. Telegram Trigger → Conecta a OpenAI (arrastra el puntito rojo)
2. OpenAI → Conecta a Code
3. Code → Conecta a HTTP Request

---

## Paso 5: Probar el Flujo

1. Click **Save** (top derecha)
2. Click **Activate** (turn on el toggle)
3. Abre Telegram y busca tu bot (t.me/distriesthetic_blog_bot)
4. Envía un mensaje como:
   ```
   Redacta un artículo sobre ácido hialurónico para procedimientos médico-estéticos
   ```
5. En ~30 segundos debería publicarse un post en tu blog 🎉

---

## Verificación

### En la consola de n8n:
- Deberías ver que todos los nodos se ejecutaron correctamente
- El HTTP Request debería devolver un `201` (post creado)

### En tu blog:
- Ve a `/admin` → Tab "Blog"
- Deberías ver el nuevo post en la tabla

### En la web:
- Ve a `/blog`
- Deberías ver el artículo en el listado (si está en estado "publicado")

---

## Troubleshooting

### "Error: x-n8n-secret inválido"
- Verifica que el header `x-n8n-secret` sea exactamente: `distriesthetic_blog_n8n_secret_2026`
- Y que esté en `.env.local`:
  ```
  N8N_SECRET=distriesthetic_blog_n8n_secret_2026
  ```

### "Error: Telegram bot no responde"
- Verifica que el token de Telegram sea correcto
- Intenta `/start` en el bot para ver si responde

### "Error: OpenAI rate limit"
- Espera 1 minuto y reintenta
- Si es por suscripción, asegúrate de que tu cuenta tenga crédito

### "Error: HTTP Request 401"
- El token secreto es incorrecto
- Verifica `.env.local`

### "El post se crea pero no aparece en el blog"
- Verifica que esté en estado "publicado" (en AdminPanel → Blog)
- Si está en "borrador", cambia el estado a "publicado"

---

## Próximos pasos opcionales

1. **Generar imagen de portada** con DALL-E (agregar otro nodo OpenAI)
2. **Moderar posts** antes de publicar (guardar como "borrador" en lugar de "publicado")
3. **Programar publicaciones** (usar n8n Schedule en lugar de Telegram Trigger)
4. **Notificar en Slack/Email** cuando se publica un post (agregar nodo de notificación)

---

## Costo estimado

- **n8n Cloud**: Free tier = 100 tasks/mes (gratis)
- **OpenAI**: ~$0.01 por artículo (usando gpt-4o-mini)
- **Telegram**: Gratis

**Total**: Casi nada 🎉

---

¿Preguntas? Revisa el workflow en n8n o contacta al equipo técnico.
