'use client';
import { Editor } from "novel";
import { useState, useRef } from 'react';

export default function Home() {
  const editorRef = useRef<any>(null);

  // This function will be called every time the editor updates
  const handleUpdate = (editor: any) => {
    editorRef.current = editor;  // Store the editor instance in the ref
  };
  console.log('trying to get feedback')
  // This function retrieves and logs the entire text content from the editor
  const logEditorContent = () => {
    if (editorRef.current) {
      const allText = editorRef.current.getText();
      console.log(allText);
      console.log('Getting feedback');
    }
  };
  const [feedback, setFeedback] = useState('');

  const getFeedback = async () => {
    // Send request to the API for feedback
    console.log('Getting feedback');
    // TODO: set feedback here once the api works
    const response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({ prompt: '' }), // Empty string since content is fetched within the API
    });

    if (response.ok) {
      const data = await response.text();
      setFeedback(data);
    } else {
      const errorMessage = await response.text();
      console.error('Failed to fetch feedback:', errorMessage);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center my-10 text-black'>
      <Editor completionApi="/api/generate" onUpdate={handleUpdate} />
      <button onClick={logEditorContent} className='-mt-20 py-4 px-4 bg-white border rounded'>Feedback</button>
      <div
        id="feedback-output"
        className="mt-4 p-2 border rounded bg-white w-1/2" 
      >
        {feedback || 'test test'} {/* Display feedback or default text */}
      </div>
    </div>
  );
}