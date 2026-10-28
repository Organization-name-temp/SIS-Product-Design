import { useEffect, useRef, useState } from "react";
import { Button, Dialog, Drawer } from "sis-react";
import { DashboardCharts, DashboardMetrics } from "./Dashboard";
import { AssistantPage, CoursesPage, GalleryPage, SettingsPage } from "./Pages";
import { RegistrationDialog, StudentTable } from "./Students";
import {
  downloadStudents,
  defaultSettings,
  initialStudents,
  windowStatus,
  pageNames,
  readSaved,
  saveLocal,
  type Page,
  type Student,
} from "./data";
import { Icon, type IconName } from "./Icon";

type Appearance = {
  theme: "light" | "dark" | "system";
  direction: "ltr" | "rtl";
  density: "comfortable" | "compact";
};
const defaultAppearance: Appearance = {
  theme: "light",
  direction: "ltr",
  density: "comfortable",
};
const descriptions: Record<Page, string> = {
  overview: "A clear view of your campus, all in one place.",
  students: "Every student, every registration, one workspace.",
  courses: "Explore the semester. Find the right course and an open seat.",
  assistant: "A helping hand for your everyday registration questions.",
  settings: "Manage the details that keep your institution moving.",
  gallery: "The building blocks behind a consistent campus experience.",
};

function currentPage(): Page {
  const hash = window.location.hash.slice(1);
  return Object.hasOwn(pageNames, hash) ? (hash as Page) : "overview";
}

