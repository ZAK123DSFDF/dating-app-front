"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchLogin } from "../actions/getLogin";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      localStorage.setItem("userId", data.id);
      window.location.href = "/chat";
    },
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
    mutate({ email, password });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-screen h-screen flex flex-col gap-5 justify-center items-center"
    >
      <input
        type="text"
        placeholder="email"
        className="p-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        className="p-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-400 text-white py-2 px-4 rounded-md"
      >
        {isPending ? "loading..." : "login"}
      </button>
      {isError && <div>{error.message}</div>}
    </form>
  );
}
