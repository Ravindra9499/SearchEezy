export default function PricingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 20px 60px 20px",
        }}
      >
        <a href="/">
          <button
            style={{
              background: "#1c4ed8",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
          >
            ← Back to Home
          </button>
        </a>

        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            SearchEezy Pricing
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#6b7280",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8",
            }}
          >
            Flexible hiring plans for direct employers,
            healthcare organizations, staffing agencies,
            and recruiting firms.
          </p>
        </div>
      </div>
    </div>
  );
}
