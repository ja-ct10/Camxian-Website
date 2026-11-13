# Vercel deployment — November 13, 2026

Production URL: **[https://camxian-recreate.vercel.app/](https://camxian-recreate.vercel.app/)**

| Setting | Verified value |
| --- | --- |
| Vercel team | `ja-ct10s-projects` |
| Project | `camxian-recreate` |
| Repository | `ja-ct10/Camxian-Website` |
| Production branch | `main` |
| Framework / root | Next.js / `./` |
| Production domain | `camxian-recreate.vercel.app` — Valid Configuration |
| Environment | `LEADCRM_API_BASE_URL` and `LEADCRM_PUBLIC_FORM_ID` configured server-side for Production and Preview |

The requested hostname was assigned directly by naming the new project `camxian-recreate`. The Vercel Domains screen confirms it is attached to **Production** with **Valid Configuration**. Existing Vercel projects and domains were left unchanged.

The production build completed with all four pages and both server-side form routes. The deployed site was checked over HTTPS:

| Request | Result |
| --- | --- |
| `GET /` | HTTP 200 |
| `GET /about/` | HTTP 200 |
| `GET /product-services/` | HTTP 200 |
| `GET /contact/` | HTTP 200 |
| `GET /api/contact-form/` | HTTP 200; published version 3; 27 approved products |
| `POST /api/contact-form/submissions/` | HTTP 201; `{"success":true,"data":{"accepted":true}}` |

The POST replayed the previously accepted, clearly labeled QA inquiry using its original UUID and exact payload. It supplied `Origin: https://camxian-recreate.vercel.app` to exercise the deployed proxy's browser-origin check. No new test identity or fresh submission UUID was generated for this deployment check.

In the browser, the production Home page rendered the original typography and images without horizontal overflow or broken loaded images. Navigation to Contact worked, and its custom form loaded the live published fields, product categories, and enabled Submit button.

LeadCRM's source, authentication, schema, hosting, form definition, and business logic were not modified. The website uses its existing public API through the Next.js proxy.

Screenshots: [deployment success](verification/vercel-deployed.jpg), [production domain configuration](verification/vercel-domain.jpg), and [live Home page](verification/vercel-live-home.jpg).
