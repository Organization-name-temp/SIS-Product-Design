import "sis-tokens/css";
import "sis-react/styles.css";
import { useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import {
  Alert,
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  Checkbox,
  DataTable,
  DateField,
  Dialog,
  Drawer,
  KpiCard,
  ChatPanel,
  type ChatEntry,
  FilterBar,
  LineChart,
  NumberField,
  PageHeader,
  Progress,
  SettingsForm,
  Switch,
  Tabs,
  TextField,
} from "sis-react";

const students = [
  { id: "s1", name: "Omar Khaled", year: 2, gpa: 3.4, status: "Registered" },
  { id: "s2", name: "Mariam Adel", year: 3, gpa: 3.8, status: "On hold" },
  { id: "s3", name: "Youssef Nabil", year: 1, gpa: 2.9, status: "Registered" },
  { id: "s4", name: "Salma Hassan", year: 4, gpa: 3.9, status: "Registered" },
  { id: "s5", name: "Karim Fouad", year: 2, gpa: 3.1, status: "Warning" },
];

const enrollment = [
  { label: "2018", value: 9800 },
  { label: "2019", value: 10400 },
  { label: "2020", value: 8100 },
  { label: "2021", value: 11600 },
  { label: "2022", value: 12480 },
];

const layout: CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: 24,
  display: "grid",
  gap: 24,
  alignContent: "start",
  minHeight: "100vh",
  fontFamily: "var(--sys-font-family-ui)",
  background: "var(--sys-color-bg-canvas)",
  color: "var(--sys-color-text-primary)",
};

function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Registration dashboard"
        description="Term 2026 fall · E-JUST"
        breadcrumbs={[{ label: "Home", href: "#" }, { label: "Registration" }]}
        actions={
          <>
            <Button variant="secondary">Export</Button>
            <Button>New registration</Button>
          </>
        }
      />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <KpiCard label="Enrolled" value="12,480" delta="+4.2%" deltaDirection="up" />
        <KpiCard label="Attendance" value="94.1%" delta="+0.8%" deltaDirection="up" />
        <KpiCard label="Dropped" value="312" delta="-1.1%" deltaDirection="down" />
        <KpiCard label="Mean GPA" value="3.21" />
      </div>
      <FilterBar searchPlaceholder="Search students">
        <Button variant="secondary">Filters</Button>
      </FilterBar>
      <DataTable
        columns={[
          { key: "name", header: "Student" },
          { key: "year", header: "Year", sortable: true },
          { key: "gpa", header: "GPA", sortable: true },
          { key: "status", header: "Status" },
        ]}
        rows={students}
        getRowId={(row) => row.id}
        selectable
      />
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <Card title="Enrollment by year">
          <BarChart data={enrollment} ariaLabel="Enrollment by year" />
        </Card>
        <Card title="Enrollment trend">
          <LineChart data={enrollment} ariaLabel="Enrollment trend" />
        </Card>
      </div>
    </>
  );
}

function AdminPage() {
  return (
    <>
      <PageHeader title="Institution settings" description="Applies to every registration form." />
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <SettingsForm title="Registration window" onSubmit={() => {}}>
          <DateField label="Opens" defaultValue="2026-09-01" />
          <DateField label="Closes" defaultValue="2026-10-12" />
          <NumberField label="Maximum credit hours" hint="1 to 21" defaultValue="21" />
        </SettingsForm>
        <Card title="Profile">
          <div style={{ display: "grid", gap: 12 }}>
            <TextField label="Display name" defaultValue="Registrar office" />
            <Checkbox label="Email me schedule changes" defaultChecked />
            <Switch label="Dark mode" />
            <Switch label="Compact density" />
          </div>
        </Card>
        <Card title="Term progress">
          <div style={{ display: "grid", gap: 12 }}>
            <Progress value={62} label="Term progress" />
            <Alert tone="warning" title="Hold policy">Students with holds cannot enroll.</Alert>
            <Alert tone="success" title="Saved">Settings publish instantly.</Alert>
          </div>
        </Card>
      </div>
    </>
  );
}

