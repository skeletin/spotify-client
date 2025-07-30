import { Button, Container } from "@chakra-ui/react";

const Home = () => {
  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/auth/login", {
      credentials: "include",
    });
    const data = await response.json();
    window.location.href = data.redirect_to;
  };
  return (
    <Container>
      <Button onClick={handleLogin}>Login</Button>
    </Container>
  );
};

export default Home;
