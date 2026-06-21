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
          padding: "60px 20px",
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <h2>Free Employer</h2>
            <h1 style={{ color: "#16a34a" }}>$0</h1>
            <p>Perfect for small employers hiring occasionally.</p>
            <ul>
              <li>4 Job Posts</li>
              <li>Company Profile</li>
              <li>Applicant Tracking</li>
              <li>ATS Applications</li>
              <li>Email Applications</li>
              <li>Basic Support</li>
            </ul>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg,#1d4ed8,#2563eb)",
              borderRadius: "24px",
              padding: "40px",
              color: "white",
            }}
          >
            <div>MOST POPULAR</div>
            <h2>Premium Employer</h2>
            <h1>$99/month</h1>
            <ul>
              <li>Unlimited Job Posts</li>
              <li>Resume Search Access</li>
              <li>Featured Jobs</li>
              <li>Verified Employer Badge</li>
              <li>Candidate Shortlisting</li>
              <li>Priority Support</li>
            </ul>
            <a href="mailto:sales@searcheezy.com">
              <button>Upgrade Now</button>
            </a>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
            }}
          >
            <h2>Staffing Agency</h2>
            <h1>$199/month</h1>
            <p>Designed for recruiting firms and staffing agencies.</p>
            <ul>
              <li>Everything in Premium</li>
              <li>Agency Verification</li>
              <li>Unlimited Recruiting</li>
              <li>Priority Placement</li>
              <li>Featured Jobs</li>
              <li>Resume Search Access</li>
            </ul>
            <a href="mailto:sales@searcheezy.com">
              <button>Contact Sales</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
