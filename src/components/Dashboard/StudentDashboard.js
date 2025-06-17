// src/components/Dashboard/StudentDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  useToast,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const StudentDashboard = () => {
  const { token, userId } = useContext(AuthContext); // Access token and userId from AuthContext
  const navigate = useNavigate();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay()); // Default to today
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic colors for light/dark mode
  const tableBg = useColorModeValue("white", "gray.700");
  const cardBg = useColorModeValue("teal.100", "teal.700");
  const cardHoverBg = useColorModeValue("teal.200", "teal.600");
  const cardTextColor = useColorModeValue("teal.800", "white");

  // Fetch courses and timetable
  useEffect(() => {
    const fetchCoursesAndTimetable = async () => {
      try {
        setLoading(true);

        // Fetch courses
        const coursesResponse = await axios.get(
          `http://localhost:8080/courses/students/${userId}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(coursesResponse.data);

        // Fetch timetable
        const timetableResponse = await axios.get(
          `http://localhost:8080/timetables/day/${daysOfWeek[selectedDayIndex]}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTimetable(
          timetableResponse.data.sort((a, b) => {
            const timeA = a.timeSlot.split("-")[0];
            const timeB = b.timeSlot.split("-")[0];
            return timeA.localeCompare(timeB);
          })
        );
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchCoursesAndTimetable();
    }
  }, [token, userId, selectedDayIndex, toast]);

  const handleDayChange = (e) => {
    setSelectedDayIndex(parseInt(e.target.value, 10));
  };

  const handleCourseClick = (courseCode) => {
    navigate(`/attendance-summary/${userId}/${courseCode}`);
  };

  const handleTimetableClick = (entry) => {
    
  };

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" color="teal.500" />
        <Text mt="4">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="lg" mx="auto" mt="10">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" p="6">
      <VStack spacing="6" align="stretch">
        <HStack justify="space-between">
          <Heading size="lg" color="teal.500">
            Student Dashboard
          </Heading>
        </HStack>

        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab
              _hover={{
                bg: "teal.500",
                color: "white",
              }}
            >
              Timetable
            </Tab>
            <Tab
              _hover={{
                bg: "teal.500",
                color: "white",
              }}
            >
              Courses
            </Tab>
          </TabList>
          <TabPanels>
            {/* Timetable Tab */}
            <TabPanel>
              <Box>
                {/* Day Selector */}
                <HStack justify="center" mb="6">
                  <Button
                    size="sm"
                    onClick={() =>
                      setSelectedDayIndex((prev) => (prev === 0 ? 6 : prev - 1))
                    }
                  >
                    Previous
                  </Button>
                  <Select
                    maxW="200px"
                    value={selectedDayIndex}
                    onChange={handleDayChange}
                    focusBorderColor="teal.500"
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </Select>
                  <Button
                    size="sm"
                    onClick={() =>
                      setSelectedDayIndex((prev) => (prev === 6 ? 0 : prev + 1))
                    }
                  >
                    Next
                  </Button>
                </HStack>

                {/* Timetable */}
                <Box p="6" bg={tableBg} boxShadow="lg" borderRadius="md">
                  {timetable.length > 0 ? (
                    <Table variant="striped" colorScheme="teal">
                      <Thead>
                        <Tr>
                          <Th>Time Slot</Th>
                          <Th>Venue</Th>
                          <Th>Course</Th>
                          <Th>Faculty</Th>
                          <Th>Attended</Th> {/* New column for attendance */}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {timetable.map((entry) => (
                          <Tr
                            key={entry.id}
                            cursor="pointer"
                            onClick={() => handleTimetableClick(entry)}
                          >
                            <Td>{entry.timeSlot}</Td>
                            <Td>{entry.venue}</Td>
                            <Td>
                              {entry.course.courseName} ({entry.course.courseCode})
                            </Td>
                            <Td>{entry.faculty.name}</Td>
                            <Td>
                              {entry.attended ? (
                                <Text color="green.500" fontWeight="bold">
                                  Yes
                                </Text>
                              ) : (
                                <Text color="red.500" fontWeight="bold">
                                  No
                                </Text>
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text>No timetable available for {daysOfWeek[selectedDayIndex]}.</Text>
                  )}
                </Box>
              </Box>
            </TabPanel>

            {/* Courses Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb="4" color="teal.500">
                  Your Courses
                </Heading>
                <SimpleGrid columns={[1, 2, 3]} spacing="6">
                  {courses.map((course) => (
                    <Box
                      key={course.courseCode}
                      p="6"
                      bg={cardBg}
                      color={cardTextColor}
                      boxShadow="md"
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: cardHoverBg }}
                      transition="all 0.2s"
                      onClick={() => handleCourseClick(course.courseCode)}
                    >
                      <VStack align="start" spacing="4">
                        <Text fontSize="lg" fontWeight="bold">
                          {course.courseName}
                        </Text>
                        <Text fontSize="sm">
                          <strong>Course Code:</strong> {course.courseCode}
                        </Text>
                        <Text fontSize="sm">
                          <strong>Semester:</strong> {course.semester}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default StudentDashboard;
