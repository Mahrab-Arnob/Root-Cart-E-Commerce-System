import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { addAddress, getUserAddresses } from "../controllers/address.controller.js";
const addressRouter = express.Router();
addressRouter.post("/add", isAuth, addAddress);
addressRouter.get("/get", isAuth, getUserAddresses);
export default addressRouter;
