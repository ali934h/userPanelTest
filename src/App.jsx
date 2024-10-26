import React, { useState, useEffect, useRef } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState(""); // نام کامل
  const [phoneNumber, setPhoneNumber] = useState(""); // شماره موبایل
  const [message, setMessage] = useState(""); // پیام
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef(null);

  useEffect(() => {
    const loadCaptcha = () => {
      if (window.turnstile) {
        window.turnstile.render(captchaRef.current, {
          sitekey: "0x4AAAAAAAycagpkswjtvzkW",
          callback: (token) => setCaptchaToken(token),
        });
      }
    };

    loadCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!captchaToken) {
      setMessage("لطفاً کپچا را حل کنید.");
      return;
    }

    try {
      const response = await fetch("https://userpanelworker.kenconsidine90.workers.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName, phoneNumber, message, captchaToken }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("اطلاعات با موفقیت ارسال شد!");
        // پاک کردن فیلدها
        setEmail("");
        setFullName("");
        setPhoneNumber("");
        setMessage(""); // پاک کردن فیلد پیام
        setCaptchaToken("");
      } else {
        setMessage(data.message || "خطایی در ارسال اطلاعات رخ داد.");
      }
    } catch (error) {
      setMessage("ارتباط با سرور برقرار نشد.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>فرم ارسال اطلاعات</h2>
      <form onSubmit={handleSubmit}>
        <label>
          نام کامل:
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "10px 0" }} />
        </label>
        <label>
          ایمیل:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "10px 0" }} />
        </label>
        <label>
          شماره موبایل:
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "10px 0" }} />
        </label>
        <label>
          پیام:
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: "100%", padding: "8px", margin: "10px 0", resize: "none" }} />
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
