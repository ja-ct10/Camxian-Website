# Implementation verification — November 13, 2026

## Result

The four-page standalone website is implemented. A real browser submission from its custom Contact page was accepted by the existing LeadCRM public Forms API and verified in Forms history and the associated Lead. Replaying the exact request UUID returned acceptance without creating another history entry or associated deal.

## Local checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 23 tests across 3 files |
| `npm run build` | PASS — production webpack build, four static pages and two dynamic API routes |
| Referenced local image/font assets | PASS — 173 references resolved; no missing files |
| Original image downloads | PASS — all requested public image variants downloaded |
| Production HTTP checks | PASS — all four pages and the published-form proxy returned HTTP 200 |
| Production browser checks | PASS — form enabled; no console errors during page checks |

Contract tests cover actual-ID mappings, required fields, additional unsupported required inputs, malformed definitions, approved product UUIDs, names, email, PH phones, text bounds, UTM filtering, and stable submission identity.

Proxy tests cover missing/invalid configuration, fixed upstream URLs, no credential/IP forwarding, unconfirmed/malformed responses, validation errors, rate-limit headers, 64 KB body limits, malformed JSON, cross-origin rejection, the browser Host versus Next internal hostname, network failure, and timeout.

Component tests cover loading/unavailable states, validation, product category filtering without dropping selections, busy-state disabling, input preservation, server field errors, success only after acceptance, changed-version review, and a simulated lost response after acceptance. The lost-response fixture records requests by UUID and confirms one saved inquiry across the retry.

## Visual and interaction checks

Compared the original and recreated pages in the in-app Chromium browser at matching **1440, 1024, 768, 390, and 320 pixel** widths. Measurement captures use the same browser tab for both sites to ensure the viewport really matches.

- Home, About, and Products & Services section heights matched the original at every checked width after correcting margins, letter spacing, icon sizing, and timeline layout. Total document-height rounding differed by at most one pixel on a few mobile pages.
- The original page structure, text, assets, mask geometry, colors, heading sizes, and section order are retained. The original blue/navy values include `#02132F`, `#2D348D`, `#4968D0`, and `#4293E5`.
- Contact retains the original page panels, imagery, map, and contact details. Its form height intentionally differs because the selected seven LeadCRM fields replace the original inquiry-type/message fields. Its map section retains the original dimensions.
- No horizontal overflow or broken loaded images was observed across the 20 page/viewport combinations. A separate asset-reference check resolved all local paths.
- Mobile navigation opened, closed with Escape, returned focus to its toggle, restored body scrolling, and navigated to Contact.
- Milestone autoplay advanced; mobile pagination displayed seven positions. Pagination clicks and the Left Arrow key selected the expected slide. Desktop, tablet, and mobile layouts preserve the original slide counts.
- Empty and invalid-email submissions displayed field errors in the real page. Product category filtering, selection, loading, failure preservation, and accepted feedback were exercised.
- Local navigation, the original external tracker/legal/social destinations, phone/email links, and map links were inspected.

See [raw viewport measurements](verification/visual-metrics.json), [desktop Home](verification/home-desktop.jpg), [mobile Home](verification/home-mobile.jpg), and [accepted Contact inquiry](verification/contact-accepted.jpg).

These checks establish the observed Chromium layouts and interactions. They are not an automated raster-pixel equivalence score or a test on physical Safari/Firefox devices.

## Actual LeadCRM verification

Read-only inspection of the signed-in **Camxian Technologies** workspace found its existing published **Contact Us** form. Its public definition returned version **3**, seven compatible mappings, and 27 approved products from `https://api.lead-crm.tech`.

The website's ignored local environment uses the verified public form UUID `11c34df6-51f7-4141-9df6-e5a36db8eef0`. The form was not edited or republished. A final read confirmed revision 1, published revision 1/version 3, and the unchanged October 26 update timestamp.

At **21:04:34 Asia/Manila on November 13, 2026**, the recreated page submitted this explicitly labeled test inquiry:

- Name: **Camxian Website Integration Test**
- Email: `camxian-website-qa-20261113@example.com` (reserved example domain)
- Company: **Camxian Website QA — test only (2026-11-13)**
- Product: **PLDT Enterprise**, selected from the published catalog
- Address answer: a clear integration-test explanation; no telephone number was invented
- Tracking: `utm_source=company_website`, `utm_medium=website`, `utm_campaign=camxian_website_verification`

The website showed success only after confirmed acceptance. The existing authenticated Forms history endpoint was inspected read-only in the signed-in browser; its total increased from **2 to 3**, with exactly **one** matching QA inquiry. Its seven values, product UUID, version, tracking, and linked Lead were verified. No authentication credential from that browser was copied into this website.

The associated Lead was opened in LeadCRM. It displayed the QA name/company, Website source, the existing automatic assignment, and exactly **one PLDT Enterprise deal**.

The exact accepted UUID/payload was replayed through the website's proxy:

```text
HTTP 201
{"success":true,"data":{"accepted":true}}
```

After replay, Forms history remained at **3 total / 1 matching QA inquiry**, with the same submission and Lead. The associated Lead still had one deal. The labeled QA record is retained; no customer records were manually edited or deleted.

## Independence and remaining deployment work

All project work is inside the standalone website workspace. Its single remote is `https://github.com/ja-ct10/Camxian-Website.git`, and development uses `main`.

LeadCRM's latest `main` public contract/controller/service/routes were read as references. No LeadCRM source files, branches, commits, pull requests, deployment configuration, form configuration, migrations, or database scripts were modified. Runtime writes were limited to the requested inquiry through its existing public API.

Production hosting and domain cutover are outside this implementation. After deploying the website, set its two environment values and repeat an identified inquiry from that deployed origin. Upstream availability, the published form's current configuration, the original Adobe font delivery, and LeadCRM's existing rate limits remain external dependencies.
