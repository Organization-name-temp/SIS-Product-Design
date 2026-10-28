import { test, expect, type Page } from "@playwright/test";

async function openPattern(page: Page, item: string, state = "default") {
  await page.goto(`/?item=${item}&embed=1&lang=en&state=${state}`);
  await expect(page.locator(".pattern-demo")).toBeVisible();
}

test("bulk: review individual outcomes and recover the blocked record", async ({
  page,
}) => {
  await openPattern(page, "bulk");
  await page.getByLabel("Find a sample student").fill("Omar");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Find a sample student").clear();
  await page.getByLabel("Select visible").check();
  await page
    .getByRole("button", { name: "Review selected (4)", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Review bulk update" });
  await expect(dialog).toContainText("Will need evidence");
  await dialog
    .getByRole("button", { name: "Apply sample update", exact: true })
    .click();
  await expect(page.getByText("Updated", { exact: true })).toHaveCount(3);
  await page
    .getByRole("button", { name: "Add sample evidence and retry", exact: true })
    .click();
  await expect(page.getByText("Updated", { exact: true })).toHaveCount(4);
});

test("wizard: validate, retain input, review, and submit locally", async ({
  page,
}) => {
  await openPattern(page, "wizard");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Enter a valid email address.", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Email address", { exact: true })
    .fill("maya@example.test");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Entry term", { exact: true }).selectOption("2027-09");
  await page
    .getByLabel("I reviewed these sample details.", { exact: true })
    .check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".pattern-summary")).toContainText(
    "maya@example.test",
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("Entry term", { exact: true })).toHaveValue(
    "2027-09",
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("Email address", { exact: true })).toHaveValue(
    "maya@example.test",
  );
  await page.evaluate(() =>
    window.postMessage(
      {
        type: "sis-presentation",
        config: { locale: "ar", theme: "dark", density: "compact" },
      },
      location.origin,
    ),
  );
  await expect(
    page.getByLabel("البريد الإلكتروني", { exact: true }),
  ).toHaveValue("maya@example.test");
  await page.evaluate(() =>
    window.postMessage(
      { type: "sis-presentation", config: { locale: "en" } },
      location.origin,
    ),
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Submit sample application", exact: true })
    .click();
  await expect(
    page.getByText("Sample application submitted", { exact: true }),
  ).toBeVisible();
});

