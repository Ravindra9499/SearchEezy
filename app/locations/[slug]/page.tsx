export const dynamic =
  "force-dynamic";

import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const locationContent: Record<
  string,
  {
    title: string;
    description: string;
    seoContent: string;
    keywords: string[];
    matchKeywords: string[];
    popularSearches: {
      label: string;
      href: string;
    }[];
  }
> = {
  texas: {
    title:
      "Texas Jobs",

    description:
      "Explore healthcare, software engineering, remote, staffing, and technology jobs across Texas on SearchEezy.",

    seoContent:
      "SearchEezy helps employers and job seekers connect across Texas including Dallas, Houston, Austin, San Antonio, and surrounding areas.",

    keywords: [
      "Texas jobs",
      "Dallas jobs",
      "Houston jobs",
    ],

    matchKeywords: [
      "texas",
      "dallas",
      "houston",
      "austin",
    ],

    popularSearches: [
      {
        label:
          "Healthcare Jobs",
        href:
          "/categories/healthcare",
      },

      {
        label:
          "Remote Jobs",
        href:
          "/categories/remote",
      },
    ],
  },

  california: {
    title:
      "California Jobs",

    description:
      "Browse healthcare, technology, staffing, and remote jobs across California on SearchEezy.",

    seoContent:
      "Discover career opportunities across California including Los Angeles and San Francisco.",

    keywords: [
      "California jobs",
      "Los Angeles jobs",
      "San Francisco jobs",
    ],

    matchKeywords: [
      "california",
      "los angeles",
      "san francisco",
    ],

    popularSearches: [
      {
        label:
          "Technology Jobs",
        href:
          "/categories/software-engineering",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const location =
    locationContent[
      slug
    ];

  if (!location) {
    return {
      title:
        "SearchEezy Jobs",
    };
  }

  return {
    title:
      `${location.title} | SearchEezy`,

    description:
      location.description,

    keywords:
      location.keywords,
  };
}

export default async function LocationPage({
  params,
}: Props) {
  const {
    slug,
  } = await params;

  const location =
    locationContent[
      slug
    ];

  if (!location) {
    return (
      <div>
        Location not found
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
        padding:
          "50px 20px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
        }}
      >
        <a href="/">
          <button
            style={{
              background:
                "white",
              border:
                "1px solid #d1d5db",
              padding:
                "10px 16px",
              borderRadius:
                "10px",
              cursor:
                "pointer",
              marginBottom:
                "25px",
              fontWeight:
                "bold",
            }}
          >
            ← Back to Home
          </button>
        </a>

        <div
          style={{
            background:
              "linear-gradient(135deg, #111827, #1e40af)",
            borderRadius:
              "24px",
            padding:
              "50px 35px",
            color:
              "white",
            marginBottom:
              "35px",
          }}
        >
          <h1
            style={{
              fontSize:
                "42px",
              marginBottom:
                "20px",
            }}
          >
            {location.title}
          </h1>

          <p
            style={{
              fontSize:
                "18px",
              lineHeight:
                "1.8",
              color:
                "#dbeafe",
              maxWidth:
                "900px",
            }}
          >
            {
              location.description
            }
          </p>
        </div>

        <div
          style={{
            background:
              "white",
            borderRadius:
              "20px",
            padding:
              "30px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom:
                "18px",
              color:
                "#111827",
            }}
          >
            Explore{" "}
            {
              location.title
            }
          </h2>

          <p
            style={{
              color:
                "#4b5563",
              lineHeight:
                "1.9",
              fontSize:
                "16px",
            }}
          >
            {
              location.seoContent
            }
          </p>

          <div
            style={{
              display:
                "flex",
              gap: "12px",
              flexWrap:
                "wrap",
              marginTop:
                "24px",
            }}
          >
            {location.popularSearches.map(
              (
                item
              ) => (
                <a
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                  style={{
                    textDecoration:
                      "none",
                    background:
                      "#eff6ff",
                    color:
                      "#1d4ed8",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    fontWeight:
                      "bold",
                    fontSize:
                      "14px",
                  }}
                >
                  {
                    item.label
                  }
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
