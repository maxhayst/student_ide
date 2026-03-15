import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
const { setupWSConnection } = require('y-websocket/bin/utils');
import { SummonData, TelemetryData, LockdownData, HandRaiseData } from './types';
import { gitSync } from './services/gitSync';

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// Yjs WebSocket Server (CRDT sync)
const wss = new WebSocketServer({ server });
wss.on('connection', (ws, req) => {
    setupWSConnection(ws, req);
});


// Socket.io Server (summon, custom metrics)
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket: Socket) => {
    console.log(`[+] New client connected: ${socket.id}`);

    socket.on('join-project', (projectId: string, userRole: 'student' | 'teacher') => {
        socket.join(projectId);
        console.log(`User ${socket.id} (${userRole}) joined project ${projectId}`);

        socket.to(projectId).emit('user-joined', { id: socket.id, role: userRole });
    });

    socket.on('summon-students', (data: SummonData) => {
        console.log(`Summoning students in ${data.projectId} to ${data.fileId}:${data.lineNumber}`);

        socket.to(data.projectId).emit('force-redirect', {
            fileId: data.fileId,
            lineNumber: data.lineNumber
        });
    });

    socket.on('telemetry-update', (data: TelemetryData) => {
        socket.to(data.projectId).emit('student-telemetry', {
            studentId: socket.id,
            metrics: data.metrics
        });
    });

    socket.on('lockdown', (data: LockdownData) => {
        console.log(`Lockdown ${data.isLocked ? 'activated' : 'deactivated'} for project ${data.projectId}`);
        socket.to(data.projectId).emit('lockdown-status', data);
    });

    socket.on('hand-raise', (data: HandRaiseData) => {
        console.log(`Student ${data.studentId} raised hand in project ${data.projectId}`);
        socket.to(data.projectId).emit('student-hand-raise', data);
    });

    // Handle incoming manual or automated git sync requests
    socket.on('trigger-git-sync', async (data: { owner: string; repo: string; path: string; content: string }) => {
        console.log(`[GitSync] Syncing ${data.path} for ${data.owner}/${data.repo}`);
        try {
            await gitSync.autoCommit(data.owner, data.repo, data.path, data.content);
            // Could emit a success event back to the user here
        } catch (error) {
            console.error('[GitSync] Manual sync failed');
        }
    });

    socket.on('disconnect', () => {
        console.log(`[-] Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 DevRoom Socket Server running on port ${PORT}`);
});
