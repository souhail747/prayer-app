import { useEffect, useState, useMemo } from "react";
import Prayers from "./Prayers";
import "./prayer.css";
import "./NextSalat.css"
function PrayerList() {
  const today = new Date();
  const dateString = today.toLocaleDateString("ar-TN");
  const [adhanlist, setAdhanlist] = useState({});
  const [city, setCity] = useState("Douz");
  const [nextPrayer, setNextPrayer] = useState(null);
  const [remaining, setRemaining] = useState("");

  const lists = [
    { name: "دوز", value: "Douz" },
    { name: "تونس", value: "Tunis" },
    { name: "صفاقس", value: "Sfax" },
    { name: "سوسة", value: "Sousse" },
    { name: "قابس", value: "Gabes" },
    { name: "قفصة", value: "Gafsa" },
    { name: "قصرين", value: "Kasserine" },
    { name: "مدنين", value: "Medenine" },
    { name: "قبلي", value: "Kebili" },
    { name: "نابل", value: "Nabeul" },
    { name: "باجة", value: "Beja" },
    { name: "بنزرت", value: "Bizerte" },
    { name: "زغوان", value: "Zaghouan" },
    { name: "المهدية", value: "Mahdia" },
    { name: "المنستير", value: "Monastir" },
    { name: "تطاوين", value: "Tataouine" },
    { name: "جندوبة", value: "Jendouba" },
    { name: "سليانة", value: "Siliana" },
    { name: "الكاف", value: "Kef" },
    { name: "القيروان", value: "Kairouan" },
  ];

  // Fetch prayer times
  useEffect(() => {
    const fetchAdhan = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Tunisia&method=5`
        );
        const data = await response.json();
        setAdhanlist(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdhan();
  }, [city]);

  // Memoize t to prevent useEffect warning
  const t = useMemo(() => adhanlist?.data?.timings || {}, [adhanlist]);

  // Determine next prayer
  useEffect(() => {
    if (!t.Fajr) return;

    const prayers = [
      { name: "الفجر", time: t.Fajr },
      { name: "الظهر", time: t.Dhuhr },
      { name: "العصر", time: t.Asr },
      { name: "المغرب", time: t.Maghrib },
      { name: "العشاء", time: t.Isha },
    ];

    const toDate = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    };

    const now = new Date();
    let next = prayers.find((p) => toDate(p.time) > now);
    if (!next) next = prayers[0]; // next day Fajr
    setNextPrayer(next);
  }, [t]);

  // Countdown timer
  useEffect(() => {
    if (!nextPrayer) return;

    const interval = setInterval(() => {
      const now = new Date();
      const [h, m] = nextPrayer.time.split(":").map(Number);
      const next = new Date();
      next.setHours(h, m, 0, 0);

      let diff = (next - now) / 1000;
      if (diff < 0) diff += 24 * 3600; // handle next day

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = Math.floor(diff % 60);

      setRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer]);

  return (
    <section className="Mycontainer">
      <div className="prayer">
        <div className="topsec">
          <div className="city">
            <h3>المدينة</h3>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {lists.map((list) => (
                <option key={list.value} value={list.value}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          <div className="date">
            <h3>التاريخ</h3>
            <h4>{dateString}</h4>
          </div>
        </div>

        <Prayers name="الفجر" time={t.Fajr} />
        <Prayers name="الظهر" time={t.Dhuhr} />
        <Prayers name="العصر" time={t.Asr} />
        <Prayers name="المغرب" time={t.Maghrib} />
        <Prayers name="العشاء" time={t.Isha} />
      </div>

      <div className="Nextcontainer">
        <div className="prayerBox">
          <p className="title">الصلاة القادمة</p>
          <div className="boxContainer">
            <div>{nextPrayer?.name}</div>
            <div>{nextPrayer?.time}</div>
          </div>
          <div className="timer">{remaining}</div>
        </div>
      </div>
    </section>
  );
}

export default PrayerList;
