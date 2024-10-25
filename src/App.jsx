import React, { useState } from "react";
import Turnstile from "@cloudflare/turnstile-react";

function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleToken = (token) => {
    setToken(token);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setMessage("لطفا کپچا را حل کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      if (response.ok) {
        setMessage("ایمیل با موفقیت ارسال شد.");
      } else {
        setMessage("خطایی رخ داده است.");
      }
    } catch (error) {
      setMessage("خطایی رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>فرم ایمیل با کپچا کلودفلر</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input type="email" placeholder="ایمیل خود را وارد کنید" value={email} onChange={handleEmailChange} required style={{ padding: "10px", width: "100%", marginBottom: "10px" }} />
        <Turnstile sitekey="YOUR_SITE_KEY" onVerify={handleToken} theme="light" />
        <button type="submit" disabled={loading} style={{ padding: "10px", width: "100%", marginTop: "10px" }}>
          {loading ? "در حال ارسال..." : "ارسال"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default App;
