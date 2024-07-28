"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  const handler = async () => {
    setText("loading...");

    setText("JSON.stringify(ret, null, 2)");
  };

  return (
    <div className="p-2">
      <button className="border rounded-md p-1" onClick={() => handler()}>
        Gen questions
      </button>

      <p className="whitespace-pre">{text}</p>
    </div>
  );
}
