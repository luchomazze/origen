# F05 — Recuperación de contraseña e invitación de administrador

**Prioridad:** P1 · **Esfuerzo:** S · **Depende de:** F09 (URL pública para redirects), F01 (ruta `/admin/restablecer`)

## Contexto

`AuthProvider` solo expone `signIn` / `signOut`. Si el único admin olvida la contraseña, hoy la única salida es entrar al dashboard de Supabase. El alta del admin se hizo a mano (ToDo S3).

## Requisitos

**Historia 1 — Como admin quiero recuperar mi contraseña.**

- R1.1 La pantalla de login DEBE tener "¿Olvidaste tu contraseña?".
- R1.2 CUANDO el admin ingresa su email, EL SISTEMA DEBE pedir a Supabase el mail de recuperación y mostrar siempre el mismo mensaje ("Si el email existe, te enviamos un link"), exista o no la cuenta (no filtrar usuarios).
- R1.3 CUANDO el admin abre el link del mail, EL SISTEMA DEBE mostrar un formulario de nueva contraseña (mínimo 8 caracteres, confirmación) y, al guardar, iniciar sesión y entrar al panel.
- R1.4 SI el link expiró o es inválido, EL SISTEMA DEBE explicarlo y ofrecer pedir otro.

**Historia 2 — Política de invitación.**

- R2.1 El alta de nuevos admins DEBE hacerse por invitación desde el dashboard de Supabase (`Invite user`) + insert en `profiles` con `role = 'admin'`, documentado paso a paso.
- R2.2 El registro público (sign up) DEBE estar deshabilitado en Supabase Auth.

## Diseño

- `AuthProvider`: agregar `requestPasswordReset(email)` → `supabase.auth.resetPasswordForEmail(email, { redirectTo: <origin>/admin/restablecer })` y `updatePassword(pw)` → `supabase.auth.updateUser({ password })`.
- Escuchar el evento `PASSWORD_RECOVERY` de `onAuthStateChange` para mostrar el formulario.
- Supabase Auth → URL Configuration: agregar el dominio de producción y los previews de Vercel a "Redirect URLs".
- Plantilla de email de recuperación en español con marca ORIGEN.

## Tareas

- [ ] T1. Métodos nuevos en `AuthProvider`. (R1.2, R1.3)
- [ ] T2. Vista "Olvidé mi contraseña" en `AdminLogin.tsx`. (R1.1, R1.2)
- [ ] T3. Vista `/admin/restablecer`. (R1.3, R1.4)
- [ ] T4. Configurar Redirect URLs y plantilla de email en Supabase. (R1.2)
- [ ] T5. Deshabilitar sign up público y documentar la invitación en README. (R2.1, R2.2)
- [ ] T6. Probar el flujo completo con un email real, incluido el link expirado. (todos)

## Fuera de alcance

- Roles múltiples, 2FA, login con Google.

## Preguntas abiertas

- ¿Se usa el SMTP por defecto de Supabase (límite bajo de envíos) o uno propio (Resend/SendGrid)? Recomendado: SMTP propio antes de producción.

## Definición de terminado

Flujo probado de punta a punta en el preview de Vercel; ToDo S3 "Agregar recuperación de contraseña" marcado.
