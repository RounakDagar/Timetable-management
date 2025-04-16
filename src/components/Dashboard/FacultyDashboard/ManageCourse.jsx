import React, { useState } from "react";
import { VStack, Input, Button, Textarea } from "@chakra-ui/react";

const ManageCourse = ({ selectedCourse, handleEnrollStudents, handleDropStudent }) => {
  const [studentIds, setStudentIds] = useState("");
  const [studentIdToDrop, setStudentIdToDrop] = useState("");

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    handleEnrollStudents(studentIds);
    setStudentIds("");
  };

  const handleDropSubmit = (e) => {
    e.preventDefault();
    handleDropStudent(studentIdToDrop);
    setStudentIdToDrop("");
  };

  return (
    <VStack spacing="6" mt="6">
      <form onSubmit={handleEnrollSubmit}>
        <Textarea
          placeholder="Enter student IDs (comma-separated)"
          value={studentIds}
          onChange={(e) => setStudentIds(e.target.value)}
        />
        <Button type="submit" colorScheme="teal">
          Enroll Students
        </Button>
      </form>

      <form onSubmit={handleDropSubmit}>
        <Input
          placeholder="Enter Student ID to Drop"
          value={studentIdToDrop}
          onChange={(e) => setStudentIdToDrop(e.target.value)}
        />
        <Button type="submit" colorScheme="red">
          Drop Student
        </Button>
      </form>
    </VStack>
  );
};

export default ManageCourse;