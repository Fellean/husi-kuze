import {
  expiredSessionCookie,
  safeReturnPath,
} from "../../../selfhost-auth";

export async function GET(request: Request) {
  const returnTo = safeReturnPath(
    new URL(request.url).searchParams.get("returnTo") ?? "/",
  );
  return new Response(null, {
    status: 303,
    headers: {
      location: returnTo,
      "set-cookie": expiredSessionCookie(),
    },
  });
}
