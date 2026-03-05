import { Flex } from "@chakra-ui/react";
import DisplayCheckbox from "./DisplayCheckbox";
import type { CheckedState } from "./DisplayCheckbox";

interface Props {
  onChangeTownSelection: (checked: CheckedState) => void;
  onChangeCountrySelection: (checked: CheckedState) => void;
}

const DisplaySelection = ({
  onChangeTownSelection,
  onChangeCountrySelection,
}: Props) => {
  return (
    <Flex
      style={{
        top: 20,
        right: 300,
        padding: 10,
      }}
      position="absolute"
      borderRadius={10}
      bgColor="white/30"
      justifyContent="space-between"
    >
      <DisplayCheckbox
        id="townsCheckbox"
        label="All towns"
        defaultChecked={false}
        onChange={(checked) => onChangeTownSelection(checked)}
      />
      <DisplayCheckbox
        id="townLabelsCheckbox"
        label="Town names"
        defaultChecked={false}
        onChange={(checked) => console.log("Show town names:", checked)}
      />
      <DisplayCheckbox
        id="countriesCheckbox"
        label="Countries"
        defaultChecked={true}
        onChange={(checked) => onChangeCountrySelection(checked)}
      />
      <DisplayCheckbox
        id="countryNamesCheckbox"
        label="Country names"
        defaultChecked={false}
        onChange={(checked) => console.log("Show country names:", checked)}
      />
    </Flex>
  );
};

export default DisplaySelection;
