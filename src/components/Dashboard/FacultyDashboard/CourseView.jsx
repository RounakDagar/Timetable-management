import React from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import AddCourseForm from "./AddCourseForm";
import AddTimetableForm from "./AddTimetableForm";

const CourseView = ({
  courses,
  handleDeleteCourse,
  handleAddCourse,
  handleAddTimetable,
}) => {
  const navigate = useNavigate();
  const { isOpen: isAddCourseOpen, onOpen: onAddCourseOpen, onClose: onAddCourseClose } =
    useDisclosure();
  const {
    isOpen: isAddTimetableOpen,
    onOpen: onAddTimetableOpen,
    onClose: onAddTimetableClose,
  } = useDisclosure();

  // Dynamic colors for light/dark mode
  const cardBg = useColorModeValue("teal.100", "teal.700");
  const cardHoverBg = useColorModeValue("teal.200", "teal.600");
  const cardTextColor = useColorModeValue("teal.800", "white");
  const modalBg = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Box>
      <HStack justify="space-between" mb="6">
        <Heading size="lg" color="teal.500">
          Your Courses
        </Heading>
        <HStack spacing="4">
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={onAddCourseOpen}
          >
            Add Course
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={onAddTimetableOpen}
          >
            Add Timetable
          </Button>
        </HStack>
      </HStack>

      {/* Course Cards */}
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
            onClick={() => navigate(`/course-details/${course.courseCode}`)}
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
              <HStack justify="flex-end" w="full">
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation on delete
                    handleDeleteCourse(course.courseCode);
                  }}
                  aria-label="Delete Course"
                />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Add Course Modal */}
      {isAddCourseOpen && (
        <Box
          mt="6"
          p="6"
          bg={modalBg} // Use the variable here
          borderRadius="md"
          boxShadow="md"
        >
          <Heading size="md" mb="4" color={headingColor}>
            Add Course
          </Heading>
          <AddCourseForm handleAddCourse={handleAddCourse} />
          <Button mt="4" onClick={onAddCourseClose} colorScheme="red">
            Close
          </Button>
        </Box>
      )}

      {/* Add Timetable Modal */}
      {isAddTimetableOpen && (
        <Box
          mt="6"
          p="6"
          bg={modalBg} // Use the variable here
          borderRadius="md"
          boxShadow="md"
        >
          <Heading size="md" mb="4" color={headingColor}>
            Add Timetable
          </Heading>
          <AddTimetableForm handleAddTimetable={handleAddTimetable} courses={courses} />
          <Button mt="4" onClick={onAddTimetableClose} colorScheme="red">
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CourseView;