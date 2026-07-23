# API Design

## Conventions

### Route Handlers
Next.js 16 App Router uses file-based routing for API endpoints:

```
app/api/[resource]/route.ts     → /api/[resource]
```

### Response Format
All API responses follow a consistent structure:

```typescript
// Success
{
  "data": T,
  "meta": { "timestamp": string }
}

// Error
{
  "error": {
    "code": string,
    "message": string,
    "details": unknown[]
  }
}
```

### HTTP Methods
- `GET` — Read (cacheable)
- `POST` — Create
- `PUT` — Full update
- `PATCH` — Partial update
- `DELETE` — Remove

### Status Codes
- `200` — Success
- `201` — Created
- `204` — No Content (successful delete)
- `400` — Bad Request (validation error)
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `429` — Too Many Requests (rate limited)
- `500` — Internal Server Error

### Validation
Every route handler validates input with Zod:

```typescript
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.issues } },
      { status: 400 }
    );
  }

  // ... handle valid data
}
```

## Server Actions
For form submissions and mutations, prefer Server Actions over Route Handlers:

```typescript
"use server";

export async function createItem(formData: FormData) {
  // Validate, authorize, persist
}
```
