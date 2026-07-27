import { redirect } from "next/navigation";
import Link from "next/link";
import EditorLoginForm from "../components/EditorLoginForm";
import { hasAdminSession, safeReturnPath } from "../selfhost-auth";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawReturnTo = Array.isArray(params?.returnTo)
    ? params.returnTo[0]
    : params?.returnTo;
  const returnTo = safeReturnPath(rawReturnTo ?? "/?edit=1");

  if (await hasAdminSession()) redirect(returnTo);

  return (
    <main className="editorLogin">
      <div className="editorLoginMark" aria-hidden="true">
        Ů
      </div>
      <div>
        <p>HUSÍ KŮŽE · VLASTNÍ EDITOR</p>
        <h1>Upravuj web tak, jak ho vidíš.</h1>
        <p>
          Přihlášení i uložené změny běží jen v tvém Cloudflare Workeru.
          ChatGPT do nich nevidí a ke změnám webu ho nepotřebuješ.
        </p>
        <EditorLoginForm returnTo={returnTo} />
        <Link href="/">Zpět na veřejný web</Link>
      </div>
    </main>
  );
}
