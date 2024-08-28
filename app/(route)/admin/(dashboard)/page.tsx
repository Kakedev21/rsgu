import Dashboard from "@/app/(route)/admin/(dashboard)/_component/Dashboard";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
 

  return (
    <Dashboard/>
  );
}
