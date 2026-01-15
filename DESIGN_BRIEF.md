# ТЗ для дизайну Landing Page - JobPocket

## Про продукт

**JobPocket** — мобільний додаток для підрядників (сантехніки, електрики, ремонтники тощо), який допомагає керувати бізнесом: створювати кошториси, рахунки, вести клієнтів та відстежувати оплати.

**Цільова аудиторія:** Підрядники, майстри, власники малого бізнесу у сфері послуг (США)

**Платформа:** iOS (App Store)

---

## Брендинг

### Кольорова палітра

| Колір | HEX | Використання |
|-------|-----|--------------|
| Primary | `#7C3AED` | Основний фіолетовий |
| Primary Dark | `#6D28D9` | Акценти, градієнти |
| Primary Light | `#A78BFA` | Світлі акценти |
| Text | `#111827` | Основний текст |
| Text Light | `#6B7280` | Вторинний текст |
| Background | `#FAFAFA` | Фон сторінки |
| White | `#FFFFFF` | Картки, секції |
| Success | `#10B981` | Позитивні показники |

### Логотип

SVG логотип доступний у файлах:
- `favicon.png` (48x48)
- Повний лого в шапці сайту

Концепція: Кишеня (pocket) з документами всередині

### Шрифти

Системні шрифти (Apple style):
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

---

## Структура сторінки

### 1. Navigation (Fixed)

```
[Logo] JobPocket          Features | How It Works | Support | [Download - button]
```

- Фіксована шапка з blur ефектом
- Кнопка Download — primary колір

---

### 2. Hero Section

**Заголовок:** "Run Your Business From Your Pocket"

**Підзаголовок:** "The all-in-one app for contractors. Create professional estimates, send invoices, manage clients, and track payments — all from your phone."

**CTA кнопки:**
- Primary: "Download for iOS" (з іконкою Apple)
- Secondary: "Learn More"

**Візуал:** Mockup iPhone з екраном додатку (Dashboard)

**Дані для mockup:**
- Greeting: "Good morning, Alex!"
- Stats: This Month $12,450 | Outstanding $3,200
- Today's Jobs:
  - Kitchen Remodel - Sarah Johnson - 9:00 AM
  - Bathroom Plumbing - Mike Chen - 2:00 PM

---

### 3. Features Section

**Заголовок:** "Everything You Need to Run Your Business"
**Підзаголовок:** "Stop juggling paperwork. JobPocket handles estimates, invoices, scheduling, and client management in one simple app."

**6 карток (сітка 3x2):**

| Іконка | Назва | Опис |
|--------|-------|------|
| 📋 | Professional Estimates | Create detailed estimates with line items, photos, and your branding. Send as PDF with one tap. |
| 💰 | Easy Invoicing | Convert estimates to invoices instantly. Track payments and send reminders automatically. |
| 👥 | Client Management | Keep all client info, job history, and notes organized in one place. |
| 📅 | Calendar Sync | Sync scheduled jobs with Google Calendar or Apple Calendar automatically. |
| 📊 | Business Reports | Track revenue, completed jobs, and outstanding payments at a glance. |
| 🎨 | Custom Branding | Add your logo and company colors to all documents for a professional look. |

---

### 4. How It Works Section

**Заголовок:** "Simple to Use, Powerful Results"
**Підзаголовок:** "Get started in minutes, not hours"

**4 кроки (горизонтально):**

1. **Create Account** — Sign up with your phone number in seconds
2. **Add Your Clients** — Import contacts or add them manually
3. **Create Jobs** — Add job details, schedule dates, and assign to clients
4. **Get Paid** — Send estimates, invoices, and track payments

---

### 5. For Who Section (Target Audience)

**Заголовок:** "Built for Contractors Like You"
**Підзаголовок:** "Whether you're a one-person operation or a growing team"

**Tags (pills/chips):**
- 🔧 Plumbers
- ⚡ Electricians
- ❄️ HVAC Technicians
- 🏠 General Contractors
- 🎨 Painters
- 🌳 Landscapers
- 🧹 Cleaning Services
- 🔨 Handymen
- 🚿 Roofers
- 🪟 Window Installers
- 🏗️ Remodelers
- 🔩 Appliance Repair

---

### 6. CTA Section

**Фон:** Градієнт primary кольорів

**Заголовок:** "Ready to Simplify Your Business?"
**Підзаголовок:** "Join thousands of contractors who manage their business with JobPocket"

**Кнопка:** "Download Free on App Store" (біла кнопка на фіолетовому фоні)

---

### 7. Footer

**Колонки:**

| Brand | Product | Support | Legal |
|-------|---------|---------|-------|
| JobPocket | Features | Help Center | Privacy Policy |
| Опис продукту | How It Works | Contact Us | Terms of Service |
| | Download | | |

**Bottom:** © 2026 JobPocket. All rights reserved. | Made with ❤️ for contractors

---

## Додаткові сторінки

### Privacy Policy (`/privacy.html`)
- Простий текстовий layout
- Header з фіолетовим фоном
- Білий контент з секціями

### Terms of Service (`/terms.html`)
- Аналогічний layout до Privacy

### Support (`/support.html`)
- FAQ секція
- Контактна інформація
- Email: support@jobpocket.app

---

## Скріншоти додатку (для App Store та сайту)

Потрібні екрани для демонстрації:

1. **Dashboard** — головний екран зі статистикою
2. **Jobs List** — список робіт
3. **Job Details** — деталі роботи
4. **Create Estimate** — створення кошторису
5. **Invoice** — рахунок
6. **Clients** — список клієнтів
7. **Calendar** — календар з роботами

**Розміри для App Store:**
- iPhone 6.7": 1290 × 2796 px
- iPhone 6.5": 1284 × 2778 px
- iPhone 5.5": 1242 × 2208 px

---

## Технічні вимоги

- **Responsive:** Desktop, Tablet, Mobile
- **Формат:** HTML/CSS або Figma
- **Анімації:** Subtle hover ефекти, smooth scrolling
- **Accessibility:** Контрастні кольори, alt тексти

---

## Референси

- https://www.invoice2go.com/
- https://www.jobber.com/
- https://www.housecallpro.com/
- Apple App Store product pages

---

## Файли

Поточна версія сайту: https://jobpocket.app

Лого та іконки в репозиторії:
- `/landing/favicon.png`
- `/mobile/assets/ios-icons/`

---

## Контакти

Email: support@jobpocket.app
