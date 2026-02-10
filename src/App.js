import { useState, useEffect } from "react";

/* 기본 카테고리 */
const defaultCategories = [
  "🌿 경유·자연",
  "🎯 관광·체험",
  "🍴 맛집",
  "🚐 차박 · 캠핑",
];

function App() {
  /* 여행 제목 */
  const [tripTitle, setTripTitle] = useState(() => {
    return localStorage.getItem("tripTitle") || "여행 일정";
  });

  /* Day 데이터 */
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem("travelDays");
    return saved
      ? JSON.parse(saved)
      : [
          {
            title: "Day 1",
            open: true,
            categories: defaultCategories.map((c) => ({
              name: c,
              open: true,
              items: [],
            })),
          },
        ];
  });

  /* 🔹 localStorage 저장 */
  useEffect(() => {
    localStorage.setItem("tripTitle", tripTitle);
    localStorage.setItem("travelDays", JSON.stringify(days));
  }, [tripTitle, days]);

  /* Day 접기/펼치기 */
  const toggleDay = (index) => {
    const newDays = [...days];
    newDays[index].open = !newDays[index].open;
    setDays(newDays);
  };

  /* Day 제목 수정 */
  const editDayTitle = (index) => {
    const newTitle = prompt("Day 제목을 입력하세요", days[index].title);
    if (!newTitle) return;

    const newDays = [...days];
    newDays[index].title = newTitle;
    setDays(newDays);
  };

  /* Day 삭제 */
  const deleteDay = (index) => {
    if (!window.confirm("이 Day를 삭제할까요?")) return;

    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
  };

  /* Day 추가 (➕ FAB) */
  const addDay = () => {
    setDays([
      ...days,
      {
        title: `Day ${days.length + 1}`,
        open: true,
        categories: defaultCategories.map((c) => ({
          name: c,
          open: true,
          items: [],
        })),
      },
    ]);
  };

  /* 카테고리 접기/펼치기 */
  const toggleCategory = (dIdx, cIdx) => {
    const newDays = [...days];
    newDays[dIdx].categories[cIdx].open = !newDays[dIdx].categories[cIdx].open;
    setDays(newDays);
  };

  /* 일정 내용 추가 */
  const addItem = (dIdx, cIdx) => {
    const text = prompt("일정 내용을 입력하세요");
    if (!text) return;

    const newDays = [...days];
    newDays[dIdx].categories[cIdx].items.push({
      text,
      link: "",
    });
    setDays(newDays);
  };

  /* 네이버지도 링크 추가 */
  const addLink = (dIdx, cIdx, iIdx) => {
    const link = prompt("네이버지도 링크를 붙여주세요");
    if (!link) return;

    const newDays = [...days];
    newDays[dIdx].categories[cIdx].items[iIdx].link = link;
    setDays(newDays);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      {/* 여행 제목 (클릭해서 수정) */}
      <h2
        onClick={() => {
          const newTitle = prompt("여행 제목을 입력하세요", tripTitle);
          if (newTitle) setTripTitle(newTitle);
        }}
        style={{ cursor: "pointer" }}
      >
        🗺️ {tripTitle}
      </h2>

      {/* Day 목록 */}
      {days.map((day, dIdx) => (
        <div
          key={dIdx}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 14,
          }}
        >
          {/* Day 헤더 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {/* 접기/펼치기 */}
            <span
              onClick={() => toggleDay(dIdx)}
              style={{ cursor: "pointer", marginRight: 6 }}
            >
              {day.open ? "🔽" : "▶️"}
            </span>

            {/* Day 제목 수정 */}
            <span
              onClick={() => editDayTitle(dIdx)}
              style={{ cursor: "pointer" }}
              title="클릭해서 Day 제목 수정"
            >
              {day.title}
            </span>

            {/* Day 삭제 */}
            <span
              onClick={() => deleteDay(dIdx)}
              style={{
                marginLeft: "auto",
                cursor: "pointer",
                fontSize: 16,
              }}
              title="Day 삭제"
            >
              🗑️
            </span>
          </div>

          {/* 카테고리 */}
          {day.open &&
            day.categories.map((cat, cIdx) => (
              <div
                key={cIdx}
                style={{
                  background: "#f9f9f9",
                  borderRadius: 6,
                  padding: 10,
                  marginTop: 8,
                }}
              >
                {/* 카테고리 헤더 */}
                <div
                  onClick={() => toggleCategory(dIdx, cIdx)}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  {cat.open ? "🔽" : "▶️"} {cat.name}
                </div>

                {/* 카테고리 내용 */}
                {cat.open && (
                  <div style={{ marginLeft: 14, marginTop: 6 }}>
                    {cat.items.map((item, iIdx) => (
                      <div key={iIdx} style={{ marginBottom: 4 }}>
                        • {item.text}
                        <span
                          onClick={() => addLink(dIdx, cIdx, iIdx)}
                          style={{ marginLeft: 6, cursor: "pointer" }}
                        >
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📍
                            </a>
                          ) : (
                            "📍"
                          )}
                        </span>
                      </div>
                    ))}

                    {/* ➕ 일정 추가 */}
                    <div
                      onClick={() => addItem(dIdx, cIdx)}
                      style={{
                        marginTop: 6,
                        cursor: "pointer",
                        color: "#4CAF50",
                      }}
                    >
                      ➕ 내용 추가
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}

      {/* ➕ FAB */}
      <button
        onClick={addDay}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          fontSize: 28,
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        ➕
      </button>
    </div>
  );
}

export default App;
