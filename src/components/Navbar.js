import React, { useContext } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Link,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, userName, loading } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode(); // For dark mode toggle
  const bgGradient = useColorModeValue(
    "linear(to-r, teal.500, green.500)",
    "linear(to-r, black.700, black.900)"
  );
  const menuBg = useColorModeValue("white", "gray.800");
  const menuHoverBg = useColorModeValue("teal.100", "gray.700");
  const textColor = useColorModeValue("black", "white");

  if (loading) {
    return null;
  }

  return (
    <Box bgGradient={bgGradient} px={4} py={3} color="white" boxShadow="md">
      <Flex justify="space-between" align="center">
        {/* Logo or Title */}
        <Text fontSize="xl" fontWeight="bold" letterSpacing="wide">
          TimeTable Management
        </Text>

        {/* Navigation Links */}
        <HStack spacing="6">
          {/* Dark Mode Toggle */}
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            aria-label="Toggle Dark Mode"
            bg="transparent"
            _hover={{ bg: "teal.600" }}
          />

          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  bg="transparent"
                  _hover={{ bg: "teal.600" }}
                  _active={{ bg: "teal.700" }}
                >
                  <HStack spacing="2">
                    <Avatar size="sm" name={userName} />
                    <Text>{userName}</Text>
                  </HStack>
                </MenuButton>
                <MenuList bg={menuBg} color={textColor}>
                  <MenuItem
                    _hover={{ bg: menuHoverBg }}
                    onClick={logout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                _hover={{ textDecoration: "none", color: "teal.200" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                _hover={{ textDecoration: "none", color: "teal.200" }}
              >
                Signup
              </Link>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
