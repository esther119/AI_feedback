"use client";
import { get } from "http";
import { Editor } from "novel";
import { Editor as EditorTipTap } from "@tiptap/core";
import { useState, useRef } from "react";
import { EstherEditor } from "./types/EstherEditor";

export default function Home() {
  const editorRef = useRef<any>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedback, setFeedback] = useState("");

  // This function will be called every time the editor updates
  const handleUpdate = (editor: EditorTipTap | undefined) => {
    if (!editor) {
      return;
    }
    const text = editor.getText();
    setFeedbackInput(text);
  };

  const getFeedback = async () => {
    // Send request to the API for feedback
    // TODO: set feedback here once the api works
    console.log("get feedback function runnining");
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: feedbackInput }), // Empty string since content is fetched within the API
    });
    if (response.ok) {
      if (response.body) {
        const reader = response.body.getReader();
        let text = "";
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Convert the Uint8Array to a string and append it to the existing text
          text += new TextDecoder("utf-8").decode(value);
          setFeedback(text);
        }
      } else {
        const errorMessage = await response.text();
        console.error("Failed to fetch feedback:", errorMessage);
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center my-10 text-black">
      <Editor completionApi="/api/generate" onDebouncedUpdate={handleUpdate} />
      <button
        onClick={getFeedback}
        className="-mt-20 py-4 px-4 bg-white border rounded"
      >
        Feedback
      </button>
      <div
        id="feedback-output"
        className="mt-4 p-2 border rounded bg-white w-2/3"
      >
        {feedback ? (
          <span className="text-black">{feedback}</span>
        ) : (
          <span className="text-gray-500">This is Tung&rsquo;s 😉 feedback.</span>
        )}
      </div>
    </div>
  );
}
