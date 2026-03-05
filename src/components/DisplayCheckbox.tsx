import { Checkbox } from "@chakra-ui/react";

interface Props {
  id: string;
  label: string;
  defaultChecked: boolean;
  onChange: (checked: boolean) => void;
}

const DisplayCheckbox = ({ id, label, defaultChecked, onChange }: Props) => {
  return (
    <Checkbox.Root
      key={id}
      value={id}
      colorPalette={"teal"}
      variant="solid"
      defaultChecked={defaultChecked}
      onCheckedChange={({ checked }) => onChange(checked === true)}
      marginX={2}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
};

export default DisplayCheckbox;
