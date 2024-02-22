import sequelize from "./src/config/db.config.js";
import express from "express";
import userRouter from "./src/routes/user.routes.js"
import cors from "cors"

const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);


sequelize
  .sync({ force: false }) 
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("An error occurred while synchronizing models:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
