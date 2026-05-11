import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import { pool } from "./db/pool";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'FishingScore API is running!',
    });
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            connected: true,
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            connected: false,
            message: 'Database connection failed'
        });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})