test("import: map a local file, exclude an error, and retry corrected sample rows", async ({
  page,
}) => {
  await openPattern(page, "import");
  await page
    .getByLabel("Choose a CSV file", { exact: true })
    .setInputFiles({
      name: "local-sample.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(
        "name,credits,student_id\nMaya Hassan,3,S-1001\nOmar Ali,six,S-1002\nLina Martin,4,S-1003",
      ),
    });
  await expect(
    page.getByText("local-sample.csv", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Student ID", { exact: true }).selectOption("2");
  await page.getByLabel("Name", { exact: true }).selectOption("0");
  await page.getByLabel("Credits", { exact: true }).selectOption("1");
  await page
    .getByRole("button", { name: "Validate rows", exact: true })
    .click();
  await expect(
    page.getByText("Credits must be a positive number.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Exclude row 2", { exact: true }).check();
  await page
    .getByRole("button", { name: "Import valid rows (2)", exact: true })
    .click();
  await expect(page.getByText(/2 sample rows imported locally/)).toBeVisible();
  await page
    .getByRole("button", { name: "Load sample CSV", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Validate rows", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Correct sample errors and retry",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Import valid rows (3)", exact: true })
    .click();
  await expect(page.getByText(/3 sample rows imported locally/)).toBeVisible();
});

test("approvals: require a reason, review evidence, request changes, and decide", async ({
  page,
}) => {
  await openPattern(page, "approvals");
  await page
    .getByRole("button", { name: "Approve sample", exact: true })
    .click();
  await expect(
    page.getByText("Enter a reason for the sample decision.", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Decision reason", { exact: true })
    .fill("Sample course evidence reviewed.");
  await page
    .getByRole("button", { name: "Open sample evidence", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Sample evidence", exact: true })
    .getByRole("button", { name: "Mark evidence as reviewed", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Request changes", exact: true })
    .click();
  await expect(
    page.getByText("Changes requested", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Simulate revised submission", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open sample evidence", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mark evidence as reviewed", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Approve sample", exact: true })
    .click();
  await expect(
    page.getByText("Approved sample", { exact: true }),
  ).toBeVisible();
});

test("access: reject invalid scope and require impact acknowledgement before save", async ({
  page,
}) => {
  await openPattern(page, "access");
  await page.getByLabel("Draft role", { exact: true }).selectOption("student");
  await page
    .getByLabel("Draft scope", { exact: true })
    .selectOption("department");
  await page
    .getByRole("button", { name: "Review access impact", exact: true })
    .click();
  await expect(
    page.getByText(/This sample combination is invalid/),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByLabel("Draft scope", { exact: true }).selectOption("own");
  await page
    .getByRole("button", { name: "Review access impact", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Review before saving access",
  });
  await expect(
    dialog.getByRole("button", { name: "Save sample access", exact: true }),
  ).toBeDisabled();
  await dialog
    .getByLabel("I reviewed this sample impact.", { exact: true })
    .check();
  await dialog
    .getByRole("button", { name: "Save sample access", exact: true })
    .click();
  await expect(page.locator('[data-specimen="save"]')).toContainText(
    "Student · Own sample record",
  );
});

test("academic: expand units and validate a curriculum effective date", async ({
  page,
}) => {
  await openPattern(page, "academic");
  await page
    .getByRole("button", { name: "Faculty of Business", exact: true })
    .click();
  await expect(page.getByText("Accounting", { exact: true })).toBeVisible();
  await page.getByLabel("Draft version", { exact: true }).selectOption("2026");
  await expect(page.getByText("ELE-110", { exact: true })).toBeVisible();
  await page.getByLabel("Effective date", { exact: true }).clear();
  await page
    .getByRole("button", { name: "Apply sample version", exact: true })
    .click();
  await expect(
    page.getByText("Choose an effective date.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Effective date", { exact: true }).fill("2027-10-01");
  await page
    .getByRole("button", { name: "Apply sample version", exact: true })
    .click();
  await expect(
    page.getByText("2026 · 2027-10-01", { exact: true }),
  ).toBeVisible();
});

test("registration: block overlapping sections and confirm an alternate timetable", async ({
  page,
}) => {
  await openPattern(page, "registration", "conflict");
  await page
    .getByRole("button", { name: "Review registration", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Review sample registration",
  });
  await expect(
    dialog.getByRole("button", {
      name: "Confirm sample registration",
      exact: true,
    }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  const region = page.getByRole("region", {
    name: "Available sample sections",
  });
  await region
    .getByRole("row")
    .filter({ hasText: "PHY-101-A" })
    .getByRole("button", { name: "Remove section", exact: true })
    .click();
  await region
    .getByRole("row")
    .filter({ hasText: "PHY-101-B" })
    .getByRole("button", { name: "Select section", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Review registration", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Confirm sample registration", exact: true })
    .click();
  await expect(
    page.getByText(/Sample registration confirmed locally/),
  ).toBeVisible();
});

test("results: explain unmet requirements and preview an unofficial transcript", async ({
  page,
}) => {
  await openPattern(page, "results", "partial");
  await expect(
    page.getByText("Awaiting sample result", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Requirements", exact: true }).click();
  await expect(page.getByText(/CSE-201 is unmet/)).toBeVisible();
  await expect(page.getByText(/PHY-101 also remains unmet/)).toBeVisible();
  await page.getByRole("tab", { name: "Transcript", exact: true }).click();
  const downloaded = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download sample text", exact: true })
    .click();
  expect((await downloaded).suggestedFilename()).toBe("sample-transcript.txt");
  await page
    .getByRole("button", { name: "Preview sample transcript", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Unofficial sample transcript" }),
  ).toContainText("Maya Hassan");
});

test("finance: apply aid, reject a mismatch, reconcile, and clear the sample hold", async ({
  page,
}) => {
  await openPattern(page, "finance");
  await page
    .getByRole("button", { name: "Apply sample award", exact: true })
    .click();
  await page.getByLabel("Ledger filter", { exact: true }).selectOption("award");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("AWD-010");
  await page
    .getByRole("button", { name: "Review sample payment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm sample reconciliation", exact: true })
    .click();
  await expect(
    page.getByText("The sample amount must equal 500 EGP.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Use matching sample amount", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm sample reconciliation", exact: true })
    .click();
  await expect(page.getByText("Cleared", { exact: true })).toBeVisible();
});

test("operations: retain confirmed identity during mail failure and recover the failed step", async ({
  page,
}) => {
  await openPattern(page, "operations");
  await page
    .getByRole("button", { name: "Request sample setup", exact: true })
    .click();
  const identity = page
    .getByRole("row")
    .filter({ hasText: "Identity account" });
  await expect(identity).toContainText("DEMO-IDENTITY-01");
  await page
    .getByRole("button", { name: "Run next sample confirmation", exact: true })
    .click();
  await expect(page.getByText(/Mail health: Simulated failure/)).toBeVisible();
  await expect(identity).toContainText("DEMO-IDENTITY-01");
  await page
    .getByRole("button", { name: "Retry failed mail step", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Confirm sample course workspace",
      exact: true,
    })
    .click();
  await expect(
    page.getByText("All sample services have local confirmations.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset sample setup", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Request sample setup", exact: true }),
  ).toBeEnabled();
});
