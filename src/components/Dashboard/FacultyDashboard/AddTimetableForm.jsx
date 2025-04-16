import React, { useState, useEffect } from "react";
import {
  VStack,
  Input,
  Button,
  Select,
  useToast,
  HStack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddTimetableForm = ({ handleAddTimetable, courses }) => {
  const toast = useToast();
  const [newTimetable, setNewTimetable] = useState({
    day: "Monday",
    startTime: "",
    endTime: "",
    venue: "",
    courseCode: "",
  });
  const [availableVenues, setAvailableVenues] = useState([]);

  useEffect(() => {
    // Fetch available venues when day, startTime, or endTime changes
    const fetchAvailableVenues = async () => {
      if (newTimetable.day && newTimetable.startTime && newTimetable.endTime) {
        const timeSlot = `${newTimetable.startTime} - ${newTimetable.endTime}`;
        try {
          const response = await axios.get(
            `http://localhost:8080/timetables/available-venues`,
            {
              params: {
                day: newTimetable.day,
                timeSlot,
              },
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setAvailableVenues(response.data);
        } catch (error) {
          console.error("Error fetching available venues:", error);
          toast({
            title: "Error",
            description: "Failed to fetch available venues.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchAvailableVenues();
  }, [newTimetable.day, newTimetable.startTime, newTimetable.endTime, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure all fields are filled
    if (!newTimetable.day || !newTimetable.startTime || !newTimetable.endTime || !newTimetable.venue || !newTimetable.courseCode) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Combine startTime and endTime into a single timeSlot string
    const formattedTimetable = {
      day: newTimetable.day,
      timeSlot: `${newTimetable.startTime} - ${newTimetable.endTime}`,
      venue: newTimetable.venue,
      course: { courseCode: newTimetable.courseCode }, // Send courseCode as part of the course object
    };

    handleAddTimetable(formattedTimetable); // Pass the formatted data to the parent handler
    setNewTimetable({ day: "Monday", startTime: "", endTime: "", venue: "", courseCode: "" }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing="4">
        {/* Day Selector */}
        <Select
          value={newTimetable.day}
          onChange={(e) => setNewTimetable({ ...newTimetable, day: e.target.value })}
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </Select>

        {/* Start Time and End Time */}
        <HStack spacing="4">
          <Input
            type="time"
            placeholder="Start Time"
            value={newTimetable.startTime}
            onChange={(e) => setNewTimetable({ ...newTimetable, startTime: e.target.value })}
          />
          <Input
            type="time"
            placeholder="End Time"
            value={newTimetable.endTime}
            onChange={(e) => setNewTimetable({ ...newTimetable, endTime: e.target.value })}
          />
        </HStack>

        {/* Course Selector */}
        <Select
          placeholder="Select Course"
          value={newTimetable.courseCode}
          onChange={(e) => setNewTimetable({ ...newTimetable, courseCode: e.target.value })}
        >
          {courses.map((course) => (
            <option key={course.courseCode} value={course.courseCode}>
              {course.courseName} ({course.courseCode})
            </option>
          ))}
        </Select>

        {/* Venue Selector */}
        <Text fontSize="sm" color="gray.600">
          Please select the time and course to view available venues.
        </Text>
        <Select
          placeholder="Select Venue"
          value={newTimetable.venue}
          onChange={(e) => setNewTimetable({ ...newTimetable, venue: e.target.value })}
          isDisabled={!newTimetable.startTime || !newTimetable.endTime || !newTimetable.courseCode}
        >
          {availableVenues.map((venue) => (
            <option key={venue} value={venue}>
              {venue}
            </option>
          ))}
        </Select>

        <Button type="submit" colorScheme="teal">
          Add Timetable
        </Button>
      </VStack>
    </form>
  );
};

export default AddTimetableForm;