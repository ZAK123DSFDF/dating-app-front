export default async function SignupData(formData: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Signup failed");
  }
  const data = await response.json();
  return data;
}
