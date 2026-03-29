import type { Arc, Country, Town } from "@/types";
import { CloseButton, Drawer, Portal, Text } from "@chakra-ui/react";

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
              <Drawer.Title>
                Selected {selectedEntity ? selectedEntity.type : ""}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>
                {selectedEntity && selectedEntity.type === "town"
                  ? selectedEntity.name
                  : ""}
              </Text>
            </Drawer.Body>
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
