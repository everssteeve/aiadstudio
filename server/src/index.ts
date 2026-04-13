import express from 'express';
import cors from 'cors';
import { projectsRouter } from './routes/projects.js';
import { intentsRouter } from './routes/intents.js';
import { specsRouter } from './routes/specs.js';
import { issuesRouter } from './routes/issues.js';
import { agentsRouter } from './routes/agents.js';
import { contextRouter } from './routes/context.js';
import { authRouter } from './routes/auth.js';
import { errorMiddleware } from './middleware/error.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/intents', intentsRouter);
app.use('/api/specs', specsRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/context', contextRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
