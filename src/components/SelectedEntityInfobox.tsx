import type { Arc, Country, Town } from "@/types";
import { Box, CloseButton, Drawer, Portal, Text } from "@chakra-ui/react";

interface Props {
  selectedEntity: Arc | Town | Country | null;
  relations: Town[] | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onTownInfoHover: (arc: Town | null) => void;
}

const SelectedEntityInfobox = ({
  selectedEntity,
  relations,
  containerRef,
  onTownInfoHover,
}: Props) => {
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
          <Drawer.Content
            rounded="md"
            bg="white/80"
            backdropFilter="blur(10px)"
          >
            <Drawer.Header>
              <Drawer.Title>
                {selectedEntity && selectedEntity.type === "town"
                  ? selectedEntity.name + ", " + selectedEntity.country
                  : ""}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {selectedEntity &&
                selectedEntity.type === "town" &&
                relations && (
                  <Text paddingBottom={3}>{relations.length} twins</Text>
                )}
              {relations &&
                relations.map((t) => (
                  <Box
                    key={t.id}
                    _hover={{ fontWeight: "bold", cursor: "pointer" }}
                    onMouseEnter={() => onTownInfoHover(t)}
                    onMouseLeave={() => onTownInfoHover(null)}
                  >
                    <Text paddingY={1}>
                      {t.name},{" "}
                      <Text color="gray.500" as="span">
                        {t.country}
                      </Text>
                    </Text>
                  </Box>
                ))}
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
