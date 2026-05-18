import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Express Server
app.get("/", (req: Request, res: Response) => {
  //   res.send("Express Server");
  res.status(200).json({
    message: "Express Server",
    authors: "Hasnath Ahmed",
  });
});

// Create User
app.post("/users", async (req: Request, res: Response) => {
  const result = req.body; // Assuming the user data is sent in the request body
  console.log(result);
  // Implementation for creating a user
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
