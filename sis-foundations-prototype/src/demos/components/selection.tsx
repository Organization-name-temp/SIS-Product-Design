import { useState } from "react";
import {
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Select,
  Label,
  Button as AriaButton,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  ComboBox,
  Input,
} from "react-aria-components";
import { Check, ChevronDown, Minus, X } from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Field,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, flags, useLabels } from "./common";

export function SelectionDemo(props: DemoProps) {
  const t = useLabels(props);
  const f = flags(props);
  const [selected, setSelected] = useState(["transcript"]);
  const [delivery, setDelivery] = useState("email");
  const [enabled, setEnabled] = useState(true);
  const [department, setDepartment] = useState("cse");
  const [course, setCourse] = useState<string | null>("cse201");
  const [multi, setMulti] = useState(["ai"]);
  const [view, setView] = useState("week");
  const [credit, setCredit] = useState(18);
  const [range, setRange] = useState([9, 17]);
  const options = [
    {
      id: "transcript",
      label: t("Transcript", "كشف الدرجات", "Relevé de notes"),
    },
    {
      id: "certificate",
      label: t(
        "Enrollment certificate",
        "إفادة القيد",
        "Attestation d’inscription",
      ),
    },
    {
      id: "schedule",
      label: t("Course schedule", "جدول المقررات", "Emploi du temps"),
    },
  ];
  const courses = [
    {
      id: "cse201",
      label: t(
        "CSE-201 · Data structures",
        "CSE-201 · هياكل البيانات",
        "CSE-201 · Structures de données",
      ),
    },
    {
      id: "mat204",
      label: t(
        "MAT-204 · Linear algebra",
        "MAT-204 · الجبر الخطي",
        "MAT-204 · Algèbre linéaire",
      ),
    },
    {
      id: "eng101",
      label: t(
        "ENG-101 · Academic writing",
        "ENG-101 · الكتابة الأكاديمية",
        "ENG-101 · Rédaction universitaire",
      ),
    },
  ];
  const skills = [
    {
      id: "ai",
      label: t(
        "Artificial intelligence",
        "الذكاء الاصطناعي",
        "Intelligence artificielle",
      ),
    },
    { id: "robotics", label: t("Robotics", "الروبوتات", "Robotique") },
    {
      id: "energy",
      label: t("Energy systems", "أنظمة الطاقة", "Systèmes énergétiques"),
    },
  ];
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="selection-checkboxes-and-indeterminate-state">
              {t(
                "Checkboxes and indeterminate state",
                "مربعات الاختيار والحالة الجزئية",
                "Cases à cocher et état partiel",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <Checkbox
              className="component-checkbox"
              isSelected={selected.length === options.length}
              isIndeterminate={
                selected.length > 0 && selected.length < options.length
              }
              onChange={(value) =>
                setSelected(value ? options.map((item) => item.id) : [])
              }
            >
              <span className="component-check-indicator">
                {selected.length === options.length ? (
                  <Check size={16} />
                ) : selected.length ? (
                  <Minus size={16} />
                ) : null}
              </span>
              {t("All documents", "جميع المستندات", "Tous les documents")}
            </Checkbox>
            {options.map((item) => (
              <Checkbox
                key={item.id}
                className="component-checkbox"
                isSelected={selected.includes(item.id)}
                onChange={(value) =>
                  setSelected(
                    value
                      ? [...selected, item.id]
                      : selected.filter((id) => id !== item.id),
                  )
                }
              >
                <span className="component-check-indicator">
                  {selected.includes(item.id) && <Check size={16} />}
                </span>
                {item.label}
              </Checkbox>
            ))}
            <Badge>
              {number(props.locale, selected.length)}{" "}
              {t("selected", "محدد", "sélectionnés")}
            </Badge>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="selection-radio-and-switch">
              {t(
                "Radio and switch",
                "اختيار واحد ومفتاح تبديل",
                "Boutons radio et interrupteur",
              )}
            </span>
          }
        >
          <RadioGroup
            className="demo-stack"
            value={delivery}
            onChange={setDelivery}
            isInvalid={f.invalid}
          >
            <Label>
              {t("Delivery method", "طريقة التسليم", "Mode de réception")}
            </Label>
            {[
              [
                "email",
                t(
                  "University email",
                  "البريد الجامعي",
                  "Courriel universitaire",
                ),
              ],
              [
                "office",
                t("Campus office", "مكتب الجامعة", "Bureau du campus"),
              ],
              [
                "post",
                t("Postal delivery", "البريد العادي", "Courrier postal"),
              ],
            ].map(([id, label]) => (
              <Radio className="component-radio" value={id} key={id}>
                <span className="component-radio-indicator" />
                {label}
              </Radio>
            ))}
          </RadioGroup>
          <Switch
            className="component-switch"
            isSelected={enabled}
            onChange={setEnabled}
          >
            <span className="component-switch-track">
              <span />
            </span>
            {t(
              "Email notifications",
              "إشعارات البريد",
              "Notifications par courriel",
            )}
          </Switch>
          <output className="muted">
            {enabled
              ? t(
                  "Notifications enabled",
                  "الإشعارات مفعلة",
                  "Notifications activées",
                )
              : t(
                  "Notifications disabled",
                  "الإشعارات معطلة",
                  "Notifications désactivées",
                )}
          </output>
        </Panel>
        <Panel
          title={
            <span data-specimen="selection-select-and-searchable-combo-box">
              {t(
                "Select and searchable combo box",
                "قائمة واختيار قابل للبحث",
                "Sélection et liste de recherche",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <Select
              className="field"
              selectedKey={department}
              onSelectionChange={(key) => setDepartment(String(key))}
              isDisabled={f.disabled}
            >
              <Label className="field-label">
                {t("Department", "القسم", "Département")}
              </Label>
              <AriaButton className="input component-select-trigger">
                <SelectValue />
                <ChevronDown size={20} />
              </AriaButton>
              <Popover className="component-popover">
                <ListBox className="component-listbox">
                  <ListBoxItem className="component-option" id="cse">
                    {t(
                      "Computer Engineering",
                      "هندسة الحاسبات",
                      "Génie informatique",
                    )}
                  </ListBoxItem>
                  <ListBoxItem className="component-option" id="mat">
                    {t("Mathematics", "الرياضيات", "Mathématiques")}
                  </ListBoxItem>
                  <ListBoxItem className="component-option" id="energy">
                    {t(
                      "Energy Engineering",
                      "هندسة الطاقة",
                      "Génie énergétique",
                    )}
                  </ListBoxItem>
                </ListBox>
              </Popover>
            </Select>
            <ComboBox
              className="field"
              selectedKey={course}
              onSelectionChange={(key) =>
                setCourse(key === null ? null : String(key))
              }
              defaultItems={courses}
              isDisabled={f.disabled}
            >
              <Label className="field-label">
                {t("Find a course", "البحث عن مقرر", "Trouver un cours")}
              </Label>
              <div className="component-input-group">
                <Input className="input" />
                <AriaButton
                  className="button button-ghost"
                  aria-label={t(
                    "Show courses",
                    "عرض المقررات",
                    "Afficher les cours",
                  )}
                >
                  <ChevronDown size={20} />
                </AriaButton>
              </div>
              <Popover className="component-popover">
                <ListBox<{
                  id: string;
                  label: string;
                }> className="component-listbox">
                  {(item) => (
                    <ListBoxItem
                      className="component-option"
                      id={item.id}
                      textValue={item.label}
                    >
                      {item.label}
                    </ListBoxItem>
                  )}
                </ListBox>
              </Popover>
            </ComboBox>
            <div className="result-box">
              <bdi>{department}</bdi> ·{" "}
              <bdi>
                {course ||
                  t(
                    "No course selected",
                    "لم يُحدد مقرر",
                    "Aucun cours sélectionné",
                  )}
              </bdi>
            </div>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="selection-multiple-selection">
              {t("Multiple selection", "اختيار متعدد", "Sélection multiple")}
            </span>
          }
        >
          <div className="toolbar">
            {skills
              .filter((item) => multi.includes(item.id))
              .map((item) => (
                <span className="component-tag" key={item.id}>
                  {item.label}
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setMulti(multi.filter((id) => id !== item.id))
                    }
                    aria-label={`${t("Remove", "حذف", "Supprimer")} ${item.label}`}
                  >
                    <X size={16} />
                  </Button>
                </span>
              ))}
          </div>
          <ListBox
            className="component-listbox component-listbox-bordered"
            aria-label={t(
              "Research interests",
              "اهتمامات البحث",
              "Domaines de recherche",
            )}
            selectionMode="multiple"
            selectionBehavior="toggle"
            selectedKeys={new Set(multi)}
            onSelectionChange={(keys) =>
              setMulti(
                keys === "all"
                  ? skills.map((item) => item.id)
                  : [...keys].map(String),
              )
            }
          >
            {skills.map((item) => (
              <ListBoxItem
                className="component-option"
                id={item.id}
                key={item.id}
                textValue={item.label}
              >
                <span>{item.label}</span>
                {multi.includes(item.id) && <Check size={20} />}
              </ListBoxItem>
            ))}
          </ListBox>
          <p className="muted">
            {t(
              "Use arrow keys and Space to select several interests.",
              "استخدم الأسهم ومفتاح المسافة لاختيار عدة اهتمامات.",
              "Utilisez les flèches et Espace pour choisir plusieurs domaines.",
            )}
          </p>
        </Panel>
      </div>
      <Panel
        title={
          <span data-specimen="selection-segmented-control-and-ranges">
            {t(
              "Segmented control and ranges",
              "تحكم مقسم ونطاقات",
              "Commande segmentée et plages",
            )}
          </span>
        }
      >
        <div className="demo-stack">
          <div
            className="component-segmented"
            role="group"
            aria-label={t("Calendar view", "عرض التقويم", "Vue du calendrier")}
          >
            {[
              ["day", t("Day", "يوم", "Jour")],
              ["week", t("Week", "أسبوع", "Semaine")],
              ["month", t("Month", "شهر", "Mois")],
            ].map(([id, label]) => (
              <Button
                key={id}
                variant={view === id ? "primary" : "ghost"}
                aria-pressed={view === id}
                onClick={() => setView(id)}
              >
                {label}
              </Button>
            ))}
          </div>
          <Field
            label={`${t("Study load", "العبء الدراسي", "Charge de cours")}: ${number(props.locale, credit)} ${t("credits", "ساعة", "crédits")}`}
          >
            <input
              className="component-range"
              type="range"
              min={6}
              max={24}
              step={1}
              value={credit}
              onChange={(event) => setCredit(+event.target.value)}
            />
          </Field>
          <div className="demo-grid">
            <Field
              label={`${t("Earliest class", "أبكر محاضرة", "Premier cours")}: ${number(props.locale, range[0])}:00`}
            >
              <input
                className="component-range"
                type="range"
                min={7}
                max={20}
                value={range[0]}
                onChange={(event) =>
                  setRange([Math.min(+event.target.value, range[1]), range[1]])
                }
              />
            </Field>
            <Field
              label={`${t("Latest class", "آخر محاضرة", "Dernier cours")}: ${number(props.locale, range[1])}:00`}
            >
              <input
                className="component-range"
                type="range"
                min={7}
                max={20}
                value={range[1]}
                onChange={(event) =>
                  setRange([range[0], Math.max(+event.target.value, range[0])])
                }
              />
            </Field>
          </div>
          <output className="result-box">
            {t("Current view", "العرض الحالي", "Vue actuelle")}: {view} ·{" "}
            {number(props.locale, range[0])}:00–{number(props.locale, range[1])}
            :00
          </output>
        </div>
      </Panel>
    </ComponentFrame>
  );
}
