import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const CourseDetails = () => {
  const { courseCode } = useParams(); // Get courseCode from the URL
  const toast = useToast();
  const navigate = useNavigate();

  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [studentEmail, setStudentEmail] = useState(""); // For fetching attendance summary
  const [dropStudentEmail, setDropStudentEmail] = useState(""); // For dropping a student
  const [studentIds, setStudentIds] = useState(""); // For enrolling students
  const [enrolledStudents, setEnrolledStudents] = useState([]); // State for enrolled students
  const [isLoadingStudents, setIsLoadingStudents] = useState(false); // Loading state for fetching students

  useEffect(() => {
    // Fetch timetable for the course
    const fetchTimetable = async () => {
      try {
        const timetableResponse = await axios.get(
          `http://localhost:8080/timetables/course/${courseCode}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setTimetable(timetableResponse.data);
      } catch (error) {
        console.error("Error fetching timetable:", error);
        toast({
          title: "Error",
          description: "Failed to fetch timetable.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTimetable();
  }, [courseCode, toast]);

  useEffect(() => {
    // Fetch enrolled students for the course
    const fetchEnrolledStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/courses/${courseCode}/students`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setEnrolledStudents(response.data);
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
        toast({
          title: "Error",
          description: "Failed to fetch enrolled students.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchEnrolledStudents();
  }, [courseCode, toast]);

  const handleFetchAttendanceSummary = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/timetables/attendance-summary/${studentEmail}/${courseCode}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAttendanceSummary(response.data);
      toast({
        title: "Attendance Summary Fetched",
        description: "Attendance summary has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance summary. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEnrollStudents = async () => {
    try {
      // Split the input by commas, trim whitespace, and filter out empty values
      const studentIdArray = studentIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");

      if (studentIdArray.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please enter at least one valid student email.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Send the array of student IDs to the backend
      await axios.post(
        `http://localhost:8080/courses/${courseCode}/enroll`,
        studentIdArray, // Send as an array
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast({
        title: "Students Enrolled",
        description: "All students have been enrolled successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setStudentIds(""); // Clear the input field
    } catch (error) {
      console.error("Error enrolling students:", error);

      // Check if the backend provides a specific error message
      const errorMessage =
        error.response?.data || "Failed to enroll students. Please try again.";

      toast({
        title: "Error",
        description: errorMessage, // Display the backend's error message
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDropStudent = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/courses/${courseCode}/drop/${dropStudentEmail}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast({
        title: "Student Dropped",
        description: `The student with email ${dropStudentEmail} has been dropped from the course.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setDropStudentEmail(""); // Clear the input field
    } catch (error) {
      console.error("Error dropping student:", error);
      toast({
        title: "Error",
        description: "Failed to drop the student, Student is not Enrolled",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const calculateAttendancePercentage = () => {
    if (attendanceSummary) {
      const { totalClasses, attendedClasses } = attendanceSummary;
      return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
    }
    return 0;
  };

  return (
    <Box maxW="6xl" mx="auto" p="6">
      <Button
        leftIcon={<ArrowBackIcon />}
        colorScheme="teal"
        variant="solid"
        size="md"
        onClick={() => navigate(-1)}
        _hover={{ bg: "teal.600" }}
        _active={{ bg: "teal.700" }}
        transition="all 0.2s"
        mb="4"
      >
        Back
      </Button>
      <Heading size="lg" mb="6" color="teal.600">
        Course Details: {courseCode}
      </Heading>

      <Accordion allowToggle>
        {/* Attendance Summary */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold" color="teal.700">
              Attendance Summary
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HStack mb="4">
              <Input
                placeholder="Enter Student Email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                focusBorderColor="teal.500"
              />
              <Button onClick={handleFetchAttendanceSummary} colorScheme="teal">
                Fetch Summary
              </Button>
            </HStack>
            {attendanceSummary ? (
              <VStack align="center" spacing="6">
                <CircularProgress
                  value={calculateAttendancePercentage()}
                  color="teal.500"
                  size="120px"
                  thickness="10px"
                >
                  <CircularProgressLabel>
                    {calculateAttendancePercentage()}%
                  </CircularProgressLabel>
                </CircularProgress>
                <VStack align="start" spacing="4">
                  <Text fontSize="md" color="gray.700">
                    <strong>Student ID:</strong> {attendanceSummary.studentId}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Total Classes:</strong> {attendanceSummary.totalClasses}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Attended Classes:</strong> {attendanceSummary.attendedClasses}
                  </Text>
                </VStack>
              </VStack>
            ) : (
              <Text fontSize="md" color="gray.600">
                No attendance summary available.
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>

        {/* Timetable */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold" color="teal.700">
              Upcoming Timetable
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {timetable.length > 0 ? (
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Day</Th>
                    <Th>Time Slot</Th>
                    <Th>Venue</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {timetable.map((entry) => (
                    <Tr key={entry.id}>
                      <Td>{entry.day}</Td>
                      <Td>{entry.timeSlot}</Td>
                      <Td>{entry.venue}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text fontSize="md" color="gray.600">
                No upcoming timetable available.
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>

        {/* Enroll Students */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold" color="teal.700">
              Enroll Students
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HStack mb="4">
              <Input
                placeholder="Enter Student IDs (comma-separated)"
                value={studentIds}
                onChange={(e) => setStudentIds(e.target.value)}
                focusBorderColor="teal.500"
              />
              <Button onClick={handleEnrollStudents} colorScheme="teal">
                Enroll
              </Button>
            </HStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Drop Student */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold" color="red.600">
              Drop Student
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HStack mb="4">
              <Input
                placeholder="Enter Student Email"
                value={dropStudentEmail}
                onChange={(e) => setDropStudentEmail(e.target.value)}
                focusBorderColor="red.500"
              />
              <Button onClick={handleDropStudent} colorScheme="red">
                Drop Student
              </Button>
            </HStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Enrolled Students */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold" color="teal.700">
              Enrolled Students
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {isLoadingStudents ? (
              <Text>Loading...</Text>
            ) : enrolledStudents.length > 0 ? (
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Student ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {enrolledStudents.map((student) => (
                    <Tr key={student.id}>
                      <Td>{student.id}</Td>
                      <Td>{student.name}</Td>
                      <Td>{student.email}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No students are enrolled in this course.</Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default CourseDetails;