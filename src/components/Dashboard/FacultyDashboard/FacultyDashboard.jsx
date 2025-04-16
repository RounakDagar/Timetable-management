import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import {
  Box,
  HStack,
  Heading,
  useToast,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import TimetableView from "./TimetableView";
import CourseView from "./CourseView";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const FacultyDashboard = () => {
  const { userId, token } = useContext(AuthContext);
  // eslint-disable-next-line 
  const [view, setView] = useState("timetable"); 
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndTimetable = async () => {
      try {
        setLoading(true);
        // Fetch courses
        const coursesResponse = await axios.get(`http://localhost:8080/courses/faculty/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(coursesResponse.data);

        // Fetch timetable
        const timetableResponse = await axios.get(
          `http://localhost:8080/timetables/faculty/day/${daysOfWeek[selectedDayIndex]}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTimetable(timetableResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleTimetableClick = (entry) => {
    navigate(`/timetable-details/${entry.id}`, { state: { timetable: entry } });
  };

  const handleDeleteCourse = async (courseCode) => {
    try {
      await axios.delete(`http://localhost:8080/courses/delete/${courseCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((course) => course.courseCode !== courseCode));
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete the course. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddCourse = async (newCourse) => {
    try {
      const response = await axios.post("http://localhost:8080/courses/add", newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => [...prev, response.data]);
      toast({
        title: "Course Added",
        description: "The course has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "Error",
        description: "Failed to add the course. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddTimetable = async (newTimetable) => {
    try {
      const response = await axios.post("http://localhost:8080/timetables/add", newTimetable, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimetable((prev) => [...prev, response.data]);
      toast({
        title: "Timetable Added",
        description: "The timetable has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding timetable:", error);
      const errorMessage =
        error.response?.data || "Failed to add the timetable. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" color="teal.500" />
        <Text mt="4">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" p="6">
      <VStack spacing="6" align="stretch">
        <HStack justify="space-between">
          <Heading size="lg" color="teal.500">
            Faculty Dashboard
          </Heading>
          
        </HStack>

        <Tabs variant="enclosed" colorScheme="teal">
  <TabList>
    <Tab
      _hover={{
        bg: "teal.500", // Change hover background color to blue
        color: "white", // Change text color to white
      }}
    >
      Timetable
    </Tab>
    <Tab
      _hover={{
        bg: "teal.500", // Change hover background color to purple
        color: "white", // Change text color to white
      }}
    >
      Courses
    </Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <TimetableView
        timetable={timetable}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={setSelectedDayIndex}
        handleTimetableClick={handleTimetableClick}
      />
    </TabPanel>
    <TabPanel>
      <CourseView
        courses={courses}
        handleDeleteCourse={handleDeleteCourse}
        handleAddCourse={handleAddCourse}
        handleAddTimetable={handleAddTimetable}
      />
    </TabPanel>
  </TabPanels>
</Tabs>
      </VStack>
    </Box>
  );
};

export default FacultyDashboard;