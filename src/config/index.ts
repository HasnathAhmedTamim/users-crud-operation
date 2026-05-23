import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTION_STRING as string,
  port: process.env.PORT,
  secretKey: process.env.JWT_SECRET,
  refresh_secretKey: process.env.JWT_REFRESH_SECRET,
};
export default config;
