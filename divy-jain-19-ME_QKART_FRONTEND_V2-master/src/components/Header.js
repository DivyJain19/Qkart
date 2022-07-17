import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Item } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";
const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);
  // let loggedIn = false;
  // let loggedOut = false;
  // if (localStorage.getItem("username")) {
  //   loggedIn = true;
  // } else {
  //   loggedOut = true;
  // }

  // } else
  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box
          className="header-title"
          onClick={() => {
            history.push("/products");
          }}
        >
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      </Box>
    );
  }
  return (
    <Box className="header">
      <Box
        className="header-title"
        onClick={() => {
          history.push("/products");
        }}
      >
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children}
      {localStorage.getItem("username") ? (
        <Stack direction="row" spacing={2}>
          <Avatar alt={username} src="avatar.png" />
          <p className="username-text" style={{marginLeft:"14px" , marginTop:"10px"}}>{username}</p>
          <Button
            variant="text"
            onClick={() => {
              localStorage.clear();
              history.push("/products");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