function AssistantPage() {
  const [messages, setMessages] = useState<ChatEntry[]>([
    { id: "m1", role: "user", content: "Which sections of MATH 201 still have seats?" },
    {
      id: "m2",
      role: "assistant",
      content: "Sections 4 and 7 have seats left. Section 4 meets Sunday and Tuesday at 10:00.",
      citations: [
        { label: "Section 4", href: "#section-4" },
        { label: "Section 7", href: "#section-7" },
      ],
    },
  ]);
  const [streaming, setStreaming] = useState(false);

  const send = (message: string) => {
    const userEntry: ChatEntry = { id: `u${Date.now()}`, role: "user", content: message };
    setMessages((current) => [...current, userEntry]);
    setStreaming(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `a${Date.now()}`,
          role: "assistant",
          content: `Here is what the catalog says about "${message}". Seats update in real time, so confirm on the registration page.`,
          citations: [{ label: "Course catalog", href: "#catalog" }],
        },
      ]);
      setStreaming(false);
    }, 900);
  };

  return (
    <>
      <PageHeader title="Registrar assistant" description="Answers cite the catalog. It never enrolls for you." />
      <ChatPanel messages={messages} onSend={send} streaming={streaming} ariaLabel="Registrar assistant" />
    </>
  );
}

function GalleryPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Component gallery" description="Every family on the Soft-elevation face." />
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge tone="success">Registered</Badge>
          <Badge tone="warning">On hold</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="info">Pending</Badge>
          <Badge>Neutral</Badge>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar name="Salma Hassan" size={40} />
          <Avatar name="Omar Khaled" />
          <Checkbox label="Email me" defaultChecked />
          <Switch label="Dark mode" defaultChecked />
          <Progress value={62} label="Term progress" />
        </div>
        <TextField label="University email" hint="Use your institutional address." />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setOpen(true)}>Open dialog</Button>
          <Button variant="ghost" onClick={() => setOpen(true)}>Open as drawer</Button>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)} title="Confirm registration">
          You are registering for MATH 201, section 4.
        </Dialog>
      </div>
    </>
  );
}

function ThemeControls() {
  const root = document.documentElement;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <Badge>SIS showcase</Badge>
      <select
        aria-label="Theme"
        defaultValue="light"
        style={{ minHeight: 36, borderRadius: 8, border: "1px solid var(--sys-color-border-default)", background: "var(--sys-color-bg-surface)", color: "var(--sys-color-text-primary)", font: "inherit", fontSize: 14 }}
        onChange={(event) => root.setAttribute("data-theme", event.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <select
        aria-label="Direction"
        defaultValue="ltr"
        style={{ minHeight: 36, borderRadius: 8, border: "1px solid var(--sys-color-border-default)", background: "var(--sys-color-bg-surface)", color: "var(--sys-color-text-primary)", font: "inherit", fontSize: 14 }}
        onChange={(event) => {
          root.setAttribute("dir", event.target.value);
          root.setAttribute("lang", event.target.value === "rtl" ? "ar" : "en");
        }}
      >
        <option value="ltr">LTR (EN)</option>
        <option value="rtl">RTL (AR)</option>
      </select>
      <Switch
        label="Compact"
        onChange={(checked) => root.setAttribute("data-density", checked ? "compact" : "comfortable")}
      />
    </div>
  );
}

export default function App() {
  return (
    <div style={layout}>
      <ThemeControls />
      <Tabs
        label="Showcase pages"
        tabs={[
          { id: "dashboard", label: "Dashboard", content: <DashboardPage /> },
          { id: "admin", label: "Admin", content: <AdminPage /> },
          { id: "assistant", label: "Assistant", content: <AssistantPage /> },
          { id: "gallery", label: "Gallery", content: <GalleryPage /> },
        ]}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
