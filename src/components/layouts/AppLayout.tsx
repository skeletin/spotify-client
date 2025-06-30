import { Container, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <Container h="full">
      <VStack>
        <Outlet />
      </VStack>
    </Container>
  );
};

export default AppLayout;
