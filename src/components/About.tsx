import {
  Button,
  Dialog,
  CloseButton,
  Portal,
  Link,
  Table,
  List,
  Center,
} from "@chakra-ui/react";
import { LuCircleDashed, LuExternalLink } from "react-icons/lu";

const About = () => {
  const tableData = [
    { entity: "Bulgarian municipalities", original: "265", here: "195" },
    { entity: "Twin entities", original: "956", here: "932" },
    { entity: "Twin relations", original: "1,187", here: "1,142" },
    { entity: "Countries", original: "67", here: "66" },
  ];

  const futurePlans = [
    "Search",
    "Displaying town names",
    "Displaying country names",
    "Displaying the Bulgarian towns with no twins",
    "Displaying population size",
    "Browsing by partnership contract type",
    "Browsing by partnership area",
    "Dark mode",
  ];

  return (
    <Dialog.Root
      size="cover"
      placement="center"
      motionPreset="slide-in-bottom"
      scrollBehavior="inside"
    >
      <Dialog.Trigger asChild>
        <Button variant="plain" size="sm" color="white">
          About
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bgColor="gray.800/80" color="white" maxWidth="820px">
            <Dialog.Header>
              <Dialog.Title>About</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color="gray.400" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              This project was inspired by{" "}
              <Link
                variant="underline"
                href={"https://www.youtube.com/watch?v=zte_vg0D8Z4"}
                color="teal.400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Map Men's video <LuExternalLink />
              </Link>{" "}
              about Twin towns in the UK.
              <br />
              <br /> The{" "}
              <Link
                variant="underline"
                href={
                  "https://www.namrb.org/uploads/tinymceup/files/TwinngBG2022Rev25082023.xls"
                }
                color="teal.400"
                target="_blank"
                rel="noopener noreferrer"
              >
                data <LuExternalLink />
              </Link>{" "}
              comes from the{" "}
              <Link
                variant="underline"
                href={"https://www.namrb.org/en"}
                color="teal.400"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Association of the Municipalities in the Republic of
                Bulgaria <LuExternalLink />
              </Link>{" "}
              and includes information about Bulgaria's municipalities and their
              twins as of 25th August 2023. For each entry, the original data
              includes, among others: name of the Bulgarian municipality, name
              of the twinned entity (in most cases town, village or
              municipality), country of the twinned entity, type of partnetship,
              partnership areas.
              <br />
              <br />
              Location, Latin spelling, and Wikidata ID of each entity were
              added to the dataset as part of this project.
              <br />
              <br />
              The original dataset includes more towns and relations than are
              displayed here (see below for exact numbers). A small portion of
              the difference in numbers comes from duplication. The rest is due
              to naming of twin entities that is too ambiguous (multiple towns
              of the same name in the same country) or unclear (spelling errors
              that don't allow for disamgbiguation).
              <br />
              <br />
              The original data also includes the 70 Bulgarian municipalities
              that do not have any twins.
              <br />
              <br />
              <Center>
                <Table.Root>
                  <Table.Header>
                    <Table.Row bgColor="gray.800/0">
                      <Table.ColumnHeader></Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="white"
                        fontWeight="semibold"
                        textAlign="end"
                      >
                        Original dataset
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="white"
                        fontWeight="semibold"
                        textAlign="end"
                      >
                        Shown here
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {tableData.map((item) => (
                      <Table.Row key={item.entity} bgColor="gray.800/0">
                        <Table.Cell fontWeight="semibold">
                          {item.entity}
                        </Table.Cell>
                        <Table.Cell textAlign="end">{item.original}</Table.Cell>
                        <Table.Cell textAlign="end">{item.here}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Center>
              <br />
              <br />
              <br />
              Upcoming releases will cover the following:
              <List.Root gap="1" variant="plain" marginTop={2}>
                {futurePlans.map((plan, index) => (
                  <List.Item key={index}>
                    <List.Indicator asChild color="teal.400">
                      <LuCircleDashed />
                    </List.Indicator>
                    {plan}
                  </List.Item>
                ))}
              </List.Root>
              <br />
              For other requests or if you encounter any bugs, please open an
              issue on{" "}
              <Link
                variant="underline"
                href={"https://github.com/siyanapavlova/twinning-bg/issues"}
                color="teal.400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github <LuExternalLink />
              </Link>
              .
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default About;
