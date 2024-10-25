import React, { useState, useEffect, useRef } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [message, setMessage] = useState("");
  const captchaRef = useRef(null);

  useEffect(() => {
    if (window.turnstile) {
      window.turnstile.render(captchaRef.current, {
        sitekey: "YOUR_SITE_KEY",
        callback: (token) => setCaptchaToken(token),
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!captchaToken) {
      setMessage("لطفاً کپچا را حل کنید.");
      return;
    }

    try {
      const response = await fetch("/api/submit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, captchaToken }),
      });

      if (response.ok) {
        setMessage("ایمیل با موفقیت ارسال شد!");
        setEmail(""); // پاک کردن فیلد ایمیل پس از موفقیت
        setCaptchaToken(""); // پاک کردن توکن کپچا
      } else {
        setMessage("خطایی در ارسال ایمیل رخ داد.");
      }
    } catch (error) {
      setMessage("ارتباط با سرور برقرار نشد.");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "50px auto", textAlign: "center" }}>
      <h2>فرم ارسال ایمیل</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ایمیل:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "10px 0" }} />
        </label>

        {/* کپچای کلودفلر */}
        <div ref={captchaRef} style={{ margin: "10px 0" }}></div>

        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer", marginTop: "10px" }}>
          ارسال
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
