import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use(express.text()); // Middleware to parse text request bodiesD
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
  // Extract user data from the request body
  const { name, email, password } = req.body;
  //   console.log(body);

  // Implementation for creating a user
  res.status(201).json({
    message: "User created successfully",
    data: { name, email },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
