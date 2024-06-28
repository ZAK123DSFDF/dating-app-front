import { getAuthData } from "@/app/actions/getAuth";
import Search from "@/app/components/Search";
import { redirect } from "next/navigation";
export default async function page() {
  const auth = await getAuthData();
  if (!auth.isAuthenticated) {
    redirect("/login");
  }
  return <Search />;
}
