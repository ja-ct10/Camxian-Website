import type { ContactValues } from "../src/lib/contact-contract";
export const productId = "00000000-0000-4000-8000-000000000001";
export const secondProductId = "00000000-0000-4000-8000-000000000002";
export const formId = "10000000-0000-4000-8000-000000000001";
export function definition() {
  return { success: true, data: { name: "Contact Us", version: 3, trackUrlParams: true, fields: [
    { id: "given", type: "single-line", label: "First Name", mapToField: "firstName", required: true },
    { id: "family", type: "single-line", label: "Last Name", mapToField: "lastName", required: true },
    { id: "organization", type: "single-line", label: "Company", mapToField: "companyName" },
    { id: "mobile", type: "phone", label: "Contact Number", mapToField: "phone" },
    { id: "mail", type: "email", label: "Email Address", mapToField: "email", required: true },
    { id: "products", type: "dropdown", label: "Product Interest", mapToField: "productInterest", required: true, options: [productId, secondProductId] },
    { id: "location", type: "multi-line", label: "Full Address", mapToField: "address" },
  ], productCatalog: { categories: ["Security", "Telecom"], products: [{ id: productId, name: "CCTV", category: "Security" }, { id: secondProductId, name: "Internet", category: "Telecom" }] } } };
}
export function validValues(): ContactValues {
  return { firstName: " Alice ", lastName: "O’Connor", email: " ALICE@EXAMPLE.COM ", phone: "9123456789", companyName: "Example Company", address: "Pasig", productInterest: [productId] };
}
