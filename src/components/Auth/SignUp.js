import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Flex,
  useToast,
  RadioGroup,
  Radio,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

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
  const toast = useToast();

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
      const response = await axios.post("http://localhost:8080/auth/verify-otp", {
        email: credentials.email,
        otp,
      });
      toast({
        title: "Verification successful!",
        description: response.data || "You can now log in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error.response?.data || "Invalid OTP. Please try again.",
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
              </VStack>
            </form>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default SignUp;