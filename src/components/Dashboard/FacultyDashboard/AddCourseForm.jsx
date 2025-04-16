import React, { useState, useContext } from "react";
import { VStack, Input, Button, useToast, useColorModeValue } from "@chakra-ui/react";
import { AuthContext } from "../../../context/AuthContext";

const AddCourseForm = ({ handleAddCourse }) => {
  const { userId } = useContext(AuthContext); // Get the logged-in faculty's ID
  const toast = useToast();
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    facultyIds: [userId], // Automatically include the logged-in faculty's ID
  });

  // Dynamic colors for light/dark mode
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure no fields are empty
    if (!newCourse.courseCode || !newCourse.courseName || !newCourse.semester) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Convert semester to an integer before sending it to the backend
    const formattedCourse = {
      ...newCourse,
      semester: parseInt(newCourse.semester, 10), // Ensure semester is an integer
    };

    handleAddCourse(formattedCourse); // Pass the course data to the parent handler
    setNewCourse({ courseCode: "", courseName: "", semester: "", facultyIds: [userId] }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing="4">
        <Input
          placeholder="Course Code"
          value={newCourse.courseCode}
          onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })}
          bg={inputBg}
          borderColor={inputBorder}
          focusBorderColor="teal.500"
        />
        <Input
          placeholder="Course Name"
          value={newCourse.courseName}
          onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
          bg={inputBg}
          borderColor={inputBorder}
          focusBorderColor="teal.500"
        />
        <Input
          placeholder="Semester"
          type="number" // Ensure the input is a number
          value={newCourse.semester}
          onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
          bg={inputBg}
          borderColor={inputBorder}
          focusBorderColor="teal.500"
        />
        <Button type="submit" colorScheme="teal">
          Add Course
        </Button>
      </VStack>
    </form>
  );
};

export default AddCourseForm;