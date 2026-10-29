import { useState } from "react";
import { Button } from "../../src/Button";
import { Dialog } from "../../src/Dialog";
import { Drawer } from "../../src/Drawer";
import { Toast } from "../../src/Toast";

export function OverlaysSection() {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(true);
  return (
    <div className="fixture-stack">
      <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
      <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
      <Button variant="ghost" onClick={() => setToastOpen(true)}>Show toast</Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm registration"
        footer={
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </div>
        }
      >
        You are registering for MATH 201, section 4. This action takes effect immediately.
      </Dialog>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Course details">
        MATH 201 · 3 credit hours · Dr. Salma Hassan
      </Drawer>
      {toastOpen ? <Toast message="Schedule saved." onDismiss={() => setToastOpen(false)} /> : null}
    </div>
  );
}
