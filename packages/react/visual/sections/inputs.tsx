import { FileUpload } from "../../src/FileUpload";
import { NumberField } from "../../src/NumberField";
import { DateField } from "../../src/DateField";
import { Avatar } from "../../src/Avatar";
import { Progress } from "../../src/Progress";

export function InputsSection() {
  return (
    <div className="fixture-stack">
      <FileUpload label="Attach transcript" maxSizeMb={5} />
      <NumberField label="Credit hours" hint="1 to 21" defaultValue="3" />
      <DateField label="Start date" hint="The term start." />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Avatar name="Salma Hassan" />
        <Avatar name="Omar Khaled" size={24} />
        <Avatar name="Mariam Adel" size={40} />
      </div>
      <Progress value={62} label="Term progress" />
    </div>
  );
}
