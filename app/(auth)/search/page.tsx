import { getAuthData } from "@/app/actions/getAuth";
import Search from "@/app/components/Search";
export default async function page() {
  await getAuthData();
  return <Search />;
}
