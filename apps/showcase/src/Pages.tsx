import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  ChatPanel,
  Checkbox,
  Dialog,
  Progress,
  Switch,
  TextField,
  type ChatEntry,
} from "sis-react";
import {
  courses,
  defaultSettings,
  readSaved,
  saveLocal,
  type InstitutionSettings,
  type Student,
} from "./data";
import { Icon } from "./Icon";

export function CoursesPage() {
  const [query, setQuery] = useState("");
  const [available, setAvailable] = useState(false);
  const [detail, setDetail] = useState<(typeof courses)[number] | null>(null);
  const filtered = courses.filter(
    (course) =>
      `${course.code} ${course.title} ${course.department}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!available || course.enrolled < course.capacity),
  );
  return (
    <>
      <div className="sis-panel sis-catalog-toolbar">
        <div className="sis-search">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Search courses"
            placeholder="Search courses, codes, or departments…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Checkbox
          label="Available seats only"
          checked={available}
          onChange={setAvailable}
        />
        <span>{filtered.length} courses</span>
      </div>
      <div className="sis-course-grid">
        {filtered.map((course) => (
          <article className="sis-panel sis-course-card" key={course.code}>
            <div className="sis-course-card-top">
              <span className="sis-course-icon">
                <Icon name="courses" />
              </span>
              <Badge
                tone={
                  course.enrolled === course.capacity ? "neutral" : "success"
                }
              >
                {course.enrolled === course.capacity
                  ? "Full"
                  : `${course.capacity - course.enrolled} seats open`}
              </Badge>
            </div>
            <div>
              <span className="sis-eyebrow">
                {course.code} · {course.credits} credit hours
              </span>
              <h2>{course.title}</h2>
              <p>{course.department}</p>
            </div>
            <div className="sis-course-meta">
              <p>
                <Icon name="students" />
                {course.instructor}
              </p>
              <p>
                <Icon name="clock" />
                {course.schedule}
              </p>
            </div>
            <div className="sis-course-capacity">
              <span>Enrollment</span>
              <strong>
                {course.enrolled} / {course.capacity}
              </strong>
              <Progress
                value={(course.enrolled / course.capacity) * 100}
                label={`${course.code} enrollment`}
              />
            </div>
            <Button
              variant="secondary"
              aria-label={`View course ${course.code}`}
              onClick={() => setDetail(course)}
            >
              View course
              <Icon name="arrow" />
            </Button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="sis-empty sis-panel">
          <Icon name="courses" />
          <h2>No courses found</h2>
          <p>Try another course name or show all available courses.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setQuery("");
              setAvailable(false);
            }}
          >
            Reset course filters
          </Button>
        </div>
      )}
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Course details"
        footer={
          <Button variant="secondary" onClick={() => setDetail(null)}>
            Close details
          </Button>
        }
      >
        {detail && (
          <div className="sis-detail">
            <Badge>{detail.code}</Badge>
            <h3>{detail.title}</h3>
            <p>{detail.department}</p>
            <dl>
              <div>
                <dt>Instructor</dt>
                <dd>{detail.instructor}</dd>
              </div>
              <div>
                <dt>Schedule</dt>
                <dd>{detail.schedule}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{detail.room}</dd>
              </div>
              <div>
                <dt>Credit hours</dt>
                <dd>{detail.credits}</dd>
              </div>
              <div>
                <dt>Available seats</dt>
                <dd>{detail.capacity - detail.enrolled}</dd>
              </div>
            </dl>
            <div className="sis-note">
              <Icon name="help" />
              <p>
                Use New registration in the student workspace to create a local
                student record. Course enrollment is a preview.
              </p>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}

export function SettingsPage({
  notify,
  onSave,
}: {
  notify: (message: string) => void;
  onSave: (settings: InstitutionSettings) => void;
}) {
  const [settings, setSettings] = useState(() =>
    readSaved("sis.showcase.settings", defaultSettings),
  );
  const [error, setError] = useState("");
  const update = (key: keyof InstitutionSettings, value: string | boolean) =>
    setSettings((current) => ({ ...current, [key]: value }));
  function submit(event: FormEvent) {
    event.preventDefault();
    if (settings.opens > settings.closes) {
      setError("The closing date must follow the opening date.");
      return;
    }
    setError("");
    onSave(settings);
    notify(
      saveLocal("sis.showcase.settings", settings)
        ? "Institution settings saved on this device"
        : "Settings updated for this session. Device storage is unavailable.",
    );
  }
  return (
    <form className="sis-settings-layout" onSubmit={submit}>
      <div className="sis-settings-sections">
        <section className="sis-panel sis-settings-section">
          <header>
            <span className="sis-course-icon">
              <Icon name="students" />
            </span>
            <div>
              <h2>Office profile</h2>
              <p>Contact details for your registrar team.</p>
            </div>
          </header>
          <div className="sis-form-columns">
            <TextField
              label="Office name"
              value={settings.office}
              required
              onChange={(event) => update("office", event.target.value)}
            />
            <TextField
              label="Contact email"
              type="email"
              value={settings.email}
              required
              onChange={(event) => update("email", event.target.value)}
            />
          </div>
        </section>
        <section className="sis-panel sis-settings-section">
          <header>
            <span className="sis-course-icon">
              <Icon name="calendar" />
            </span>
            <div>
              <h2>Registration window</h2>
              <p>Set the dates and credit limit for Fall 2026.</p>
            </div>
          </header>
          <div className="sis-form-columns">
            <TextField
              label="Opening date"
              type="date"
              value={settings.opens}
              required
              onChange={(event) => update("opens", event.target.value)}
            />
            <TextField
              label="Closing date"
              type="date"
              value={settings.closes}
              min={settings.opens}
              required
              onChange={(event) => update("closes", event.target.value)}
            />
          </div>
          <TextField
            label="Maximum credit hours"
            type="number"
            min={1}
            max={21}
            value={settings.credits}
            required
            hint="Default limit per student for this semester."
            onChange={(event) => update("credits", event.target.value)}
          />
          {error && (
            <Alert tone="danger" title="Check registration dates">
              {error}
            </Alert>
          )}
        </section>
        <section className="sis-panel sis-settings-section">
          <header>
            <span className="sis-course-icon">
              <Icon name="bell" />
            </span>
            <div>
              <h2>Notifications</h2>
              <p>Choose how your office receives updates.</p>
            </div>
          </header>
          <div className="sis-setting-row">
            <div>
              <strong>Registration updates</strong>
              <p>Receive email updates when registration details change.</p>
            </div>
            <Switch
              label="Email registration updates"
              checked={settings.notifications}
              onChange={(checked) => update("notifications", checked)}
            />
          </div>
        </section>
        <div className="sis-form-actions">
          <Button
            variant="secondary"
            onClick={() => {
              setSettings(readSaved("sis.showcase.settings", defaultSettings));
              setError("");
              notify("Unsaved changes discarded");
            }}
          >
            Discard changes
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </div>
      <section className="sis-settings-aside" aria-label="Settings guidance">
        <Icon name="shield" />
        <h2>Your workspace, your rules.</h2>
        <p>
          These settings apply to this prototype on this device. A production
          system requires a connected university service.
        </p>
        <div className="sis-note">
          <p>
            Students with financial holds require review by the finance office
            before enrollment.
          </p>
        </div>
      </section>
    </form>
  );
}

export function AssistantPage({ students }: { students: Student[] }) {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  function send(message: string) {
    if (busy) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: message },
    ]);
    setBusy(true);
    timer.current = window.setTimeout(() => {
      const lower = message.toLowerCase();
      const course = courses.find((item) =>
        lower.includes(item.code.toLowerCase()),
      );
      let content =
        "I can summarize the local student records, registration holds, or course seats. Try ‘Which students are on hold?’ or ‘How many seats are open in MATH 201?’ This is a local demo, with no external AI service.";
      let citations = [{ label: "Student records", href: "#students" }];
      if (course) {
        content = `${course.code} · ${course.title} has ${course.capacity - course.enrolled} available seats out of ${course.capacity}. ${course.instructor} teaches this course. Schedule: ${course.schedule}. This is sample catalog data.`;
        citations = [
          { label: `${course.code} · Course catalog`, href: "#courses" },
        ];
      } else if (/seat|course|section/.test(lower)) {
        content = `Courses with open seats: ${courses
          .filter((item) => item.enrolled < item.capacity)
          .map((item) => `${item.code} (${item.capacity - item.enrolled})`)
          .join(
            ", ",
          )}. CSE 301 is full. These numbers come from the sample catalog.`;
        citations = [{ label: "Course catalog", href: "#courses" }];
      } else if (/hold|review/.test(lower)) {
        const held = students.filter(
          (student) => student.status !== "Registered",
        );
        content = `${held.length} local records need attention: ${held.map((student) => `${student.name} (${student.status.toLowerCase()})`).join(", ")}. Open a student record for the next step. I cannot change a student's status.`;
      } else if (/registration|enroll|student|summary/.test(lower))
        content = `The local dataset contains ${students.length} students: ${students.filter((student) => student.status === "Registered").length} registered, ${students.filter((student) => student.status === "On hold").length} on hold, and ${students.filter((student) => student.status === "Needs review").length} needing review. The overview shows separate institution-level sample metrics.`;
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content, citations },
      ]);
      setBusy(false);
    }, 600);
  }
  return (
    <div
      className="sis-assistant-layout"
      onClick={(event) => {
        const target = event.target;
        const link =
          target instanceof Element
            ? target.closest<HTMLAnchorElement>("a.sis-citation")
            : null;
        if (link?.hash) {
          event.preventDefault();
          window.location.hash = link.hash;
        }
      }}
    >
      <section className="sis-panel sis-assistant-main">
        <div className="sis-assistant-intro">
          <span className="sis-assistant-mark">
            <Icon name="assistant" />
          </span>
          <span className="sis-eyebrow">YOUR REGISTRAR COPILOT</span>
          <h2>A little clarity for a busy day.</h2>
          <p>
            Explore course availability, understand holds, and get a quick
            registration summary.
          </p>
          <div className="sis-prompt-grid">
            {[
              "Which courses still have seats?",
              "Which students are on hold?",
              "Give me a registration summary",
            ].map((prompt) => (
              <button
                type="button"
                key={prompt}
                disabled={busy}
                onClick={() => send(prompt)}
              >
                {prompt}
                <Icon name="arrow" />
              </button>
            ))}
          </div>
        </div>
        <ChatPanel
          messages={messages}
          onSend={send}
          streaming={busy}
          ariaLabel="Registrar assistant"
        />
        {busy && (
          <p role="status" className="sis-assistant-thinking">
            Read the sample records…
          </p>
        )}
        <p className="sis-assistant-disclaimer">
          Local demo · Answers use sample records. Review details before you
          act.
        </p>
      </section>
      <section
        className="sis-panel sis-assistant-context"
        aria-label="Assistant context"
      >
        <Icon name="courses" />
        <h2>Connected context</h2>
        <p>Answers refer to the data in this prototype.</p>
        <div>
          <Icon name="check" />
          <span>
            Fall 2026 course catalog<strong>{courses.length} courses</strong>
          </span>
        </div>
        <div>
          <Icon name="check" />
          <span>
            Student registrations
            <strong>{students.length} local records</strong>
          </span>
        </div>
        <div>
          <Icon name="shield" />
          <span>
            Read-only assistance<strong>You stay in control</strong>
          </span>
        </div>
      </section>
    </div>
  );
}

export { ComponentGallery as GalleryPage } from "./ComponentGallery";
