# n8n Blog Automation Workflow - Technical Specification

## OBJECTIVE
Automate blog post creation: Telegram message → OpenAI generation → HTTP POST to backend → Database storage

## PREREQUISITES
- n8n Cloud account (free tier sufficient)
- Telegram bot token (from @BotFather)
- OpenAI API key with gpt-4o-mini access
- Backend API endpoint: POST /api/blog

## WORKFLOW CONFIGURATION

### NODE 1: TELEGRAM TRIGGER
**Type**: Telegram (Trigger)
**Purpose**: Listen for incoming messages and extract message text

**Configuration**:
```
Credential Type: Telegram API
Credential Name: "telegram-distriesthetic-bot"
Bot Token: [PASTE_BOTFATHER_TOKEN_HERE]
Trigger Event: message
On Message Type: text
```

**Output Variables**:
- `$json.message.text` = User's message content
- `$json.message.chat.id` = Chat ID (for optional replies)

**Test**: Send message to bot. Should show "1 node executed successfully"

---

### NODE 2: OPENAI CHAT MODEL
**Type**: OpenAI → Chat Model
**Purpose**: Generate blog article from user message

**Configuration**:
```
Credential Type: OpenAI API
Credential Name: "openai-api"
API Key: [PASTE_OPENAI_API_KEY_HERE]
Model: gpt-4o-mini
Temperature: 0.7
Max Tokens: 1500
```

**Input Messages**:
```
User Message Template:
{{ $json.message.text }}

System Message (EXACT):
Eres el redactor de contenido de DistriEsthetic S.A.S., una distribuidora colombiana de insumos médico-estéticos. Cuando recibas una idea de tema, genera un artículo de blog completo en español con:
- Título atractivo en la primera línea (sin "Título:" antes)
- 3 a 4 párrafos de contenido útil para esteticistas y médicos estéticos
- Menciona naturalmente los productos o ingredientes del tema
- Tono profesional pero cercano
- Máximo 400 palabras
Solo devuelve el artículo, sin explicaciones adicionales.
```

**Output Path**: `$.message.content`

**Test**: Check that it returns a complete article in Spanish starting with a title

---

### NODE 3: CODE TRANSFORMATION
**Type**: Code
**Language**: JavaScript
**Purpose**: Parse OpenAI output and structure data for database insertion

**Input Variables**:
- `$input.first().json.message?.content` = Raw article text from OpenAI

**Processing Logic**:
```javascript
// Extract raw content from OpenAI response
const texto = $input.first().json.message?.content
  || $input.first().json.choices?.[0]?.message?.content
  || '';

// Split into lines and filter empty ones
const lineas = texto.trim().split('\n').filter(l => l.trim());

// First line = title (remove markdown # symbols if present)
const titulo = lineas[0].replace(/^#+\s*/, '').trim();

// Generate URL-safe slug
const slug = titulo
  .toLowerCase()                           // Convert to lowercase
  .normalize('NFD')                        // Normalize unicode
  .replace(/[\u0300-\u036f]/g, '')        // Remove accents
  .replace(/[^a-z0-9\s-]/g, '')           // Remove special chars
  .trim()
  .replace(/\s+/g, '-')                    // Spaces to hyphens
  + '-' + Date.now();                      // Add timestamp for uniqueness

// Return structured object
return [{ 
  json: { 
    titulo: titulo,
    contenido: texto,
    slug: slug,
    estado: 'publicado'
  } 
}];
```

**Expected Output**:
```json
{
  "titulo": "Ácido Hialurónico: Hidratación Profunda",
  "contenido": "Ácido Hialurónico: Hidratación Profunda\n\nEl ácido hialurónico es...",
  "slug": "acido-hialuronico-hidratacion-profunda-1713629234567",
  "estado": "publicado"
}
```

**Test**: Verify slug contains title, hyphens, no accents, and 13-digit timestamp

---

### NODE 4: HTTP REQUEST
**Type**: HTTP Request (Node)
**Method**: POST
**Purpose**: Send structured data to backend API

**Configuration**:
```
URL: https://DOMAIN.vercel.app/api/blog
Method: POST
Authentication: None (header-based)
```

**Headers**:
```
Header 1:
  Name: Content-Type
  Value: application/json

Header 2:
  Name: x-n8n-secret
  Value: distriesthetic_blog_n8n_secret_2026
```

