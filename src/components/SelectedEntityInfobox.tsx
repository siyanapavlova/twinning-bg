import type { Arc, Country, Town } from "@/types";
import { Button, CloseButton, Drawer, Portal, Text } from "@chakra-ui/react";

interface Props {
  selectedEntity: Arc | Town | Country | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const SelectedEntityInfobox = ({ selectedEntity, containerRef }: Props) => {
  const isOpen = !!selectedEntity;

  return (
    <Drawer.Root
      open={isOpen}
      placement="start"
      closeOnInteractOutside={false}
      modal={false}
      size="xs"
    >
      <Portal container={containerRef}>
        <Drawer.Positioner
          padding="4"
          pointerEvents="none"
          style={{ position: "absolute" }}
        >
          <Drawer.Content rounded="md">
            <Drawer.Header>
              <Drawer.Title>Selected Entity</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>{selectedEntity?.id}</Text>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default SelectedEntityInfobox;
