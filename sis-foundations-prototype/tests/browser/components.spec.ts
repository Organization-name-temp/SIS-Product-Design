import { test, expect, type Page } from "@playwright/test";

async function open(page: Page, item: string, extra = "") {
  await page.goto(`/?embed=1&item=${item}&theme=light&lang=en${extra}`);
  await expect(page.locator("main")).toBeVisible();
}

test("buttons: actions, toggle, pending, split menu", async ({ page }) => {
  await open(page, "buttons");
  await page.getByRole("button", { name: "Add course", exact: true }).click();
  await expect(page.getByTestId("button-result")).toHaveText(
    "Primary action complete",
  );
  await page.getByRole("button", { name: "Save course", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Save sample", exact: true }).click();
  await expect(page.getByTestId("button-result")).toHaveText(
    "Sample saved locally",
  );
  await page
    .getByRole("button", { name: "Export options", exact: true })
    .click();
  await page.getByRole("button", { name: "PDF", exact: true }).click();
  await expect(page.getByTestId("button-result")).toHaveText("PDF selected");
});

test("fields: editable text, password, OTP, validation", async ({ page }) => {
  await open(page, "fields");
  await page
    .getByRole("textbox", { name: "Full name", exact: true })
    .fill("Changed sample");
  await page
    .getByRole("textbox", { name: "University email", exact: true })
    .fill("bad-address");
  await page
    .getByRole("button", { name: "Validate form", exact: true })
    .click();
  await expect(
    page.getByText("Enter a valid email address.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "University email", exact: true })
    .fill("valid@example.edu");
  await page
    .getByRole("button", { name: "Show password", exact: true })
    .click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByLabel("Verification code", { exact: true }).fill("123456");
  await expect(page.getByText("Code accepted", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Validate form", exact: true })
    .click();
  await expect(
    page.getByText("The sample form is valid. No data leaves this browser.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("numbers: bounds, GPA validation, locale formatting", async ({ page }) => {
  await open(page, "numbers");
  await page.getByRole("button", { name: "More credits", exact: true }).click();
  await expect(page.getByLabel("Credit hours", { exact: true })).toHaveValue(
    "19",
  );
  await page.getByLabel("Grade point average", { exact: true }).fill("4.8");
  await expect(
    page.getByText("Use a value from 0 to 4.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Tuition amount", { exact: true }).fill("20000");
  await expect(page.locator("dd").first()).toContainText("20,000.00");
});

test("selection: partial, radio, switch, select, combo, multi, segment", async ({
  page,
}) => {
  await open(page, "selection");
  const all = page.getByRole("checkbox", {
    name: "All documents",
    exact: true,
  });
  await expect(all).toHaveJSProperty("indeterminate", true);
  await all.focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("3 selected", { exact: true })).toBeVisible();
  await page.getByText("Campus office", { exact: true }).click();
  await expect(
    page.getByRole("radio", { name: "Campus office", exact: true }),
  ).toBeChecked();
  await page.getByText("Email notifications", { exact: true }).click();
  await expect(
    page.getByText("Notifications disabled", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Computer Engineering Department",
      exact: true,
    })
    .click();
  await page.getByRole("option", { name: "Mathematics", exact: true }).click();
  const combo = page.getByRole("combobox", {
    name: "Find a course",
    exact: true,
  });
  await combo.fill("Linear");
  await page
    .getByRole("option", { name: "MAT-204 · Linear algebra", exact: true })
    .click();
  await expect(page.locator(".result-box").first()).toContainText(
    "mat · mat204",
  );
  await page
    .getByRole("option", { name: "Energy systems", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove Energy systems", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Month", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Month", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("dates: month navigation, disabled dates, range, time, period", async ({
  page,
}) => {
  await open(page, "dates");
  await expect(
    page.getByRole("button", { name: "20 Oct 2026", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "November 2026", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Previous month", exact: true })
    .click();
  await page.getByRole("button", { name: "Date range", exact: true }).click();
  await page.getByRole("button", { name: "12 Oct 2026", exact: true }).click();
  await page.getByRole("button", { name: "14 Oct 2026", exact: true }).click();
  await expect(page.getByLabel("Range end", { exact: true })).toHaveValue(
    "2026-10-14",
  );
  await page.getByLabel("Hour", { exact: true }).selectOption("14");
  await expect(page.locator(".result-box")).toContainText("14:30");
  await page
    .getByLabel("Academic period", { exact: true })
    .selectOption("spring");
  await expect(
    page.getByRole("heading", { name: "February 2027", exact: true }),
  ).toBeVisible();
});

test("badges: removable tags, filters, counts", async ({ page }) => {
  await open(page, "badges");
  await page
    .getByRole("button", { name: "Remove CSE-201", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove CSE-201", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Active", exact: true }).click();
  await expect(page.locator(".result-box")).toContainText("active · 2 tags");
  await page
    .getByRole("button", { name: "Mark all read", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Inbox 0", exact: true }),
  ).toBeVisible();
});

test("identity: fallback, presence, and profile", async ({ page }) => {
  await open(page, "identity");
  await page
    .getByRole("button", { name: "Toggle fallback", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Presence", exact: true })
    .selectOption("busy");
  await expect(
    page.locator(".badge").filter({ hasText: "Busy" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open profile", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Student profile", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mark reviewed", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("containers: card selection, accordion, tabs, banner", async ({
  page,
}) => {
  await open(page, "containers");
  await page
    .getByRole("button", { name: "Select course", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Selected", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Academic policies", exact: false })
    .click();
  await expect(
    page.getByText("The sample policy permits 18 credits per term.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Documents", exact: true }).click();
  await expect(
    page.getByText("2 verified documents", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Dismiss banner", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Restore banner", exact: true }),
  ).toBeVisible();
});

test("navigation: local destinations, command search, page, step", async ({
  page,
}) => {
  await open(page, "navigation");
  await page.getByRole("button", { name: "Courses", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Courses", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Find action", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search actions", exact: true })
    .fill("Fees");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Fees", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Fees", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Page 2 / 3", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText(
    "Documents",
  );
});

test("lists: reorder, filter, hierarchy, record selection", async ({
  page,
}) => {
  await open(page, "lists");
  await page
    .getByRole("button", { name: "Move down CSE-201", exact: true })
    .click();
  await expect(
    page.locator(".component-record-list > li").first(),
  ).toContainText("MAT-204");
  await page.getByLabel("Filter courses", { exact: true }).fill("PHY");
  await expect(page.locator(".component-record-list > li")).toHaveCount(1);
  await page.getByLabel("Filter courses", { exact: true }).fill("");
  await page
    .locator(".component-tree")
    .getByRole("button", { name: "Computer Engineering", exact: true })
    .click();
  await page
    .locator(".component-tree")
    .getByRole("button", { name: "MAT-204", exact: true })
    .click();
  await expect(page.locator(".result-box")).toContainText("MAT-204");
});

test("tables: search, filters, sort, selection, paging, columns, expansion, bulk", async ({
  page,
}) => {
  await open(page, "tables");
  await page.getByLabel("Search records", { exact: true }).fill("Mariam");
  await expect(page.locator("tbody > tr")).toHaveCount(1);
  await page.getByLabel("Select Mariam Hassan", { exact: true }).check();
  await page
    .getByRole("button", { name: "Flag for review", exact: true })
    .click();
  await expect(page.locator("tbody")).toContainText("Needs review");
  await page
    .getByRole("button", { name: "Expand record Mariam Hassan", exact: true })
    .click();
  await expect(
    page.getByText("Advisor: Dr. Salma Ali", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Update record status", { exact: true })
    .selectOption("active");
  await page.getByLabel("Search records", { exact: true }).fill("");
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("held");
  await expect(page.locator("tbody > tr")).toHaveCount(2);
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("all");
  await page.getByRole("button", { name: "Credits", exact: true }).click();
  await expect(
    page.getByRole("columnheader", { name: /Credits/ }),
  ).toHaveAttribute("aria-sort", "ascending");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    page.getByText("12 records · Page 2 / 3", { exact: true }),
  ).toBeVisible();
  await page.getByText("Visible columns", { exact: true }).click();
  await page.getByLabel("GPA", { exact: true }).uncheck();
  await expect(page.getByRole("columnheader", { name: /GPA/ })).toHaveCount(0);
  const resize = page.getByRole("button", {
    name: "Resize Student",
    exact: true,
  });
  const before = await resize
    .locator("xpath=ancestor::th")
    .evaluate((element) => element.getBoundingClientRect().width);
  await resize.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(async () =>
      resize
        .locator("xpath=ancestor::th")
        .evaluate((element) => element.getBoundingClientRect().width),
    )
    .toBeGreaterThan(before);
});

test("feedback: deterministic pending, failure, retry, reconnect", async ({
  page,
}) => {
  await open(page, "feedback");
  await page
    .getByLabel("Fail the next sample operation", { exact: true })
    .check();
  await page
    .getByRole("button", { name: "Run sample operation", exact: true })
    .click();
  await expect(
    page.getByText(
      "The sample failed. Disable the failure option, then retry.",
      { exact: true },
    ),
  ).toBeVisible();
  await page
    .getByLabel("Fail the next sample operation", { exact: true })
    .uncheck();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(
    page.getByText("The sample completed. The result is confirmed.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Simulate offline state", exact: true })
    .click();
  await page.getByRole("button", { name: "Reconnect", exact: true }).click();
  await expect(
    page.getByText("Sample connection available", { exact: true }),
  ).toBeVisible();
});

test("overlays: dialog focus, popover, menu, context keyboard", async ({
  page,
}) => {
  await open(page, "overlays");
  const trigger = page.getByRole("button", {
    name: "Edit record",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Edit sample record",
    exact: true,
  });
  await expect(dialog.getByRole("textbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page
    .getByRole("button", { name: "Quick options", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mark reviewed", exact: true })
    .click();
  await expect(page.locator(".result-box")).toContainText("reviewed");
  await page
    .getByRole("button", { name: "Record actions", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Archive sample", exact: true })
    .click();
  await expect(page.locator(".result-box")).toHaveText(
    "Sample record archived",
  );
  await page.locator(".component-context-target").focus();
  await page.keyboard.press("Shift+F10");
  await expect(
    page.getByRole("menu").filter({
      has: page.getByRole("menuitem", {
        name: "Request review",
        exact: true,
      }),
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
});

test("files: invalid, cancel, retry, failure, preview", async ({ page }) => {
  await open(page, "files");
  await page
    .getByRole("button", { name: "Try unsupported file", exact: true })
    .click();
  await expect(
    page.getByText("Choose PDF, PNG, JPEG, TXT, or CSV.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add sample document", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Cancel upload", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Retry without failure", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Preview", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Student: Mariam Hassan",
  );
  await page
    .getByRole("button", { name: "Close preview", exact: true })
    .click();
  await page.getByLabel("Fail the next upload", { exact: true }).check();
  await page
    .getByRole("button", { name: "Add sample document", exact: true })
    .click();
  await expect(
    page.getByText("Simulated connection failure. Retry is available.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retry without failure", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Preview", exact: true }),
  ).toHaveCount(2);
});

test("charts: controlled series, cohort, accessible data", async ({ page }) => {
  await open(page, "charts");
  const enrolled = page.getByRole("button", { name: "Enrolled", exact: true });
  await enrolled.click();
  await expect(enrolled).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("columnheader", { name: "Enrolled", exact: true }),
  ).toHaveCount(0);
  await enrolled.click();
  await page
    .getByLabel("Sample cohort", { exact: true })
    .selectOption("science");
  await expect(page.locator("tbody tr").first()).toContainText("84");
  await page
    .getByRole("button", { name: "Hide data table", exact: true })
    .click();
  await expect(page.getByRole("table")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Show data table", exact: true })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
});

test("communication: notification, message, source, interrupted stream, reviewed extraction", async ({
  page,
}) => {
  await open(page, "communication");
  await page
    .getByRole("button", { name: "Mark all read", exact: true })
    .click();
  await expect(page.getByText("0 unread", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Use sample reply", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Send local message", exact: true })
    .click();
  await expect(page.getByRole("log")).toContainText(
    "Please review my planned courses.",
  );
  await page
    .getByRole("button", { name: "Source 1 · Sample transcript", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("EJ-2026-0042");
  await page
    .getByRole("button", { name: "Return to review", exact: true })
    .click();
  await page.getByLabel("Simulate interruption", { exact: true }).check();
  await page
    .getByRole("button", { name: "Start text simulation", exact: true })
    .click();
  await expect(
    page.getByText("Interrupted · retry available", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retry to completion", exact: true })
    .click();
  await expect(page.getByText("Complete", { exact: true })).toBeVisible();
  await page
    .getByLabel("I checked the name against the source.", { exact: true })
    .check();
  await page
    .getByLabel("I checked the credits against the source.", { exact: true })
    .check();
  await page
    .getByRole("button", { name: "Apply reviewed fields", exact: true })
    .click();
  await expect(
    page.getByText("Applied to local sample", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".component-timeline")).toContainText(
    "Reviewed extraction applied",
  );
});
test("required fields, optional suffixes, metadata, and anchored overflow navigation", async ({
  page,
}) => {
  await open(page, "fields");
  await expect(
    page.getByRole("textbox", { name: "University email", exact: true }),
  ).toHaveAttribute("required", "");
  const username = page.getByRole("textbox", {
    name: "Sample email username",
    exact: true,
  });
  await username.fill("maya");
  await expect(
    page.locator('[data-specimen="fields-required-optional-and-suffix"]'),
  ).toContainText("maya@example.edu");
  expect(
    await username.evaluate((el) => (el as HTMLInputElement).required),
  ).toBe(false);
  await open(page, "identity");
  await expect(
    page.locator('.sample-panel').filter({has:page.locator('[data-specimen="identity-record-header-and-description-list"]')}).locator('dl'),
  ).toContainText("42");
  await open(page, "navigation");
  await page
    .getByRole("link", { name: "Jump to actions", exact: true })
    .click();
  await expect(
    page.locator(".sample-panel").filter({has:page.locator('[data-specimen="navigation-anchors-and-overflow"]')}),
  ).toContainText("Current anchor: Actions");
  await page
    .getByRole("button", { name: "More destinations", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Fees", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Fees", exact: true }),
  ).toBeVisible();
});
