async function test() {
  try {
    const res = await fetch("https://bolls.life/get-translations/");
    if (res.ok) {
      const data = await res.json();
      // data is probably a list or an object by language
      // Let's print keys or entries
      if (Array.isArray(data)) {
        console.log("Translations list size:", data.length);
        const spanish = data.filter(t => t.language?.toLowerCase() === "spanish" || t.lang?.toLowerCase() === "es" || t.language === "es" || t.info?.toLowerCase().includes("spanish"));
        console.log("Spanish translations count:", spanish.length);
        console.log("Spanish translations:", spanish.map(s => ({ code: s.translation, name: s.info || s.name })));
      } else {
        console.log("Response keys:", Object.keys(data));
        // If it's an object grouped by language
        for (const lang of Object.keys(data)) {
          if (lang.toLowerCase().includes("es") || lang.toLowerCase().includes("span")) {
            console.log(lang, ":", data[lang]);
          }
        }
      }
    } else {
      console.log("Failed to fetch translations:", res.status);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