export default function App() {
  const [page, setPage] = useState<Page>(currentPage);
  const [students, setStudents] = useState(() =>
    readSaved("sis.showcase.students", initialStudents),
  );
  const [appearance, setAppearance] = useState(() => {
    const saved = readSaved("sis.showcase.appearance", defaultAppearance);
    const params = new URLSearchParams(window.location.search);
    return {
      theme: params.get("theme") || saved.theme,
      direction: params.get("dir") || saved.direction,
      density: params.get("density") || saved.density,
    } as Appearance;
  });
  const [settings, setSettings] = useState(() =>
    readSaved("sis.showcase.settings", defaultSettings),
  );
  const [query, setQuery] = useState("");
  const [workspaceQuery, setWorkspaceQuery] = useState("");
  const [status, setStatus] = useState("All students");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = appearance.theme;
    root.dataset.density = appearance.density;
    root.dir = appearance.direction;
    root.lang = "en";
    saveLocal("sis.showcase.appearance", appearance);
  }, [appearance]);
  useEffect(() => {
    function onHash() {
      setPage(currentPage());
    }
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(noticeTimer.current);
    };
  }, []);
  useEffect(() => {
    document.title = `${pageNames[page]} · SIS Registrar`;
  }, [page]);

  function notify(message: string) {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 6000);
  }
  function navigate(next: Page) {
    setPage(next);
    setMobileOpen(false);
  }
  const closeRegistration = () => setRegistrationOpen(false);
  function createRegistration(student: Student) {
    const next = [student, ...students];
    setStudents(next);
    const saved = saveLocal("sis.showcase.students", next);
    setQuery("");
    setStatus("All students");
    setPage("students");
    window.location.hash = "students";
    setRegistrationOpen(false);
    notify(
      `Registration created for ${student.name}${saved ? "" : ". Device storage is unavailable; this record lasts for this session."}`,
    );
  }
  function navigation() {
    return (
      <>
        <div className="sis-university">
          <span className="sis-university-mark">
            <Icon name="cap" />
          </span>
          <div>
            <strong>E-JUST</strong>
            <span>University workspace</span>
          </div>
          <Icon name="shield" />
        </div>
        <div className="sis-nav-label">WORKSPACE</div>
        <nav aria-label="Workspace">
          {(["overview", "students", "courses", "assistant"] as Page[]).map(
            (item) => (
              <a
                href={`#${item}`}
                key={item}
                aria-current={page === item ? "page" : undefined}
                onClick={() => navigate(item)}
              >
                <Icon name={item as IconName} />
                <span>{pageNames[item]}</span>
                {item === "students" && (
                  <span className="sis-nav-count">{students.length}</span>
                )}
                {item === "assistant" && (
                  <span className="sis-nav-new">NEW</span>
                )}
              </a>
            ),
          )}
        </nav>
        <div className="sis-nav-label sis-manage-label">MANAGE</div>
        <nav aria-label="Manage">
          {(["settings", "gallery"] as Page[]).map((item) => (
            <a
              href={`#${item}`}
              key={item}
              aria-current={page === item ? "page" : undefined}
              onClick={() => navigate(item)}
            >
              <Icon name={item as IconName} />
              <span>{pageNames[item]}</span>
            </a>
          ))}
        </nav>
        <div className="sis-sidebar-bottom">
          <div className="sis-semester-card">
            <div>
              <Icon name="calendar" />
              <strong>Fall semester 2026</strong>
            </div>
            <p>Academic year 2026 / 2027</p>
            <span>
              <i />
              {windowStatus(settings)}
            </span>
          </div>
          <div className="sis-sidebar-help">
            <Icon name="help" />
            <span>Local prototype · Sample data</span>
          </div>
          <button
            className="sis-profile"
            onClick={() => {
              navigate("settings");
              window.location.hash = "settings";
            }}
          >
            <span className="sis-profile-avatar">AH</span>
            <span>
              <strong>Adham Haitham</strong>
              <small>Workspace administrator</small>
            </span>
            <Icon name="settings" />
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="sis-workspace">
      <a
        className="sis-skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          contentRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="sis-sidebar" aria-label="Application navigation">
        <a
          className="sis-brand"
          href="#overview"
          onClick={() => navigate("overview")}
        >
          <span className="sis-brand-symbol">
            <span />
            <span />
            <span />
            <span />
          </span>
          <strong>
            sis<span>campus, connected.</span>
          </strong>
        </a>
        {navigation()}
      </aside>
      <div className="sis-workspace-body">
        <header className="sis-topbar">
          <button
            className="sis-icon-button sis-mobile-toggle"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="sis-topbar-breadcrumb">
            <span>Workspace</span>
            <Icon name="chevron" />
            <strong>{pageNames[page]}</strong>
          </div>
          <form
            className="sis-workspace-search"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(workspaceQuery);
              setStatus("All students");
              navigate("students");
              window.location.hash = "students";
            }}
          >
            <Icon name="search" />
            <input
              ref={searchRef}
              type="search"
              aria-label="Search workspace"
              placeholder="Search students…"
              value={workspaceQuery}
              onChange={(event) => setWorkspaceQuery(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </form>
          <div className="sis-topbar-tools">
            <details className="sis-appearance">
              <summary aria-label="Appearance controls">
                <Icon name="settings" />
                <span>Appearance</span>
              </summary>
              <div className="sis-appearance-popover">
                <h2>Make it yours</h2>
                <label>
                  Theme
                  <select
                    aria-label="Theme"
                    value={appearance.theme}
                    onChange={(event) =>
                      setAppearance({
                        ...appearance,
                        theme: event.target.value as Appearance["theme"],
                      })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </label>
                <label>
                  Direction
                  <select
                    aria-label="Direction"
                    value={appearance.direction}
                    onChange={(event) =>
                      setAppearance({
                        ...appearance,
                        direction: event.target
                          .value as Appearance["direction"],
                      })
                    }
                  >
                    <option value="ltr">Left to right</option>
                    <option value="rtl">Right to left</option>
                  </select>
                </label>
                <label>
                  Density
                  <select
                    aria-label="Density"
                    value={appearance.density}
                    onChange={(event) =>
                      setAppearance({
                        ...appearance,
                        density: event.target.value as Appearance["density"],
                      })
                    }
                  >
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                  </select>
                </label>
                <p>
                  Direction changes the layout. This preview uses English
                  content.
                </p>
              </div>
            </details>
            <button
              className="sis-icon-button sis-notification-button"
              aria-label="View notifications"
              onClick={() => setNotificationsOpen(true)}
            >
              <Icon name="bell" />
              <span />
            </button>
            <span className="sis-topbar-avatar" aria-label="Adham Haitham">
              AH
            </span>
          </div>
        </header>
        <main
          className="sis-main"
          id="main-content"
          ref={contentRef}
          tabIndex={-1}
        >
          <div className="sis-page-heading">
            <div>
              <h1>
                {page === "overview"
                  ? "Registration overview"
                  : pageNames[page]}
              </h1>
              <p>{descriptions[page]}</p>
            </div>
            <div className="sis-page-actions">
              {page === "overview" || page === "students" ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      downloadStudents(students);
                      notify(`Exported ${students.length} student records`);
                    }}
                  >
                    <Icon name="export" />
                    Export report
                  </Button>
                  <Button onClick={() => setRegistrationOpen(true)}>
                    <Icon name="plus" />
                    New registration
                  </Button>
                </>
              ) : (
                <span className="sis-term-label">
                  <Icon name="calendar" />
                  Fall 2026
                </span>
              )}
            </div>
          </div>
          {page === "overview" && (
            <>
              <div className="sis-overview-context">
                <span>
                  <Icon name="calendar" />
                  Fall semester 2026
                </span>
                <span>
                  <i />
                  {windowStatus(settings)}
                  <span className="sis-context-divider">·</span>October 28, 2026
                </span>
              </div>
              <DashboardMetrics />
              <DashboardCharts
                closes={settings.closes}
                reviewHolds={() => {
                  setStatus("On hold");
                  navigate("students");
                  window.location.hash = "students";
                }}
                openSettings={() => {
                  navigate("settings");
                  window.location.hash = "settings";
                }}
              />
            </>
          )}
          {(page === "overview" || page === "students") && (
            <StudentTable
              key={`${page}-${status}`}
              students={students}
              query={query}
              setQuery={setQuery}
              initialStatus={status}
              creditLimit={Number(settings.credits)}
              notify={notify}
            />
          )}
          {page === "courses" && <CoursesPage />}
          {page === "settings" && (
            <SettingsPage notify={notify} onSave={setSettings} />
          )}
          {page === "assistant" && <AssistantPage students={students} />}
          {page === "gallery" && <GalleryPage notify={notify} />}
          <footer className="sis-workspace-footer">
            <span>SIS · Student Information System</span>
            <span>
              Institution metrics use sample data. Local records are stored on
              this device.
            </span>
          </footer>
        </main>
      </div>
      <div className="sis-toast-region" role="status" aria-live="polite">
        {notice && (
          <div className="sis-workspace-toast">
            <Icon name="check" />
            <span>{notice}</span>
            <button
              className="sis-icon-button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
      </div>
      <RegistrationDialog
        creditLimit={Number(settings.credits)}
        open={registrationOpen}
        onClose={closeRegistration}
        onCreate={createRegistration}
      />
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="SIS workspace"
        side="inline-start"
      >
        <div className="sis-mobile-navigation">{navigation()}</div>
      </Drawer>
      <Dialog
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Workspace notifications"
        footer={
          <Button
            variant="secondary"
            onClick={() => setNotificationsOpen(false)}
          >
            Close notifications
          </Button>
        }
      >
        <div className="sis-notifications">
          <span className="sis-eyebrow">Sample activity</span>
          <div>
            <Icon name="calendar" />
            <span>
              <strong>
                Registration closes{" "}
                {new Date(`${settings.closes}T00:00:00Z`).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", timeZone: "UTC" },
                )}
              </strong>
              <p>Review pending registrations before the window closes.</p>
            </span>
          </div>
          <div>
            <Icon name="shield" />
            <span>
              <strong>186 approvals need attention</strong>
              <p>
                Open Student registrations to review the local sample records.
              </p>
            </span>
          </div>
          <Button
            onClick={() => {
              setNotificationsOpen(false);
              setStatus("Needs review");
              navigate("students");
              window.location.hash = "students";
            }}
          >
            Review student records
            <Icon name="arrow" />
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
