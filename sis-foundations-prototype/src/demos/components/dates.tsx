import { useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Field,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, useLabels } from "./common";

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parse(value: string) {
  return new Date(`${value}T12:00:00`);
}
export function DatesDemo(props: DemoProps) {
  const t = useLabels(props);
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [selected, setSelected] = useState("2026-10-12");
  const [end, setEnd] = useState("2026-10-22");
  const [mode, setMode] = useState("single");
  const [rangeNext, setRangeNext] = useState(false);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("30");
  const [period, setPeriod] = useState("autumn");
  const [unavailable, setUnavailable] = useState(true);
  const [focusDate, setFocusDate] = useState("2026-10-12");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const locale =
    props.locale === "ar"
      ? "ar-EG-u-nu-latn"
      : "en-GB-u-nu-latn";
  const fmt = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      numberingSystem: "latn",
    }).format(parse(date));
  const start = new Date(
    month.getFullYear(),
    month.getMonth(),
    1 - new Date(month.getFullYear(), month.getMonth(), 1).getDay(),
  );
  const days = Array.from(
    { length: 42 },
    (_, index) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
  );
  const blocked = (date: Date) =>
    unavailable &&
    (date.getDay() === 5 || date.getDay() === 6 || iso(date) === "2026-10-20");
  const choose = (date: Date) => {
    if (blocked(date)) return;
    const value = iso(date);
    setFocusDate(value);
    if (mode === "range" && rangeNext) {
      if (value < selected) {
        setEnd(selected);
        setSelected(value);
      } else setEnd(value);
      setRangeNext(false);
    } else {
      setSelected(value);
      if (mode === "range") {
        setEnd(value);
        setRangeNext(true);
      }
    }
  };
  const moveMonth = (delta: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    let focus = new Date(next.getFullYear(), next.getMonth(), 1);
    while (blocked(focus))
      focus = new Date(
        focus.getFullYear(),
        focus.getMonth(),
        focus.getDate() + 1,
      );
    setFocusDate(iso(focus));
  };
  const keydown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const rtl = props.locale === "ar";
    const offsets: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
      ArrowDown: 7,
      ArrowUp: -7,
      Home: -date.getDay(),
      End: 6 - date.getDay(),
    };
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      moveMonth(event.key === "PageUp" ? -1 : 1);
      return;
    }
    if (offsets[event.key] === undefined) return;
    event.preventDefault();
    const delta = offsets[event.key];
    let next = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + delta,
    );
    const direction = delta < 0 ? -1 : 1;
    for (let index = 0; index < 7 && blocked(next); index++)
      next = new Date(
        next.getFullYear(),
        next.getMonth(),
        next.getDate() + direction,
      );
    setFocusDate(iso(next));
    if (next.getMonth() !== month.getMonth())
      setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    setTimeout(() => refs.current[iso(next)]?.focus(), 0);
  };
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="dates-calendar-and-date-range">
              {t(
                "Calendar and date range",
                "التقويم ونطاق التاريخ",
                "Calendrier et période",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <div className="toolbar">
              <Button
                variant={mode === "single" ? "primary" : "secondary"}
                aria-pressed={mode === "single"}
                onClick={() => {
                  setMode("single");
                  setRangeNext(false);
                }}
              >
                {t("Single date", "تاريخ واحد", "Date unique")}
              </Button>
              <Button
                variant={mode === "range" ? "primary" : "secondary"}
                aria-pressed={mode === "range"}
                onClick={() => setMode("range")}
              >
                {t("Date range", "نطاق تاريخ", "Période")}
              </Button>
            </div>
            <div className="component-calendar">
              <div className="component-calendar-heading">
                <Button
                  variant="ghost"
                  onClick={() => moveMonth(-1)}
                  aria-label={t(
                    "Previous month",
                    "الشهر السابق",
                    "Mois précédent",
                  )}
                >
                  <ChevronLeft size={20} />
                </Button>
                <h3 aria-live="polite">
                  {new Intl.DateTimeFormat(locale, {
                    month: "long",
                    year: "numeric",
                    numberingSystem: "latn",
                  }).format(month)}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => moveMonth(1)}
                  aria-label={t("Next month", "الشهر التالي", "Mois suivant")}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
              <div
                className="component-calendar-grid"
                role="grid"
                aria-label={t(
                  "Choose an available date",
                  "اختر تاريخًا متاحًا",
                  "Choisissez une date disponible",
                )}
              >
                <div className="component-calendar-row" role="row">
                  {Array.from({ length: 7 }, (_, index) => (
                    <div role="columnheader" key={index}>
                      {new Intl.DateTimeFormat(locale, {
                        weekday: "short",
                      }).format(new Date(2026, 9, 4 + index))}
                    </div>
                  ))}
                </div>
                {Array.from({ length: 6 }, (_, week) => (
                  <div className="component-calendar-row" role="row" key={week}>
                    {days.slice(week * 7, week * 7 + 7).map((date) => {
                      const value = iso(date);
                      const picked =
                        value === selected ||
                        (mode === "range" && value >= selected && value <= end);
                      return (
                        <div role="gridcell" aria-selected={picked} key={value}>
                          <button
                            ref={(element) => {
                              refs.current[value] = element;
                            }}
                            className="component-day"
                            type="button"
                            disabled={blocked(date)}
                            tabIndex={focusDate === value ? 0 : -1}
                            aria-label={fmt(value)}
                            aria-pressed={picked}
                            data-other-month={
                              date.getMonth() !== month.getMonth()
                            }
                            data-selected={picked}
                            onClick={() => choose(date)}
                            onKeyDown={(event) => keydown(event, date)}
                          >
                            {number(props.locale, date.getDate())}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                checked={unavailable}
                onChange={(event) => setUnavailable(event.target.checked)}
              />
              {t(
                "Block weekends and the sample holiday",
                "حظر العطلات الأسبوعية والعطلة التجريبية",
                "Bloquer les week-ends et le jour férié exemple",
              )}
            </label>
            <Badge tone="info">
              {mode === "range" && rangeNext
                ? t(
                    "Choose the range end",
                    "اختر نهاية النطاق",
                    "Choisissez la fin de la période",
                  )
                : t(
                    "Available dates only",
                    "التواريخ المتاحة فقط",
                    "Dates disponibles uniquement",
                  )}
            </Badge>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="dates-date-time-and-academic-period">
              {t(
                "Date, time, and academic period",
                "التاريخ والوقت والفترة الأكاديمية",
                "Date, heure et période universitaire",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <Field
              label={t("Selected date", "التاريخ المحدد", "Date sélectionnée")}
            >
              <input
                className="input"
                type="date"
                value={selected}
                onChange={(event) => {
                  if (event.target.value) {
                    setSelected(event.target.value);
                    setMonth(
                      new Date(
                        parse(event.target.value).getFullYear(),
                        parse(event.target.value).getMonth(),
                        1,
                      ),
                    );
                    setFocusDate(event.target.value);
                  }
                }}
              />
            </Field>
            {mode === "range" && (
              <Field label={t("Range end", "نهاية النطاق", "Fin de période")}>
                <input
                  className="input"
                  type="date"
                  min={selected}
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                />
              </Field>
            )}
            <div className="demo-grid">
              <Field label={t("Hour", "الساعة", "Heure")}>
                <select
                  className="input"
                  value={hour}
                  onChange={(event) => setHour(event.target.value)}
                >
                  {Array.from({ length: 24 }, (_, index) => (
                    <option key={index} value={String(index).padStart(2, "0")}>
                      {number(props.locale, index, { minimumIntegerDigits: 2 })}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("Minute", "الدقيقة", "Minute")}>
                <select
                  className="input"
                  value={minute}
                  onChange={(event) => setMinute(event.target.value)}
                >
                  {[0, 15, 30, 45].map((value) => (
                    <option key={value} value={String(value).padStart(2, "0")}>
                      {number(props.locale, value, { minimumIntegerDigits: 2 })}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              label={t(
                "Academic period",
                "الفترة الأكاديمية",
                "Période universitaire",
              )}
            >
              <select
                className="input"
                value={period}
                onChange={(event) => {
                  const value = event.target.value;
                  setPeriod(value);
                  const next =
                    value === "autumn"
                      ? "2026-09-21"
                      : value === "spring"
                        ? "2027-02-15"
                        : "2027-07-05";
                  setSelected(next);
                  setFocusDate(next);
                  setMonth(
                    new Date(
                      parse(next).getFullYear(),
                      parse(next).getMonth(),
                      1,
                    ),
                  );
                }}
              >
                <option value="autumn">
                  {t("Autumn 2026", "خريف 2026", "Automne 2026")}
                </option>
                <option value="spring">
                  {t("Spring 2027", "ربيع 2027", "Printemps 2027")}
                </option>
                <option value="summer">
                  {t("Summer 2027", "صيف 2027", "Été 2027")}
                </option>
              </select>
            </Field>
            <div className="result-box" role="status">
              <CalendarDays size={20} />
              <p>
                <bdi>{fmt(selected)}</bdi>
                {mode === "range" && (
                  <>
                    {" "}
                    → <bdi>{fmt(end)}</bdi>
                  </>
                )}
              </p>
              <p>
                <bdi>
                  {hour}:{minute}
                </bdi>{" "}
                · Africa/Cairo
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setSelected("2026-10-28");
                setFocusDate("2026-10-28");
                setMonth(new Date(2026, 9, 1));
              }}
            >
              {t(
                "Use sample today",
                "استخدام يوم المثال",
                "Utiliser le jour exemple",
              )}
            </Button>
          </div>
        </Panel>
      </div>
    </ComponentFrame>
  );
}
