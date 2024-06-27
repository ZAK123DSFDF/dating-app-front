export default async function SignupDataImage(formData: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup/image`,
    {
      method: "PATCH",
      body: formData,
      credentials: "include",
      headers: {},
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Signup failed");
  }
  const data = await response.json();
  return data;
}
