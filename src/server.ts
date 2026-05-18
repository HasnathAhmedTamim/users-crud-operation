import express from "express";
const app = express();
const port = 3000;

app.get("/user", (req, res) => {
  res.send("Express Server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
