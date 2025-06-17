import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Flex,
  Link,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const toast = useToast();

  // Dynamic colors for dark mode
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", credentials, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.message === "Successfully Logged In" && data.role) {
        login(data.token, data.role, data.name, data.userId);
        toast({
          title: "Login successful!",
          description: "Redirecting to your dashboard...",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate(data.role === "STUDENT" ? "/student-dashboard" : "/faculty-dashboard");
        }, 1000);
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Unknown error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.error || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      w="100vw"
      align="center"
      justify="center"
      bgGradient={useColorModeValue("linear(to-r, teal.500, green.500)", "linear(to-r, gray.500, black.900)")}
      overflow="hidden"
      position="fixed"
    >
      <MotionBox
        maxW="md"
        w="full"
        p="8"
        bg={bg}
        color={textColor}
        boxShadow="lg"
        borderRadius="lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading mb="6" textAlign="center" color="teal.500">
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing="4">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleChange}
                bg={inputBg}
                borderColor={inputBorder}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                bg={inputBg}
                borderColor={inputBorder}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
        <Flex justify="space-between" mt="4">
          <Link color="teal.500" href="/signup">
            Sign Up
          </Link>
          <Link color="teal.500" href="/forgot-password">
            Forgot Password?
          </Link>
        </Flex>
      </MotionBox>
    </Flex>
  );
};

export default Login;
