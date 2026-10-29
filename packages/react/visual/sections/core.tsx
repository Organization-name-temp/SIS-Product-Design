import { useState } from "react";
import { Button } from "../../src/Button";
import { TextField } from "../../src/TextField";
import { Checkbox } from "../../src/Checkbox";
import { Radio } from "../../src/Radio";
import { Switch } from "../../src/Switch";
import { Badge } from "../../src/Badge";
import { Dialog } from "../../src/Dialog";

export function CoreSection() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  return (
    <div className="fixture-stack">
      <div className="fixture-row">
        <Button onClick={() => setResult("Primary action complete")}>
          Primary action
        </Button>
        <Button
          variant="secondary"
          onClick={() => setResult("Secondary action complete")}
        >
          Secondary
        </Button>
        <Button
          variant="ghost"
          onClick={() => setResult("Ghost action complete")}
        >
          Ghost
        </Button>
        <Button
          variant="destructive"
          onClick={() => setResult("Destructive example complete")}
        >
          Destructive
        </Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="fixture-row">
        <Badge>Neutral</Badge>
        <Badge tone="success">Registered</Badge>
        <Badge tone="warning">On hold</Badge>
        <Badge tone="danger">Needs review</Badge>
        <Badge tone="info">Pending</Badge>
      </div>
      <TextField
        label="University email"
        hint="Use your institutional address."
        placeholder="student@ejust.edu.eg"
      />
      <TextField
        label="Student ID"
        error="Enter a valid student ID."
        defaultValue="Invalid ID"
      />
      <TextField label="Read-only field" value="Fall 2026" readOnly />
      <TextField label="Disabled field" disabled defaultValue="Unavailable" />
      <div className="fixture-row">
        <Checkbox label="Email updates" defaultChecked />
        <Checkbox label="Disabled choice" disabled />
        <Switch label="Compact view" defaultChecked />
      </div>
      <fieldset className="fixture-radio">
        <legend>Preferred contact</legend>
        <Radio name="contact" label="Email" value="email" defaultChecked />
        <Radio name="contact" label="Phone" value="phone" />
      </fieldset>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      {result && <p role="status">{result}</p>}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Example dialog"
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <TextField label="Student name" defaultValue="Mariam Adel" />
      </Dialog>
    </div>
  );
}
