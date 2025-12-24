import express from "express";
import { DataApiClient } from 'rqlite-js';
//requireing both sqlite and sqlite3 packages
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { format } from 'date-fns';
import {v4 as generatePassword} from 'uuid';
import cors from "cors";

import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.CLIENT_PORT)
const allowedOrigin = process.env.FRONTEND_URL || '*';

const corsOptions = {
  origin: allowedOrigin,
    credentials: true,
    optionsSuccessStatus: 200
};

const DB_VM_IP = '192.168.56.101'; 
const rqliteUrl = `http://${DB_VM_IP}:4001`;

// Initialize rqlite client
const client = new DataApiClient(rqliteUrl);

//setting path to database
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join( __dirname , '/taskListDatabase.db');
let db = null;

async function databaseSetup () {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(process.env.SERVER_PORT, '0.0.0.0',() => {
            console.log(`server listening on port ${process.env.SERVER_PORT}`)
        });
        console.log("database connected successfully");
    } catch (e) {
        console.log(e.message);
        process.exit(1)
    }
}

async function commanDatabaseSetup() {
    try {
        // 1. Verify connectivity to the rqlite server on the Database VM
        const status = await client.status();
        console.log("Connected to rqlite server successfully");

        // 2. Start the Express server
        const port = process.env.SERVER_PORT || 3000;
        app.listen(port, '0.0.0.0', () => {
            console.log(`Backend server listening on port ${port}`);
        });

    } catch (e) {
        console.error("Database connection failed. Ensure rqlited is running on the DB VM.");
        console.error("Error details:", e.message);
        process.exit(1);
    }
}

// databaseSetup();
commanDatabaseSetup();

const app = express();
app.use(express.json())
app.use(cors(corsOptions));

const convertSnakeCaseToCamalCase = (array) => {
    const newArray = array.map((eachItem) => {
        const {id, task_detail, last_date} = eachItem;
        const newItem = {
            id: eachItem.id,
            taskDetail: eachItem.task_detail,
            lastDate: eachItem.last_date
        }
        return newItem
    });
    return newArray;
}

app.get('/createTable', async (req, res) => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Task (
        id varchar(50),
        task_detail text,
        last_date date
    );`;
    // await db.exec(createTableQuery);
    await client.query(createTableQuery);
    console.log("table created successfully");
});

app.post('/insertData', async (req, res) => {
    const {taskDetail, lastDate} = req.body;
    const insertDataQuery = `
    INSERT INTO Task (id, task_detail, last_date)
    VALUES( '${generatePassword()}', '${taskDetail}', '${lastDate}');`;
    // await db.exec(insertDataQuery);
    await client.query(insertDataQuery);
    
    const bringAllQuery = `select * from Task order by last_date asc;`;
    // const data = await db.all(bringAllQuery);
    const data = await client.query(bringAllQuery);
    const updatedData = convertSnakeCaseToCamalCase(data);
    res.json(updatedData);
});

app.get('/printTable', async (req, res) => {
    const bringAllQuery = `select * from Task order by last_date asc;`;
    // const data = await db.all(bringAllQuery);
    const data = await client.query(bringAllQuery);
    const updatedData = convertSnakeCaseToCamalCase(data);
    res.json(updatedData);
});

app.put('/change/task/:taskId', async (req, res) => {
    const {taskId} = req.params;
    const {taskDetail, lastDate} = req.body;
    const updateTaskQuery = `
            UPDATE Task
        SET task_detail = '${taskDetail}',
            last_date = '${lastDate}'
        WHERE
            id = '${taskId}';`;
    // await db.run(updateTaskQuery);
    await client.query(updateTaskQuery);

    const bringAllQuery = `select * from Task order by last_date asc;`;
    // const data = await db.all(bringAllQuery);
    const data = await client.query(bringAllQuery);
    const updatedData = convertSnakeCaseToCamalCase(data);
    res.json(updatedData);
});

app.delete('/delete/task/:taskId', async (req, res) => {
    const {taskId} = req.params;
    const deleteTaskQuery = `
    DELETE FROM Task
    WHERE id = '${taskId}';`;
    // await db.run(deleteTaskQuery);
    await client.query(deleteTaskQuery);

    const bringAllQuery = `select * from Task order by last_date asc;`;
    // const data = await db.all(bringAllQuery);
    const data = await client.query(bringAllQuery);
    const updatedData = convertSnakeCaseToCamalCase(data);
    res.json(updatedData);
});