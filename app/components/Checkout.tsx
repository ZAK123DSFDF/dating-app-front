"use client";
import { SocketContext } from "@/provider/context";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { socket } = useContext(SocketContext);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    const formattedInput = numericInput.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedInput);

    if (numericInput.length > 16) {
      setError("Card number cannot be more than 16 digits");
    } else {
      setError(null);
    }
  };

  const submitChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericCardNumber = parseInt(cardNumber.replace(/\s+/g, ""));
    if (numericCardNumber === 4242424242424242) {
      if (socket) {
        socket.emit("addCredit", { cardNumber: numericCardNumber });
        setCardNumber("");
        router.push("/profile");
      }
    } else {
      setError("Invalid credit card number");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-3">
      <form onSubmit={submitChange}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="type credit card..."
            value={cardNumber}
            onChange={handleInputChange}
            maxLength={19}
            className="p-2 outline-none"
          />
          <button type="submit" className="bg-blue-300 text-white p-2">
            Add Credit
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
