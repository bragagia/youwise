"use client";

import { callOpenAISA, createUserSA } from "@/app/server";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  const handler = async () => {
    setText("loading...");

    const ret = await callOpenAISA();

    setText(JSON.stringify(ret, null, 2));
  };

  return (
    <div className="p-2">
      <button className="border rounded-md p-1" onClick={() => handler()}>
        Gen questions
      </button>
      <button
        className="border rounded-md p-1"
        onClick={async () => await createUserSA()}
      >
        Create user
      </button>

      <p className="whitespace-pre">{text}</p>
    </div>
  );
}
