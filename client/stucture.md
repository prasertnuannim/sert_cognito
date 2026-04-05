src/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  └─ [...nextauth]/
│  │  │     └─ route.ts
│  │  └─ cognito/
│  │     ├─ signup/
│  │     │  └─ route.ts
│  │     ├─ confirm-signup/
│  │     │  └─ route.ts
│  │     ├─ forgot-password/
│  │     │  └─ route.ts
│  │     └─ confirm-forgot-password/
│  │        └─ route.ts
│  │
│  ├─ (auth)/
│  │  ├─ login/
│  │  │  └─ page.tsx
│  │  ├─ register/
│  │  │  └─ page.tsx
│  │  ├─ confirm-account/
│  │  │  └─ page.tsx
│  │  ├─ forgot-password/
│  │  │  └─ page.tsx
│  │  └─ reset-password/
│  │     └─ page.tsx
│  │
│  └─ layout.tsx
│
├─ features/
│  └─ auth/
│     ├─ domain/
│     │  ├─ entities/
│     │  │  ├─ login.entity.ts
│     │  │  ├─ register.entity.ts
│     │  │  ├─ confirm-account.entity.ts
│     │  │  └─ forgot-password.entity.ts
│     │  ├─ errors/
│     │  │  └─ auth-error.mapper.ts
│     │  ├─ repositories/
│     │  │  └─ auth.repository.ts
│     │  └─ schemas/
│     │     ├─ login.schema.ts
│     │     ├─ register.schema.ts
│     │     ├─ confirm-account.schema.ts
│     │     └─ forgot-password.schema.ts
│     │
│     ├─ application/
│     │  └─ use-cases/
│     │     ├─ login.use-case.ts
│     │     ├─ register.use-case.ts
│     │     ├─ confirm-account.use-case.ts
│     │     ├─ forgot-password.use-case.ts
│     │     └─ reset-password.use-case.ts
│     │
│     ├─ infrastructure/
│     │  ├─ repositories/
│     │  │  └─ cognito-auth.repository.ts
│     │  └─ services/
│     │     └─ cognito.service.ts
│     │
│     └─ presentation/
│        ├─ actions/
│        │  ├─ register.action.ts
│        │  ├─ confirm-account.action.ts
│        │  ├─ forgot-password.action.ts
│        │  └─ reset-password.action.ts
│        └─ components/
│           ├─ login-form.tsx
│           ├─ register-form.tsx
│           ├─ confirm-account-form.tsx
│           ├─ forgot-password-form.tsx
│           └─ reset-password-form.tsx
│
├─ lib/
│  ├─ auth.ts
│  └─ utils.ts
│
├─ types/
│  └─ next-auth.d.ts
│
└─ components/
   └─ auth-shell.tsx



COGNITO_REGION=
COGNITO_CLIENT_ID=
COGNITO_CLIENT_SECRET=
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000