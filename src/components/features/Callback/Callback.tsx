import { Button, Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    fetch(`http://localhost:3000/auth/callback?code=${code}&state=${state}`)
      .then((res) => res.json())
      .then((data: SpotifyApiResponse) => {
        console.log(data);
        localStorage.setItem("token", data.accessToken);
      });
  }, [code, state]);

  const showInfo = () => {
    fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <Container className="">
      <Button onClick={showInfo}>Get my information</Button>
    </Container>
  );
};

export default Callback;
