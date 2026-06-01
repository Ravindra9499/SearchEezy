type Props = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (
    category: string
  ) => void;
};

export default function CategoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div
      style={{
        display:
          "flex",
        gap: "10px",
        flexWrap:
          "wrap",
      }}
    >
      {categories.map(
        (category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(
                category
              )
            }
            style={{
              background:
                selectedCategory ===
                category
                  ? "#1c4ed8"
                  : "white",
              color:
                selectedCategory ===
                category
                  ? "white"
                  : "#1c4ed8",
              border:
                "1px solid #1c4ed8",
              padding:
                "10px 16px",
              borderRadius:
                "999px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >
            {category}
          </button>
        )
      )}
    </div>
  );
}