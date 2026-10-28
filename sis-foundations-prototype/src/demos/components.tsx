import type { DemoRenderer } from "../shared";
import {
  ButtonsDemo,
  FieldsDemo,
  NumbersDemo,
  BadgesDemo,
  IdentityDemo,
} from "./components/basic";
import { SelectionDemo } from "./components/selection";
import { DatesDemo } from "./components/dates";
import {
  ContainersDemo,
  NavigationDemo,
  ListsDemo,
} from "./components/structure";
import { TablesDemo } from "./components/tables";
import { FeedbackDemo } from "./components/feedback";
import { OverlaysDemo } from "./components/overlays";
import { FilesDemo } from "./components/files";
import { ChartsDemo } from "./components/charts";
import { CommunicationDemo } from "./components/communication";
import "./components.css";

export const componentRenderers: Record<string, DemoRenderer> = {
  buttons: (props) => <ButtonsDemo {...props} />,
  fields: (props) => <FieldsDemo {...props} />,
  numbers: (props) => <NumbersDemo {...props} />,
  selection: (props) => <SelectionDemo {...props} />,
  dates: (props) => <DatesDemo {...props} />,
  badges: (props) => <BadgesDemo {...props} />,
  identity: (props) => <IdentityDemo {...props} />,
  containers: (props) => <ContainersDemo {...props} />,
  navigation: (props) => <NavigationDemo {...props} />,
  lists: (props) => <ListsDemo {...props} />,
  tables: (props) => <TablesDemo {...props} />,
  feedback: (props) => <FeedbackDemo {...props} />,
  overlays: (props) => <OverlaysDemo {...props} />,
  files: (props) => <FilesDemo {...props} />,
  charts: (props) => <ChartsDemo {...props} />,
  communication: (props) => <CommunicationDemo {...props} />,
};