**Body**:
```
Body Type: JSON
Body Content: {{ $json }}
```

**Advanced Settings**:
```
Full Response: YES (checked)
Response Is Array: NO
Ignore SSL Issues: NO
Retry On Fail: YES
Max Retries: 2
Retry Delay (ms): 1000
```

**Expected Response**:
```
Status: 201
Headers: 
  Content-Type: application/json
Body:
{
  "id": 123,
  "titulo": "...",
  "slug": "...",
  "contenido": "...",
  "estado": "publicado",
  "createdAt": "2026-04-20T...",
  "updatedAt": "2026-04-20T..."
}
```

**Test**: Should return HTTP 201 with post object

---

## WORKFLOW CONNECTION DIAGRAM

```
[TELEGRAM TRIGGER]
        ↓
  message.text
        ↓
[OPENAI CHAT MODEL]
        ↓
  message.content
        ↓
[CODE TRANSFORMATION]
        ↓
  {titulo, contenido, slug, estado}
        ↓
[HTTP REQUEST POST /api/blog]
        ↓
      HTTP 201
        ↓
   [SUPABASE STORED]
```

---

## DATA FLOW EXAMPLE

**INPUT** (Telegram):
```
"Redacta un artículo sobre mesoterapia capilar"
```

**AFTER NODE 2** (OpenAI):
```
"Mesoterapia Capilar: Revitalización desde la Raíz

La mesoterapia capilar es un tratamiento revolucionario...

[Complete 400-word article]"
```

**AFTER NODE 3** (Code):
```json
{
  "titulo": "Mesoterapia Capilar: Revitalización desde la Raíz",
  "contenido": "Mesoterapia Capilar: Revitalización desde la Raíz\n\nLa mesoterapia capilar es un tratamiento revolucionario...",
  "slug": "mesoterapia-capilar-revitalizacion-desde-la-raiz-1713629234567",
  "estado": "publicado"
}
```

**AFTER NODE 4** (HTTP POST):
```
POST /api/blog
x-n8n-secret: distriesthetic_blog_n8n_secret_2026
Content-Type: application/json

Body sent: (above JSON)

Response: HTTP 201
{
  "id": 42,
  "titulo": "Mesoterapia Capilar: Revitalización desde la Raíz",
  "slug": "mesoterapia-capilar-revitalizacion-desde-la-raiz-1713629234567",
  "contenido": "Mesoterapia Capilar: Revitalización desde la Raíz\n\nLa mesoterapia capilar es un tratamiento revolucionario...",
  "estado": "publicado",
  "createdAt": "2026-04-20T15:47:14.567Z",
  "updatedAt": "2026-04-20T15:47:14.567Z"
}
```

**POST VISIBLE IN**:
- Database: table `blog`, row with id=42
- Frontend: GET /api/blog returns this post
- Public: https://domain.com/blog/mesoterapia-capilar-revitalizacion-desde-la-raiz-1713629234567
- Admin: /admin → Blog tab → table shows new row

---

## VALIDATION RULES

### Message Text
- **Required**: YES
- **Type**: String
- **Min Length**: 5 characters
- **Max Length**: 500 characters

### Title (Generated)
- **Format**: Text, first line of article
- **Validation**: Not empty, not all numbers
- **Example**: "Ácido Hialurónico: Hidratación Profunda"

### Slug (Generated)
- **Format**: lowercase-with-hyphens-and-timestamp
- **Pattern**: `^[a-z0-9]+-[a-z0-9]+-\d{13}$`
- **Uniqueness**: REQUIRED (enforced by Supabase UNIQUE constraint)
- **Example**: "acido-hialuronico-hidratacion-1713629234567"

### Content
- **Required**: YES
- **Type**: String
- **Min Length**: 50 characters
- **Max Length**: 2000 characters
- **Expected**: Article in Spanish with 3-4 paragraphs

### Estado
- **Fixed Value**: "publicado"
- **Allowed Values**: ['borrador', 'publicado', 'archivado']
- **Description**: "publicado" means visible in /blog immediately

---

## ERROR HANDLING

### Common Errors

**Error**: "x-n8n-secret inválido"
- **Cause**: Header value doesn't match backend N8N_SECRET
- **Solution**: Verify header value = "distriesthetic_blog_n8n_secret_2026"
- **Location**: Backend .env.local variable N8N_SECRET

