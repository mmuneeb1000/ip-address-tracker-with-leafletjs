import express from "express";
import { getLocation } from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getLocation);

export default router;
