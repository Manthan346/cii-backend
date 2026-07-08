const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./prisma");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        await prisma.$connect();

        res.status(200).json({
            message: "Backend is running.",
            database: "Connected"
        });
    } catch (error) {
        res.status(500).json({
            message: "Database connection failed.",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/staff", async (req, res) => {
    try {
        const staff = await prisma.staffDetails.findMany();

        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

console.log(Object.keys(prisma));