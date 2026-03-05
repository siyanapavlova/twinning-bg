import { Checkbox } from "@chakra-ui/react";

export type CheckedState = boolean | "indeterminate";

interface Props {
  id: string;
  label: string;
  defaultChecked: CheckedState;
  onChange: (checked: CheckedState) => void;
}

const DisplayCheckbox = ({ id, label, defaultChecked, onChange }: Props) => {
  return (
    <Checkbox.Root
      key={id}
      value={id}
      colorPalette={"teal"}
      variant="solid"
      defaultChecked={defaultChecked}
      onCheckedChange={({ checked }) => onChange(checked)}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
};

export default DisplayCheckbox;
