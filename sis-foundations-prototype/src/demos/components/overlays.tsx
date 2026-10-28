import { useState } from "react";
import {
  Button as AriaButton,
  DialogTrigger,
  Popover,
  Dialog,
  Heading,
  TooltipTrigger,
  Tooltip,
  MenuTrigger,
  Menu,
  MenuItem,
  Separator,
  ModalOverlay,
  Modal,
} from "react-aria-components";
import {
  ChevronDown,
  CircleHelp,
  Copy,
  MoreHorizontal,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Field,
  ModalExample,
  copyText,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, useLabels } from "./common";

export function OverlaysDemo(props: DemoProps) {
  const t = useLabels(props);
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [context, setContext] = useState(false);
  const [popover, setPopover] = useState(false);
  const [name, setName] = useState("Mariam Hassan");
  const [result, setResult] = useState("");
  const [removed, setRemoved] = useState(false);
  const [menuChoice, setMenuChoice] = useState("overview");
  const action = (key: string) => {
    setMenuChoice(key);
    const text =
      key === "copy"
        ? t("Identifier copied", "نُسخ المعرف", "Identifiant copié")
        : key === "archive"
          ? t(
              "Sample record archived",
              "أُرشف السجل التجريبي",
              "Dossier exemple archivé",
            )
          : `${t("Selected action", "الإجراء المحدد", "Action sélectionnée")}: ${key}`;
    setResult(text);
    props.notify(text, "success");
    if (key === "copy")
      void copyText("EJ-2026-0042", props.notify, props.locale);
  };
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="overlays-dialog-drawer-and-confirmation">
              {t(
                "Dialog, drawer, and confirmation",
                "الحوار واللوحة والتأكيد",
                "Dialogue, panneau et confirmation",
              )}
            </span>
          }
        >
          <div className="toolbar">
            <Button onClick={() => setDialog(true)}>
              {t("Edit record", "تعديل السجل", "Modifier le dossier")}
            </Button>
            <Button variant="secondary" onClick={() => setDrawer(true)}>
              {t(
                "Open details drawer",
                "فتح لوحة التفاصيل",
                "Ouvrir le panneau",
              )}
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirm(true)}
              disabled={removed}
            >
              <Trash2 size={20} />
              {t(
                "Remove sample record",
                "حذف السجل التجريبي",
                "Supprimer le dossier exemple",
              )}
            </Button>
            {removed && (
              <Button
                variant="secondary"
                onClick={() => {
                  setRemoved(false);
                  setResult(
                    t("Sample restored", "استُعيد المثال", "Exemple restauré"),
                  );
                }}
              >
                {t("Restore record", "استعادة السجل", "Restaurer le dossier")}
              </Button>
            )}
          </div>
          <p className="muted">
            {t(
              "Tab stays inside a dialog. Escape closes it. Focus returns to the trigger.",
              "يبقى التركيز داخل الحوار. يغلقه Escape. يعود التركيز إلى الزر.",
              "La touche Tab reste dans le dialogue. Échap ferme. Le focus revient au bouton.",
            )}
          </p>
        </Panel>
        <Panel
          title={
            <span data-specimen="overlays-popover-and-tooltip">
              {t(
                "Popover and tooltip",
                "النافذة المنبثقة والتلميح",
                "Fenêtre contextuelle et infobulle",
              )}
            </span>
          }
        >
          <div className="toolbar">
            <DialogTrigger isOpen={popover} onOpenChange={setPopover}>
              <AriaButton className="button button-secondary">
                <Settings size={20} />
                {t("Quick options", "خيارات سريعة", "Options rapides")}
              </AriaButton>
              <Popover className="component-popover">
                <Dialog className="component-popover-dialog">
                  <Heading slot="title">
                    {t("Record options", "خيارات السجل", "Options du dossier")}
                  </Heading>
                  <p>
                    {t(
                      "Local changes apply to this sample only.",
                      "تطبق التغييرات محليًا على هذا المثال فقط.",
                      "Les modifications concernent cet exemple local.",
                    )}
                  </p>
                  <Button
                    onClick={() => {
                      setPopover(false);
                      action("reviewed");
                    }}
                  >
                    {t(
                      "Mark reviewed",
                      "تحديد كمراجع",
                      "Marquer comme vérifié",
                    )}
                  </Button>
                </Dialog>
              </Popover>
            </DialogTrigger>
            <TooltipTrigger delay={200}>
              <AriaButton
                className="button button-ghost"
                aria-label={t(
                  "About credit hours",
                  "عن الساعات المعتمدة",
                  "À propos des crédits",
                )}
              >
                <CircleHelp size={20} />
              </AriaButton>
              <Tooltip className="component-tooltip">
                {t(
                  "Credit hours represent the approved study load.",
                  "تمثل الساعات المعتمدة العبء الدراسي المعتمد.",
                  "Les crédits représentent la charge de cours approuvée.",
                )}
              </Tooltip>
            </TooltipTrigger>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="overlays-action-menu">
              {t("Action menu", "قائمة الإجراءات", "Menu d’actions")}
            </span>
          }
        >
          <MenuTrigger>
            <AriaButton className="button button-secondary">
              {t("Record actions", "إجراءات السجل", "Actions du dossier")}
              <ChevronDown size={20} />
            </AriaButton>
            <Popover className="component-popover">
              <Menu
                className="component-menu"
                aria-label={t(
                  "Record actions",
                  "إجراءات السجل",
                  "Actions du dossier",
                )}
                onAction={(key) => action(String(key))}
              >
                <MenuItem className="component-menu-item" id="overview">
                  {t("Open overview", "فتح النظرة العامة", "Ouvrir l’aperçu")}
                </MenuItem>
                <MenuItem
                  className="component-menu-item"
                  id="copy"
                  textValue={t(
                    "Copy identifier",
                    "نسخ المعرف",
                    "Copier l’identifiant",
                  )}
                >
                  <Copy size={20} />
                  {t("Copy identifier", "نسخ المعرف", "Copier l’identifiant")}
                </MenuItem>
                <Separator className="component-divider" />
                <MenuItem className="component-menu-item" id="archive">
                  {t("Archive sample", "أرشفة المثال", "Archiver l’exemple")}
                </MenuItem>
                <MenuItem
                  className="component-menu-item"
                  id="locked"
                  isDisabled
                >
                  {t("Restricted action", "إجراء مقيد", "Action limitée")}
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
          <p className="muted">
            {t(
              "Use arrow keys, Home, End, and Enter.",
              "استخدم الأسهم وHome وEnd وEnter.",
              "Utilisez les flèches, Début, Fin et Entrée.",
            )}
          </p>
          <Badge>{menuChoice}</Badge>
        </Panel>
        <Panel
          title={
            <span data-specimen="overlays-context-menu">
              {t("Context menu", "القائمة السياقية", "Menu contextuel")}
            </span>
          }
        >
          <MenuTrigger isOpen={context} onOpenChange={setContext}>
            <AriaButton
              className="component-context-target"
              onPress={() => setContext(true)}
              onContextMenu={(event) => {
                event.preventDefault();
                setContext(true);
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "ContextMenu" ||
                  (event.shiftKey && event.key === "F10")
                ) {
                  event.preventDefault();
                  setContext(true);
                }
              }}
            >
              <MoreHorizontal size={24} />
              <strong>
                <bdi>EJ-2026-0042</bdi>
              </strong>
              <span>
                {t(
                  "Right-click, press Shift+F10, or activate this record.",
                  "انقر بالزر الأيمن أو اضغط Shift+F10 أو فعّل هذا السجل.",
                  "Faites un clic droit, utilisez Maj+F10 ou activez ce dossier.",
                )}
              </span>
            </AriaButton>
            <Popover className="component-popover">
              <Menu
                className="component-menu"
                aria-label={t(
                  "Context actions",
                  "إجراءات سياقية",
                  "Actions contextuelles",
                )}
                onAction={(key) => {
                  setContext(false);
                  action(String(key));
                }}
              >
                <MenuItem id="copy" className="component-menu-item">
                  {t("Copy identifier", "نسخ المعرف", "Copier l’identifiant")}
                </MenuItem>
                <MenuItem
                  id="details"
                  className="component-menu-item"
                  onAction={() => setDrawer(true)}
                >
                  {t("View details", "عرض التفاصيل", "Voir les détails")}
                </MenuItem>
                <MenuItem id="review" className="component-menu-item">
                  {t("Request review", "طلب مراجعة", "Demander une révision")}
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </Panel>
      </div>
      <output className="result-box" role="status">
        {result ||
          t(
            "Open an overlay to inspect its behavior.",
            "افتح نافذة لفحص سلوكها.",
            "Ouvrez une fenêtre pour examiner son comportement.",
          )}
      </output>
      <ModalExample
        open={dialog}
        onClose={() => setDialog(false)}
        title={t(
          "Edit sample record",
          "تعديل السجل التجريبي",
          "Modifier le dossier exemple",
        )}
        locale={props.locale}
      >
        <div className="demo-stack">
          <Field label={t("Student name", "اسم الطالب", "Nom de l’étudiant")}>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </Field>
          <p className="muted">
            {t(
              "No changes leave this browser.",
              "لا تغادر التغييرات هذا المتصفح.",
              "Les modifications restent dans ce navigateur.",
            )}
          </p>
          <div className="toolbar">
            <Button
              onClick={() => {
                setDialog(false);
                setResult(
                  `${t("Saved locally", "حُفظ محليًا", "Enregistré localement")}: ${name}`,
                );
                props.notify(
                  t(
                    "Record saved locally",
                    "حُفظ السجل محليًا",
                    "Dossier enregistré localement",
                  ),
                  "success",
                );
              }}
            >
              {t("Save changes", "حفظ التغييرات", "Enregistrer")}
            </Button>
            <Button variant="secondary" onClick={() => setDialog(false)}>
              {t("Cancel", "إلغاء", "Annuler")}
            </Button>
          </div>
        </div>
      </ModalExample>
      <ModalExample
        open={drawer}
        onClose={() => setDrawer(false)}
        title={t("Record details", "تفاصيل السجل", "Détails du dossier")}
        locale={props.locale}
        drawer
      >
        <div className="demo-stack">
          <Badge tone="success">{t("Verified", "موثق", "Vérifié")}</Badge>
          <h3>{name}</h3>
          <bdi>EJ-2026-0042</bdi>
          <p>
            {t(
              "Computer Engineering · Year 2 · Autumn 2026",
              "هندسة الحاسبات · السنة 2 · خريف 2026",
              "Génie informatique · Année 2 · Automne 2026",
            )}
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setDrawer(false);
              setDialog(true);
            }}
          >
            {t("Edit this record", "تعديل هذا السجل", "Modifier ce dossier")}
          </Button>
        </div>
      </ModalExample>
      <ModalOverlay
        className="modal-overlay"
        isOpen={confirm}
        onOpenChange={setConfirm}
      >
        <Modal className="modal">
          <Dialog
            role="alertdialog"
            className="dialog"
            aria-label={t(
              "Confirm sample removal",
              "تأكيد حذف المثال",
              "Confirmer la suppression",
            )}
          >
            <div className="demo-stack">
              <Heading slot="title">
                {t(
                  "Remove this sample record?",
                  "حذف هذا السجل التجريبي؟",
                  "Supprimer ce dossier exemple ?",
                )}
              </Heading>
              <p>
                {t(
                  "This local action removes the sample. You can restore it afterward.",
                  "يحذف هذا الإجراء المحلي المثال. يمكنك استعادته بعد ذلك.",
                  "Cette action locale supprime l’exemple. Vous pouvez le restaurer ensuite.",
                )}
              </p>
              <div className="toolbar">
                <AriaButton
                  className="button button-secondary"
                  autoFocus
                  onPress={() => setConfirm(false)}
                >
                  {t("Keep record", "الاحتفاظ بالسجل", "Conserver le dossier")}
                </AriaButton>
                <Button
                  variant="danger"
                  onClick={() => {
                    setRemoved(true);
                    setConfirm(false);
                    setResult(
                      t(
                        "Sample record removed locally",
                        "حُذف السجل التجريبي محليًا",
                        "Dossier exemple supprimé localement",
                      ),
                    );
                  }}
                >
                  {t("Remove sample", "حذف المثال", "Supprimer l’exemple")}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </ComponentFrame>
  );
}
