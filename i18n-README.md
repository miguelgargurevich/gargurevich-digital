# 🌍 Internationalization (i18n) - Gargurevich Digital

## Overview
This website supports **bilingual functionality** with **English** as the default language and **Spanish** as the secondary language.

## 🛠️ Technology Stack
- **next-intl**: Next.js internationalization library
- **Route-based localization**: URLs include locale prefix (`/en` or `/es`)
- **Server Components**: Full SSR support with translations

## 📁 File Structure

```
gargurevich-digital/
├── messages/
│   ├── en.json          # English translations
│   └── es.json          # Spanish translations
├── src/
│   ├── i18n/
│   │   ├── routing.ts   # Routing configuration (locales, default locale)
│   │   └── request.ts   # Request configuration (loads messages)
│   ├── middleware.ts    # Locale detection and routing
│   └── app/
│       └── [locale]/    # Dynamic locale route
│           ├── layout.tsx
│           ├── page.tsx
│           └── globals.css
```

## 🌐 Supported Languages

| Language | Code | Default | URL Example |
|----------|------|---------|-------------|
| English  | `en` | ✅ Yes  | `/en`       |
| Spanish  | `es` | ❌ No   | `/es`       |

## 🔧 Configuration

### Routing Configuration (`src/i18n/routing.ts`)
```typescript
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',       // English is the default
  localePrefix: 'always'     // Always show locale in URL
});
```

### Middleware (`src/middleware.ts`)
- Automatically detects user's preferred language
- Redirects to appropriate locale
- Handles locale switching

## 📝 Translation Files

### English (`messages/en.json`)
```json
{
  "nav": {
    "services": "Services",
    "portfolio": "Portfolio",
    "tech": "Technologies",
    "process": "Process",
    "contact": "Contact",
    "cta": "Start Project"
  },
  "hero": {
    "badge": "Premium Web Development",
    "title": "We Create",
    "rotatingWords": [
      "Digital Experiences",
      "Modern Web Apps",
      "AI Solutions",
      "Scalable Products"
    ],
    // ... more translations
  }
}
```

### Spanish (`messages/es.json`)
```json
{
  "nav": {
    "services": "Servicios",
    "portfolio": "Portafolio",
    "tech": "Tecnologías",
    "process": "Proceso",
    "contact": "Contacto",
    "cta": "Iniciar Proyecto"
  },
  "hero": {
    "badge": "Desarrollo Web Premium",
    "title": "Creamos",
    "rotatingWords": [
      "Experiencias Digitales",
      "Apps Web Modernas",
      "Soluciones con IA",
      "Productos Escalables"
    ],
    // ... more translations
  }
}
```

## 🎨 Components Using Translations

All components have been updated to use `useTranslations()` hook:

### Example Usage
```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('hero');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      
      {/* For arrays */}
      {t.raw('rotatingWords').map(word => (
        <span key={word}>{word}</span>
      ))}
    </div>
  );
}
```

### Updated Components
- ✅ Header (navigation, CTA)
- ✅ Footer (links, newsletter, copyright)
- ✅ HeroSection (badge, title, subtitle, stats, CTAs)
- ✅ ServicesSection (all services, descriptions)
- ✅ StatsSection (all statistics)
- ✅ PortfolioSection (portfolio items, CTAs)
- ✅ TechStackSection (tech categories, badges)
- ✅ ProcessSection (all process steps)
- ✅ ContactSection (form fields, placeholders, buttons)

## 🔄 Language Switcher

A **LanguageSwitcher** component is available in the Header that allows users to toggle between languages:

```tsx
<LanguageSwitcher />
```

Features:
- Shows current language with flag (🇺🇸 EN / 🇵🇪 ES)
- Dropdown menu for switching
- Preserves current page path when switching
- Smooth transition with Framer Motion animations

## 🚀 URLs and Routing

### Default Language (English)
- Homepage: `http://localhost:3000/en`
- Will redirect from `/` to `/en`

### Spanish
- Homepage: `http://localhost:3000/es`

### Internal Links
All internal links must use the special `Link` component from `@/i18n/routing`:

```tsx
import { Link } from '@/i18n/routing';

<Link href="/about">About</Link>
// Will automatically generate: /en/about or /es/about
```

## 📱 User Experience

1. **First Visit**: User is redirected to `/en` (default language)
2. **Language Switch**: User clicks language switcher in header
3. **URL Changes**: `/en/...` ↔ `/es/...`
4. **All Content Updates**: Entire page re-renders with new language
5. **Persistence**: Selected language is maintained across navigation

## 🔍 SEO Benefits

- **Separate URLs per language**: `/en/...` and `/es/...`
- **Dynamic metadata**: Title, description, and Open Graph tags adapt to language
- **Search engines** can index both versions independently
- **hreflang tags** (can be added) for better SEO

## 🎯 Translation Keys Structure

```
nav.*              # Navigation items
hero.*             # Hero section content
services.*         # Services section
stats.*            # Statistics section
portfolio.*        # Portfolio section
tech.*             # Technologies section
process.*          # Process section
contact.*          # Contact form
footer.*           # Footer content
```

## ✨ Features

- ✅ **Full bilingual support** (English + Spanish)
- ✅ **English as default language**
- ✅ **Route-based localization** with clean URLs
- ✅ **Server-side rendering** with translations
- ✅ **Dynamic language switching** without page reload
- ✅ **TypeScript support** with type-safe translations
- ✅ **Automatic locale detection** from browser preferences
- ✅ **All UI components translated**
- ✅ **SEO-friendly** with separate URLs per language

## 🧪 Testing

Visit these URLs to test:
- English: http://localhost:3000/en
- Spanish: http://localhost:3000/es

Try the language switcher in the header to toggle between languages!

## 📚 Adding More Languages

To add a new language:

1. Create a new translation file: `messages/{locale}.json`
2. Add locale to `src/i18n/routing.ts`:
   ```ts
   locales: ['en', 'es', 'fr'],  // Add 'fr' for French
   ```
3. Update `LanguageSwitcher.tsx` with new language option
4. Copy all keys from `en.json` and translate to new language

## 🎓 Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Use `Link` from `@/i18n/routing`** for internal navigation
3. **Keep translation keys organized** by section
4. **Maintain consistent structure** across all language files
5. **Test both languages** before deploying

---

Made with ❤️ by Gargurevich Digital
