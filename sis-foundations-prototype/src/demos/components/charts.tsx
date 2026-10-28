import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Download, RefreshCw } from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Field,
  download,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, flags, useLabels } from "./common";

export function ChartsDemo(props: DemoProps) {
  const t = useLabels(props);
  const f = flags(props);
  const [series, setSeries] = useState(["enrolled", "completed"]);
  const [cohort, setCohort] = useState("engineering");
  const [progress, setProgress] = useState(72);
  const [table, setTable] = useState(true);
  const [refreshed, setRefreshed] = useState(false);
  const data = [
    {
      term: t("Autumn 2024", "خريف 2024", "Automne 2024"),
      enrolled: 120,
      completed: 96,
    },
    {
      term: t("Spring 2025", "ربيع 2025", "Printemps 2025"),
      enrolled: 144,
      completed: 118,
    },
    {
      term: t("Autumn 2025", "خريف 2025", "Automne 2025"),
      enrolled: 156,
      completed: 138,
    },
    {
      term: t("Spring 2026", "ربيع 2026", "Printemps 2026"),
      enrolled: 168,
      completed: 147,
    },
  ].map((item) => ({
    ...item,
    enrolled: Math.round(item.enrolled * (cohort === "science" ? 0.7 : 1)),
    completed: Math.round(item.completed * (cohort === "science" ? 0.7 : 1)),
  }));
  const chartData = f.empty && !refreshed ? [] : data;
  const labels: Record<string, string> = {
    enrolled: t("Enrolled", "مقيد", "Inscrits"),
    completed: t("Completed", "مكتمل", "Terminés"),
  };
  const colors: Record<string, string> = {
    enrolled: "var(--sys-color-chart-1)",
    completed: "var(--sys-color-chart-2)",
  };
  const pieData = [
    {
      name: t("Completed credits", "الساعات المكتملة", "Crédits acquis"),
      value: progress,
    },
    {
      name: t("Remaining credits", "الساعات المتبقية", "Crédits restants"),
      value: 100 - progress,
    },
  ];
  const tooltipStyle = {
    background: "var(--sys-color-bg-raised)",
    border: "1px solid var(--sys-color-border-default)",
    color: "var(--sys-color-text-primary)",
    borderRadius: 8,
    fontSize: 14,
  };
  const exportData = () => {
    download(
      "sample-enrollment.csv",
      `term,enrolled,completed\n${data.map((item) => `${item.term},${item.enrolled},${item.completed}`).join("\n")}`,
      "text/csv",
    );
    props.notify(
      t(
        "Sample chart data exported",
        "صُدّرت بيانات الرسم التجريبية",
        "Données exemples exportées",
      ),
      "success",
    );
  };
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="charts-chart-controls-and-legend">
            {t(
              "Chart controls and legend",
              "عناصر الرسم والمفتاح",
              "Commandes et légende",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <Field
            label={t("Sample cohort", "الدفعة التجريبية", "Groupe exemple")}
          >
            <select
              className="input"
              value={cohort}
              onChange={(event) => setCohort(event.target.value)}
            >
              <option value="engineering">
                {t("Engineering", "الهندسة", "Ingénierie")}
              </option>
              <option value="science">
                {t("Science", "العلوم", "Sciences")}
              </option>
            </select>
          </Field>
          {Object.keys(labels).map((key) => (
            <Button
              key={key}
              variant={series.includes(key) ? "secondary" : "ghost"}
              aria-pressed={series.includes(key)}
              onClick={() =>
                setSeries(
                  series.includes(key)
                    ? series.filter((value) => value !== key)
                    : [...series, key],
                )
              }
            >
              <span
                className="component-legend-mark"
                style={{ background: colors[key] }}
              />
              {labels[key]}
            </Button>
          ))}
          <Button variant="secondary" onClick={exportData}>
            <Download size={20} />
            CSV
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSeries(["enrolled", "completed"]);
              setRefreshed(true);
              props.notify(
                t(
                  "Sample series restored",
                  "استُعيدت البيانات التجريبية",
                  "Séries exemples restaurées",
                ),
              );
            }}
          >
            <RefreshCw size={20} />
            {t("Restore series", "استعادة البيانات", "Restaurer les séries")}
          </Button>
        </div>
        <p className="muted">
          {t(
            "The legend buttons toggle each series. All figures are explicit sample data.",
            "تبدل أزرار المفتاح كل مجموعة. جميع الأرقام بيانات تجريبية صريحة.",
            "Les boutons affichent chaque série. Tous les chiffres sont des données exemples.",
          )}
        </p>
      </Panel>
      <div className="demo-grid component-chart-grid">
        <Panel
          title={
            <span data-specimen="charts-bar-chart">
              {t("Bar chart", "رسم بالأعمدة", "Diagramme en barres")}
            </span>
          }
        >
          <div
            className="component-chart"
            role="img"
            aria-label={t(
              "Sample enrollment by term. Values appear in the data table.",
              "القيد التجريبي حسب الفصل. القيم في جدول البيانات.",
              "Inscriptions exemples par semestre. Valeurs dans le tableau.",
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 24, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid
                  stroke="var(--sys-color-chart-grid)"
                  vertical={false}
                />
                <XAxis
                  dataKey="term"
                  tick={{ fill: "var(--sys-color-chart-axis)", fontSize: 14 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={64}
                />
                <YAxis
                  tickFormatter={(value) => number(props.locale, value)}
                  tick={{ fill: "var(--sys-color-chart-axis)", fontSize: 14 }}
                  width={44}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, key) => [
                    number(props.locale, Number(value)),
                    labels[String(key)] || String(key),
                  ]}
                />
                {series.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[key]}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="charts-line-chart">
              {t("Line chart", "رسم خطي", "Courbes")}
            </span>
          }
        >
          <div
            className="component-chart"
            role="img"
            aria-label={t(
              "Sample enrollment trend. Values appear in the data table.",
              "اتجاه القيد التجريبي. القيم في جدول البيانات.",
              "Évolution des inscriptions. Valeurs dans le tableau.",
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 16, bottom: 24, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid
                  stroke="var(--sys-color-chart-grid)"
                  vertical={false}
                />
                <XAxis
                  dataKey="term"
                  tick={{ fill: "var(--sys-color-chart-axis)", fontSize: 14 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={64}
                />
                <YAxis
                  tickFormatter={(value) => number(props.locale, value)}
                  tick={{ fill: "var(--sys-color-chart-axis)", fontSize: 14 }}
                  width={44}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, key) => [
                    number(props.locale, Number(value)),
                    labels[String(key)] || String(key),
                  ]}
                />
                {series.map((key, index) => (
                  <Line
                    key={key}
                    dataKey={key}
                    stroke={colors[key]}
                    strokeWidth={2}
                    strokeDasharray={index ? "6 4" : undefined}
                    dot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="charts-area-chart">
              {t("Area chart", "رسم مساحي", "Aires")}
            </span>
          }
        >
          <div
            className="component-chart"
            role="img"
            aria-label={t(
              "Sample enrollment area chart. Values appear in the data table.",
              "رسم مساحي للقيد التجريبي. القيم في جدول البيانات.",
              "Aires des inscriptions exemples. Valeurs dans le tableau.",
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 16, bottom: 24, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid
                  stroke="var(--sys-color-chart-grid)"
                  vertical={false}
                />
                <XAxis
                  dataKey="term"
                  tick={{ fill: "var(--sys-color-chart-axis)", fontSize: 14 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={64}
                />
                <YAxis
                  tickFormatter={(value) => number(props.locale, value)}
                  tick={{ fill: "var(--sys-color-chart-axis)", fontSize: 14 }}
                  width={44}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, key) => [
                    number(props.locale, Number(value)),
                    labels[String(key)] || String(key),
                  ]}
                />
                {series.map((key) => (
                  <Area
                    key={key}
                    dataKey={key}
                    stroke={colors[key]}
                    fill={colors[key]}
                    fillOpacity={0.16}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="charts-donut-and-measured-progress">
              {t(
                "Donut and measured progress",
                "رسم حلقي وتقدم مقاس",
                "Anneau et progression mesurée",
              )}
            </span>
          }
        >
          <div
            className="component-chart"
            role="img"
            aria-label={`${t("Sample degree completion", "اكتمال الدرجة التجريبي", "Progression du diplôme exemple")}: ${number(props.locale, progress)}%`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={96}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                >
                  {pieData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={`var(--sys-color-chart-${index + 1})`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) =>
                    `${number(props.locale, Number(value))}%`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Field
            label={`${t("Sample completed credits", "الساعات المكتملة التجريبية", "Crédits acquis exemples")}: ${number(props.locale, progress)} / ${number(props.locale, 100)}`}
          >
            <input
              className="component-range"
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(+event.target.value)}
            />
          </Field>
          <progress
            className="component-progress"
            value={progress}
            max={100}
            aria-label={t(
              "Degree completion",
              "اكتمال الدرجة",
              "Progression du diplôme",
            )}
          />
          <Badge tone="info">
            {number(props.locale, progress)}%{" "}
            {t("complete", "مكتمل", "terminé")}
          </Badge>
        </Panel>
      </div>
      <Panel
        title={
          <span data-specimen="charts-accessible-data-table">
            {t(
              "Accessible data table",
              "جدول بيانات متاح",
              "Tableau de données accessible",
            )}
          </span>
        }
      >
        <Button
          variant="secondary"
          aria-expanded={table}
          onClick={() => setTable(!table)}
        >
          {table
            ? t("Hide data table", "إخفاء جدول البيانات", "Masquer le tableau")
            : t("Show data table", "عرض جدول البيانات", "Afficher le tableau")}
        </Button>
        {table && (
          <div className="component-table-scroll">
            <table className="sample-table">
              <caption>
                {t(
                  "Sample enrollment figures and completion totals",
                  "أرقام القيد التجريبية وإجمالي الإكمال",
                  "Inscriptions exemples et totaux des cours terminés",
                )}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t("Term", "الفصل", "Semestre")}</th>
                  {series.map((key) => (
                    <th key={key} scope="col">
                      {labels[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map((item) => (
                  <tr key={item.term}>
                    <th scope="row">{item.term}</th>
                    {series.map((key) => (
                      <td key={key}>
                        {number(
                          props.locale,
                          item[key as "enrolled" | "completed"],
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              {t(
                "Degree completion",
                "اكتمال الدرجة",
                "Progression du diplôme",
              )}
              : {number(props.locale, progress)} / {number(props.locale, 100)}
            </p>
          </div>
        )}
      </Panel>
    </ComponentFrame>
  );
}