**Error**: "Post no encontrado" (404)
- **Cause**: Slug already exists (UNIQUE constraint)
- **Solution**: Timestamp should make each slug unique; if error persists, OpenAI might have generated same title twice
- **Solution**: Retry; timestamp will be different

**Error**: "Telegram bot not responding"
- **Cause**: Bot token invalid or Telegram API down
- **Solution**: Get new token from @BotFather
- **Solution**: Test with curl: `curl -X GET "https://api.telegram.org/bot[TOKEN]/getMe"`

**Error**: "OpenAI rate limit exceeded"
- **Cause**: Too many requests or account credit exhausted
- **Solution**: Wait 60 seconds
- **Solution**: Verify OpenAI account has credits/valid payment method
- **Solution**: Check current usage at platform.openai.com/account/usage

**Error**: "HTTP 500 from /api/blog"
- **Cause**: Backend error (database, validation, etc.)
- **Solution**: Check backend logs at Vercel Dashboard
- **Solution**: Verify database is accessible
- **Solution**: Test backend manually: `curl -X POST https://domain.vercel.app/api/blog -H "x-n8n-secret: ..." -H "Content-Type: application/json" -d '{...}'`

---

## TESTING CHECKLIST

- [ ] Telegram bot responds to /start command
- [ ] n8n Telegram credential test passes
- [ ] n8n OpenAI credential test passes (test connection button)
- [ ] Workflow executes end-to-end without errors
- [ ] Node 2 output contains article in Spanish
- [ ] Node 3 output contains valid slug (lowercase, hyphens, timestamp)
- [ ] Node 4 returns HTTP 201
- [ ] Post appears in /admin → Blog → table
- [ ] Post appears in GET /api/blog response
- [ ] Post appears in /blog public page
- [ ] Post visible at /blog/[slug] with full content

---

## PERFORMANCE METRICS

- **OpenAI generation**: 8-15 seconds
- **Code transformation**: <100ms
- **HTTP request**: 1-3 seconds
- **Total workflow execution**: 12-20 seconds
- **Database write**: <50ms

---

## SECURITY NOTES

- **x-n8n-secret**: Sent in HTTP header (not in URL)
- **OpenAI API Key**: Stored securely in n8n credential manager
- **Telegram Bot Token**: Stored securely in n8n credential manager
- **HTTPS Only**: All requests to backend must be HTTPS
- **Slug Uniqueness**: Enforced at database level (UNIQUE constraint)

---

## MAINTENANCE

### Weekly Checks
- Monitor OpenAI usage and costs
- Check error logs in n8n dashboard
- Verify posts are publishing correctly

### Monthly Tasks
- Review blog posts for quality
- Archive outdated posts (change estado to 'archivado')
- Check n8n free tier usage (100 tasks/month)

### If Issues Occur
1. Check n8n execution logs (click workflow → executions)
2. Check backend logs (Vercel Dashboard → Logs)
3. Check database status (Supabase → Status)
4. Test each node individually in n8n

---

## OPTIONAL ENHANCEMENTS

### 1. Add Telegram Reply Notification
After Node 4, add Telegram Send Message node:
```
Message: "✅ Post publicado: {{ $json.slug }}"
Chat ID: {{ $json.message.chat.id }}
```

### 2. Add Error Handling
Add "Try/Catch" blocks for each node to handle failures gracefully

### 3. Add Image Generation
Before Node 4, add OpenAI DALL-E node:
```
Prompt: "Generate professional image for: {{ $json.titulo }}"
```
Then include image_url in HTTP POST body

### 4. Add Slack Notification
After Node 4, add Slack Send Message node to notify team of new posts

### 5. Schedule Instead of Trigger
Replace Telegram Trigger with Schedule node to publish daily at fixed time

---

## FILE REFERENCES

- Backend endpoint: `/src/app/api/blog/route.ts`
- Frontend public page: `/src/app/blog/page.tsx`
- Frontend detail page: `/src/app/blog/[slug]/page.tsx`
- Admin panel: `/src/app/admin/components/BlogView.tsx`
- Blog store (database functions): `/src/lib/blogStore.ts`
- Database schema: `supabase-setup.sql` (blog table definition)
- Environment variables: `.env.local` (N8N_SECRET value)

---

## CONCLUSION

This workflow creates a fully automated blog post pipeline requiring only a Telegram message as input. No manual intervention needed. System is designed for 24/7 operation on n8n Cloud free tier.
