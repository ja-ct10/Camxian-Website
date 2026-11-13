# Camxian Technologies Website

Independent recreation of [camxian.com](https://camxian.com/) using Next.js App Router, TypeScript, and Tailwind CSS. Repository: [ja-ct10/Camxian-Website](https://github.com/ja-ct10/Camxian-Website).

## Run locally

Tested with Node.js 22.19.0 and npm 10.9.3.

```powershell
npm ci
# On a fresh clone, create your local configuration:
Copy-Item .env.example .env.local
# Fill in the two values described below before starting.
npm run dev
```

Open the Local URL printed by Next.js, normally `http://127.0.0.1:3000`. Use `npm run dev -- --port 3100` if port 3000 is occupied. Keep an existing `.env.local` when reinstalling dependencies.

```powershell
npm run typecheck
npm test
npm run build
npm start
```

Build and development scripts explicitly use webpack because the Windows environment used for this project encountered a Turbopack CSS-worker failure. `next start` serves the production build.

## Pages and original design

| Route | Content |
| --- | --- |
| `/` | Hero, About Us, expertise, customers, partners, business CTA |
| `/about/` | Company introduction/history, milestone carousel, customers/partners, vision, mission, values, team |
| `/product-services/` | All original product and service sections |
| `/contact/` | Original contact layout, custom LeadCRM-connected form, contact details, map |

Reusable React components provide the header, accessible mobile menu, footer, buttons, customer/partner sections, and milestone carousel. Original layout classes and measured styles are intentionally retained in `src/components/sections` and `src/styles/original` for visual accuracy. These are static React sections; the app runs without WordPress, Elementor JavaScript, jQuery, or Swiper JavaScript.

Original images and responsive variants are in `public/images`; Manrope and the icon fonts are local. Proxima Nova uses the original Adobe stylesheet. The milestone carousel reproduces the original five-second autoplay, pause on hover/interaction, pagination, and responsive slide counts. It also supports keyboard arrows and respects reduced motion.

The Contact form uses the selected sample fields—First Name, Last Name, Company, Contact Number, Email Address, Product Interest, and Full Address—within the original Camxian contact-panel design. The original tracker, privacy, terms, and social destinations remain external links to their existing pages.

## LeadCRM configuration

Only the website's server needs these variables:

| Variable | Meaning |
| --- | --- |
| `LEADCRM_API_BASE_URL` | Actual backend **origin**, without `/api/v1`, credentials, query, or additional path |
| `LEADCRM_PUBLIC_FORM_ID` | Actual published form UUID, taken from its Share URL |

The existing configuration verified on **November 13, 2026** was:

```dotenv
LEADCRM_API_BASE_URL=https://api.lead-crm.tech
LEADCRM_PUBLIC_FORM_ID=11c34df6-51f7-4141-9df6-e5a36db8eef0
```

The form was named **Contact Us**, published version **3**, with seven fields and 27 approved products. These are public integration identifiers, not API credentials. They remain environment configuration; application source contains no deployment-specific form ID. Verify the intended tenant/environment before using these values in another deployment.

`.env.example` contains empty configuration variables. `.env.local` and all other real environment files are ignored by Git. No private API key, database connection, authentication token, or LeadCRM dependency is required.

### Public API communication

| Website route | Fixed upstream route |
| --- | --- |
| `GET /api/contact-form/` | `GET /api/v1/public/forms/:publicId` |
| `POST /api/contact-form/submissions/` | `POST /api/v1/public/forms/:publicId/submissions` |

Both handlers run in the existing Next.js Node.js process. They accept no caller-supplied upstream URL or form ID. Requests contain no forwarded cookies, authorization, or client-IP headers. The proxy uses a 15-second timeout, a 64 KB submission limit, no caching or redirects, and preserves upstream validation errors and rate-limit headers. A reverse proxy should preserve the incoming `Host` header.

The custom form resolves published field IDs from `mapToField`, reads required flags and approved product UUIDs, and validates answers before posting. The category filter is UI-only. It never substitutes invented products or answers. API errors beside fields use the actual published IDs.

Every attempt includes a valid UUID `requestId`, published `version`, normalized `values`, supported UTM `tracking` when enabled, and an empty `website` honeypot unless a bot fills it. Optional attribution is omitted. Only a successful response with `data.accepted === true` produces the success message.

An unchanged retry reuses the frozen payload and UUID. Editing an answer or changing the published definition creates a new submission identity. Keep the same page open when retrying an uncertain outcome; answers and receipts live only in page memory. No visitor data is stored in this website's database, browser storage, or application logs.

LeadCRM handles matching, assignment, tenant isolation, product processing, and submission history. An accepted inquiry may reuse an existing Lead or Contact. The website does not implement or alter those decisions.

LeadCRM's current public endpoint limits submissions to 20 per IP per 15 minutes. Server-proxied visitors can share the website server's egress-IP allowance. The website preserves those limits and shows failures; it does not spoof visitor IPs or automatically resend requests.

### Missing or incompatible form

Missing configuration, unpublished/unavailable forms, duplicate/missing mappings, unsupported required fields, and unavailable product options disable submission. The public page displays a contact-service availability message and retains the company's phone/email alternatives.

An authorized LeadCRM operator can configure the form through **Settings → Connect → Forms**:

1. Open the existing Contact Us form, or create one in the intended workspace/environment.
2. Use seven fields mapped once each to `firstName`, `lastName`, `companyName`, `phone`, `email`, `productInterest`, and `address`. Use single-line names/company, email, phone, an approved Product Interest dropdown, and single/multi-line address.
3. Require First Name, Last Name, Email, and Product Interest as appropriate. Ensure approved active products are available. Remove any additional required input that the website cannot present; never supply placeholder answers.
4. Save and publish through the existing interface. Copy the actual UUID from Share, set this website's environment variables, and restart it.
5. Recheck the public definition, submit a clearly labeled inquiry, and verify its history and associated CRM record.

These are setup instructions only. This project does not modify or publish LeadCRM forms automatically.

## Deployment

Deploy this repository independently to a host supporting Next.js Node.js route handlers.

- Install: `npm ci --include=dev`
- Build: `npm run build`
- Start: `npm start` (default port 3000; `npm start -- --port 3100` selects another port)
- Configure both LeadCRM environment variables on that host and expose the website through HTTPS.
- Keep the original Adobe font stylesheet reachable. Images, masks, and icon assets are served from this project.
- After deployment, verify the four pages, mobile menu, published definition, an accepted inquiry, and CRM history again from the deployed origin.

A static HTML-only export cannot serve the proxy routes. No production hosting, domain, or LeadCRM configuration was changed during implementation.

## Verification and project independence

See [the verification report](docs/VERIFICATION.md), [matching-viewport measurements](docs/verification/visual-metrics.json), and screenshots in `docs/verification`.

All website code, dependencies, configuration, commits, and assets belong exclusively to this repository. The only Git remote is `https://github.com/ja-ct10/Camxian-Website.git`, on `main`. LeadCRM's `main` was inspected read-only. No LeadCRM files, branches, commits, configuration, migrations, or database scripts were changed. The explicitly labeled test inquiry was processed through its existing public API and retained as verification evidence.

Original asset/style provenance is documented in [NOTICE.md](NOTICE.md).
