import type { CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../src/Button";
import { TextField } from "../src/TextField";
import { Badge } from "../src/Badge";
import { Checkbox } from "../src/Checkbox";
import { Radio } from "../src/Radio";
import { Switch } from "../src/Switch";
import { Dialog } from "../src/Dialog";

const params = new URLSearchParams(window.location.search);
const theme = params.get("theme") ?? "light";
const dir = params.get("dir") ?? "ltr";
const density = params.get("density") ?? "comfortable";
document.documentElement.setAttribute("data-theme", theme);
document.documentElement.setAttribute("dir", dir);
document.documentElement.setAttribute("data-density", density);
document.documentElement.setAttribute("lang", dir === "rtl" ? "ar" : "en");

const grid: CSSProperties = { display: "grid", gap: 16, padding: 24, maxWidth: 420 };

function Fixture() {
  return (
    <div style={grid}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button>Enroll student</Button>
        <Button variant="secondary">Save draft</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Drop course</Button>
        <Button loading>Enroll student</Button>
        <Button disabled>Enroll student</Button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge tone="success">Registered</Badge>
        <Badge tone="warning">On hold</Badge>
        <Badge tone="danger">Failed</Badge>
        <Badge tone="info">Pending</Badge>
        <Badge>Neutral</Badge>
      </div>
      <TextField label={dir === "rtl" ? "البريد الجامعي" : "University email"} placeholder="name@ejust.edu.eg" hint="Use your institutional address." />
      <TextField label="Student ID" defaultValue="20" error="The student ID has eight digits." />
      <Checkbox label="Email me schedule changes" defaultChecked />
      <Checkbox label="Disable notifications" />
      <Radio name="year" label="First year" value="1" defaultChecked />
      <Radio name="year" label="Second year" value="2" />
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Reduced motion" />
      <Dialog open onClose={() => {}} title={dir === "rtl" ? "تأكيد التسجيل" : "Confirm registration"} footer={<div style={{ display: "flex", gap: 8 }}><Button variant="ghost">Cancel</Button><Button>Confirm</Button></div>}>
        You are registering for MATH 201, section 4.
      </Dialog>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
