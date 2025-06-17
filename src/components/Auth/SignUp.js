import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Flex,
  useToast,
  RadioGroup,
  Radio,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP Verification
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT", // Default role
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false); // State for resend OTP button
  const toast = useToast();
  const navigate = useNavigate();

  // Dynamic colors for dark mode
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate password length
    if (credentials.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be greater than or equal to 8 characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return; // Stop form submission
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/signup", credentials);
      toast({
        title: "Registration successful!",
        description: response.data || "Check your email for the OTP.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setStep(2); // Move to OTP verification step
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.response?.data || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/verify-signup", {
        email: credentials.email,
        otp,
      });

      const { role, name, message, token } = response.data; // Destructure backend response

      if (message.includes("OTP verified")) {
        toast({
          title: "Verification successful!",
          description: message, // Display the backend message
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Save token, role, and name in localStorage or context
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);

        // Redirect to the appropriate dashboard based on role
        setTimeout(() => {
          navigate(role === "STUDENT" ? "/student-dashboard" : "/faculty-dashboard");
        }, 1000); // Wait for the toast to finish before redirecting
      } else {
        toast({
          title: "Verification failed",
          description: message, // Display the backend message
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: typeof error.response?.data === "string" 
          ? error.response.data 
          : "Invalid OTP. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const response = await axios.get("http://localhost:8080/auth/getOtp", {
        params: { email: credentials.email }, // Send email as a query parameter
      });

      toast({
        title: "OTP Resent",
        description: response.data || "A new OTP has been sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Resend OTP",
        description: typeof error.response?.data === "string" 
          ? error.response.data 
          : "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      w="100vw"
      align="center"
      justify="center"
      bgGradient={useColorModeValue("linear(to-r, teal.500, green.500)", "linear(to-r, gray.700, gray.900)")}
      overflow="hidden"
      position="fixed"
    >
      <Box
        maxW="md"
        w="full"
        p="8"
        bg={bg}
        color={textColor}
        boxShadow="lg"
        borderRadius="lg"
      >
        {step === 1 ? (
          <>
            <Heading mb="6" textAlign="center" color="teal.500">
              Sign Up
            </Heading>
            <form onSubmit={handleRegister}>
              <VStack spacing="4">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={credentials.name}
                    onChange={handleChange}
                    bg={inputBg}
                    borderColor={inputBorder}
                    focusBorderColor="teal.500"
                  />
                </FormControl>
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
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <RadioGroup
                    name="role"
                    value={credentials.role}
                    onChange={(value) => setCredentials({ ...credentials, role: value })}
                  >
                    <HStack spacing="4">
                      <Radio value="STUDENT">Student</Radio>
                      <Radio value="FACULTY">Faculty</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </VStack>
            </form>
          </>
        ) : (
          <>
            <Heading mb="6" textAlign="center" color="teal.500">
              Verify OTP
            </Heading>
            <form onSubmit={handleVerifyOtp}>
              <VStack spacing="4">
                <FormControl isRequired>
                  <FormLabel>OTP</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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
                  Verify OTP
                </Button>
                <Button
                  variant="link"
                  colorScheme="teal"
                  isLoading={isResending}
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </Button>
              </VStack>
            </form>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default SignUp;