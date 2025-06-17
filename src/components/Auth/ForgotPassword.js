import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP and Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Dynamic colors for light/dark mode
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  // Handle sending OTP
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.get("http://localhost:8080/auth/getOtp", {
        params: { email },
      });
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setStep(2); // Move to Step 2
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || "Failed to send OTP. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting the password
  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put("http://localhost:8080/auth/forgot-password", {
        email,
        otp,
        password: newPassword,
      });

      const message = response.data; // Backend response message
      console.log("Backend Response:", message); // Log the response to verify its content

      // Check if the message contains the success text
      if (message.toLowerCase().includes("password changed")) {
        toast({
          title: "Success",
          description: message, // Display the backend message
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to login page after showing the toast
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Wait for the toast to finish before redirecting
      } else {
        toast({
          title: "Error",
          description: "Unexpected response from the server.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || "Failed to reset password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="10"
      p="6"
      bg={bg}
      color={textColor}
      boxShadow="lg"
      borderRadius="md"
    >
      <Heading size="lg" mb="6" textAlign="center" color="teal.500">
        Forgot Password
      </Heading>
      {step === 1 ? (
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={inputBg}
              borderColor={inputBorder}
              focusBorderColor="teal.500"
            />
          </FormControl>
          <Button
            colorScheme="teal"
            width="full"
            isLoading={isLoading}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        </VStack>
      ) : (
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={inputBg}
              borderColor={inputBorder}
              focusBorderColor="teal.500"
            />
          </FormControl>
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
          <FormControl isRequired>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              bg={inputBg}
              borderColor={inputBorder}
              focusBorderColor="teal.500"
            />
          </FormControl>
          <Button
            colorScheme="teal"
            width="full"
            isLoading={isLoading}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default ForgotPassword;