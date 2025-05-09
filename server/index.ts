import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try to serve the app on port 5000, but use alternate ports if needed
  // This serves both the API and the client
  let port = parseInt(process.env.PORT || '5000', 10);
  const maxPortAttempts = 10;
  let attempts = 0;
  
  function startServer(currentPort: number) {
    server.listen({
      port: currentPort,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${currentPort}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE' && attempts < maxPortAttempts) {
        attempts++;
        const newPort = port + attempts;
        log(`Port ${currentPort} is in use, trying ${newPort}...`);
        startServer(newPort);
      } else {
        log(`Failed to start server: ${err.message}`);
      }
    });
  }
  
  startServer(port);
})();
