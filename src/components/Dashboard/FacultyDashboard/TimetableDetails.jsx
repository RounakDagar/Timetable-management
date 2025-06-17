import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Checkbox,
  Input,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";

const TimetableDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Retrieve timetable details from navigation state
  const { timetable } = location.state || {};

  // State for attendance and other features
  const [attendanceData, setAttendanceData] = useState(
    timetable?.students.map((student) => ({
      studentId: student.studentId,
      name: student.name,
      attended: false,
    })) || []
  );
  const [defaulters, setDefaulters] = useState([]);
  const [defaultersAttendance, setDefaultersAttendance] = useState({});
  const [studentEmail, setStudentEmail] = useState("");
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  if (!timetable) {
    return (
      <Box textAlign="center" mt="20">
        <Text>No timetable details available.</Text>
        <Button mt="4" colorScheme="teal" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  const handleMarkAttendance = async () => {
    try {
      const requestPayload = {
        timetableId: timetable.id,
        attendances: attendanceData.map((entry) => ({
          studentId: entry.studentId,
          attended: entry.attended,
        })),
      };

      await axios.put("http://localhost:8080/timetables/mark-batch", requestPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast({
        title: "Attendance Marked",
        description: "Attendance has been successfully marked for the class.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refetch defaulters to update their attendance
      fetchDefaulters();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchDefaulters = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/timetables/defaulters/${timetable.course.courseCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setDefaulters(data); // Set the defaulters list (emails) from the backend
        toast({
          title: "Defaulters Fetched",
          description: "Defaulters list has been updated.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });

        // Fetch attendance summary for each defaulter
        const attendancePromises = data.map(async (email) => {
          const attendanceResponse = await fetch(
            `http://localhost:8080/timetables/attendance-summary/${email}/${timetable.course.courseCode}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const attendanceData = await attendanceResponse.json();
          console.log(`Attendance for ${email}:`, attendanceData); // Log the response
          return { email, ...attendanceData };
        });

        const attendanceResults = await Promise.all(attendancePromises);
        const attendanceMap = {};
        attendanceResults.forEach((result) => {
          attendanceMap[result.email] = {
            totalClasses: result.totalClasses || 0,
            attendedClasses: result.attendedClasses || 0,
            attendancePercentage: result.attendancePercentage || 0,
          };
        });
        setDefaultersAttendance(attendanceMap);
      } else {
        const message = await response.text();
        setDefaulters([]); // Set an empty array if no defaulters are found
        toast({
          title: "No Defaulters",
          description: message, // Display the string message from the backend
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching defaulters:", error);
      toast({
        title: "Error",
        description: "Failed to fetch defaulters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchAttendanceSummary = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/timetables/attendance-summary/${studentEmail}/${timetable.course.courseCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setAttendanceSummary(data);
      toast({
        title: "Attendance Summary Fetched",
        description: "Attendance summary has been updated.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance summary.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTimetable = async () => {
    try {
      await axios.delete(`http://localhost:8080/timetables/${timetable.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast({
        title: "Timetable Deleted",
        description: "The timetable has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(-1); // Navigate back after deletion
    } catch (error) {
      console.error("Error deleting timetable:", error);
      toast({
        title: "Error",
        description: "Failed to delete the timetable. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const calculateAttendancePercentage = (totalClasses, attendedClasses) => {
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
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
        
      </Button>

      {/* Timetable Details */}
      <Card mb="6">
        <CardHeader>
          <Heading size="lg" color="teal.600">
            Timetable Details
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack align="start" spacing="4">
            <Text>
              <Badge colorScheme="teal" mr="2">
                Time Slot
              </Badge>
              {timetable.timeSlot}
            </Text>
            <Text>
              <Badge colorScheme="teal" mr="2">
                Venue
              </Badge>
              {timetable.venue}
            </Text>
            <Text>
              <Badge colorScheme="teal" mr="2">
                Course
              </Badge>
              {timetable.course?.courseName || "N/A"}
            </Text>
            <Text>
              <Badge colorScheme="teal" mr="2">
                Faculty
              </Badge>
              {timetable.faculty?.name || "N/A"}
            </Text>
          </VStack>
        </CardBody>
      </Card>

      <Divider mb="6" />

      {/* Mark Attendance */}
      <Card mb="6">
        <CardHeader>
          <Heading size="md" color="teal.600">
            Mark Attendance
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack align="start" spacing="4">
            {attendanceData.map((student, index) => (
              <HStack key={student.studentId} w="full" justify="space-between">
                <Text>
                  {student.name} ({student.studentId})
                </Text>
                <Checkbox
                  isChecked={student.attended}
                  onChange={(e) =>
                    setAttendanceData((prev) =>
                      prev.map((entry, i) =>
                        i === index ? { ...entry, attended: e.target.checked } : entry
                      )
                    )
                  }
                >
                  Attended
                </Checkbox>
              </HStack>
            ))}
            <Button colorScheme="teal" onClick={handleMarkAttendance}>
              Submit Attendance
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Divider mb="6" />

      {/* Defaulters */}
      <Card mb="6">
        <CardHeader>
          <Heading size="md" color="teal.600">
            Defaulters
          </Heading>
        </CardHeader>
        <CardBody>
          <Button onClick={fetchDefaulters} mb="4" colorScheme="teal">
            Fetch Defaulters
          </Button>
          {defaulters.length > 0 ? (
            <VStack align="start" spacing="4">
              {defaulters.map((email) => {
                const attendance = defaultersAttendance[email];
                return (
                  <HStack key={email} w="full" justify="space-between">
                    <Text>{email}</Text>
                    {attendance ? (
                      <CircularProgress
                        value={attendance.attendancePercentage}
                        color="teal.500"
                        size="50px"
                        thickness="8px"
                      >
                        <CircularProgressLabel>
                          {attendance.attendancePercentage}%
                        </CircularProgressLabel>
                      </CircularProgress>
                    ) : (
                      <Text>Loading...</Text>
                    )}
                  </HStack>
                );
              })}
            </VStack>
          ) : (
            <Text>No defaulters found.</Text>
          )}
        </CardBody>
      </Card>

      <Divider mb="6" />

      {/* Attendance Summary */}
      <Card>
        <CardHeader>
          <Heading size="md" color="teal.600">
            Attendance Summary
          </Heading>
        </CardHeader>
        <CardBody>
          <HStack mb="4">
            <Input
              placeholder="Enter Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              focusBorderColor="teal.500"
            />
            <Button onClick={fetchAttendanceSummary} colorScheme="teal">
              Fetch Summary
            </Button>
          </HStack>
          {attendanceSummary && (
            <VStack align="center" spacing="6">
              <CircularProgress
                value={calculateAttendancePercentage(
                  attendanceSummary.totalClasses,
                  attendanceSummary.attendedClasses
                )}
                color="teal.500"
                size="120px"
                thickness="10px"
              >
                <CircularProgressLabel>
                  {calculateAttendancePercentage(
                    attendanceSummary.totalClasses,
                    attendanceSummary.attendedClasses
                  )}
                  %
                </CircularProgressLabel>
              </CircularProgress>
              <VStack align="start">
                <Text>
                  <strong>Total Classes:</strong> {attendanceSummary.totalClasses}
                </Text>
                <Text>
                  <strong>Attended Classes:</strong> {attendanceSummary.attendedClasses}
                </Text>
              </VStack>
            </VStack>
          )}
        </CardBody>
      </Card>

      <Button
        colorScheme="red"
        onClick={handleDeleteTimetable}
        mb="6"
      >
        Delete Timetable
      </Button>
    </Box>
  );
};

export default TimetableDetails;