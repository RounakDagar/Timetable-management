import React from "react";
import {
  Box,
  HStack,
  IconButton,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableView = ({ timetable, selectedDayIndex, setSelectedDayIndex, handleTimetableClick }) => {
  // Use Chakra UI's `useColorModeValue` for light/dark mode support
  const tableBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("teal.500", "teal.600");
  const headerTextColor = useColorModeValue("white", "gray.100");
  const hoverBg = useColorModeValue("teal.50", "gray.600");

  return (
    <Box>
      {/* Day Navigation */}
      <HStack justify="center" mb="6">
        <IconButton
          icon={<ArrowLeftIcon />}
          aria-label="Previous Day"
          onClick={() => setSelectedDayIndex((prev) => (prev === 0 ? 6 : prev - 1))}
          colorScheme="teal"
        />
        <Select
          value={selectedDayIndex}
          onChange={(e) => setSelectedDayIndex(parseInt(e.target.value, 10))}
          maxW="200px"
          focusBorderColor="teal.500"
        >
          {daysOfWeek.map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </Select>
        <IconButton
          icon={<ArrowRightIcon />}
          aria-label="Next Day"
          onClick={() => setSelectedDayIndex((prev) => (prev === 6 ? 0 : prev + 1))}
          colorScheme="teal"
        />
      </HStack>

      {/* Timetable Table */}
      {timetable.length > 0 ? (
        <Box p="6" bg={tableBg} boxShadow="md" borderRadius="md">
          <Table variant="striped" colorScheme="teal">
            <Thead bg={headerBg}>
              <Tr>
                <Th color={headerTextColor}>Time Slot</Th>
                <Th color={headerTextColor}>Venue</Th>
                <Th color={headerTextColor}>Course</Th>
                <Th color={headerTextColor}>Faculty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {timetable.map((entry) => (
                <Tr
                  key={entry.id}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => handleTimetableClick(entry)}
                >
                  <Td>{entry.timeSlot}</Td>
                  <Td>{entry.venue}</Td>
                  <Td>{entry.course?.courseName || "N/A"}</Td>
                  <Td>{entry.faculty?.name || "N/A"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text textAlign="center" fontSize="lg" color="gray.600">
          No timetable available for {daysOfWeek[selectedDayIndex]}.
        </Text>
      )}
    </Box>
  );
};

export default TimetableView;