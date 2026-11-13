import { forwardContactRequest } from "@/lib/leadcrm.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) { return forwardContactRequest(request, true); }
