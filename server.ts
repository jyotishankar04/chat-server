import app from "./src/app";

const startServer = () => {
  const port = 3000;
  app.listen(port, () => {
    console.log("Server is running at port " + port);
  });
};
startServer();
