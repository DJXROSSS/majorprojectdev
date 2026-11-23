import { notFound } from "next/navigation";
import Home from "../page";
import { canVisit } from "@/lib/placepro/routing";
import type { Page, Role } from "@/types";

export default async function PortalRoute({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (path.length === 1 && ["login", "change-password"].includes(path[0])) return <Home />;
  const [role, page] = path;
  if (path.length !== 2 || !["admin", "trainer", "student"].includes(role) || !canVisit(role as Role, page as Page)) notFound();
  return <Home />;
}
