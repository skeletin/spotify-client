const Home = () => {
  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/auth/login", {
      credentials: "include",
    });
    const data = await response.json();
    window.location.href = data.redirect_to;
  };
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Home;
