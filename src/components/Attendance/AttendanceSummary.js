import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const AttendanceSummary = () => {
  const { studentId, courseCode } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic colors for light/dark mode
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const progressColor = useColorModeValue("teal.500", "teal.300");

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/timetables/attendance-summary/${studentId}/${courseCode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data);
      } catch (err) {
        setError("Failed to fetch attendance summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [studentId, courseCode]);

  const calculateAttendancePercentage = (totalClasses, attendedClasses) => {
    return totalClasses > 0
      ? Math.round((attendedClasses / totalClasses) * 100)
      : 0;
  };

  const calculateClassesRequired = (totalClasses, attendedClasses) => {
    if (totalClasses === 0) return 0;

    const requiredAttendance = 0.75 * totalClasses;
    if (attendedClasses >= requiredAttendance) {
      return 0; // Already above 75%
    }

    const remainingClasses = Math.ceil(
      (requiredAttendance - attendedClasses) / 0.25
    );
    return remainingClasses;
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

  const attendancePercentage = calculateAttendancePercentage(
    summary.totalClasses,
    summary.attendedClasses
  );

  const classesRequired = calculateClassesRequired(
    summary.totalClasses,
    summary.attendedClasses
  );

  return (
    <MotionBox
      maxW="lg"
      mx="auto"
      p="6"
      bg={bg}
      color={textColor}
      boxShadow="lg"
      borderRadius="md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Heading size="lg" mb="6" color="teal.500" textAlign="center">
        Attendance Summary
      </Heading>
      <VStack spacing="6" align="center">
        {/* Circular Progress Bar */}
        <CircularProgress
          value={attendancePercentage}
          color={progressColor}
          size="120px"
          thickness="10px"
        >
          <CircularProgressLabel fontSize="lg" fontWeight="bold">
            {attendancePercentage}%
          </CircularProgressLabel>
        </CircularProgress>

        {/* Attendance Details */}
        <VStack align="start" spacing="4" w="full">
          <Text fontSize="lg">
            <strong>Student ID:</strong> {summary.studentId}
          </Text>
          <Text fontSize="lg">
            <strong>Course Code:</strong> {summary.courseCode}
          </Text>
          <Text fontSize="lg">
            <strong>Total Classes:</strong> {summary.totalClasses}
          </Text>
          <Text fontSize="lg">
            <strong>Attended Classes:</strong> {summary.attendedClasses}
          </Text>
          <Text fontSize="lg" color={classesRequired === 0 ? "green.500" : "red.500"}>
            {classesRequired === 0
              ? "You already have 75% or more attendance."
              : `You need to attend ${classesRequired} more class${
                  classesRequired > 1 ? "es" : ""
                } to reach 75% attendance.`}
          </Text>
        </VStack>
      </VStack>
    </MotionBox>
  );
};

export default AttendanceSummary;