import { useEffect } from 'react';
import "./Popup.css";

export default function() {
  useEffect(() => {
    console.log("Hello from the popup!");
  }, []);

  return (
    <div>
      <img src="/logo.png" />
      <h1>Izanami</h1>
      <a href='https://izanami.pages.dev/'>
        Dashboard
      </a>
    </div>
  )
}
