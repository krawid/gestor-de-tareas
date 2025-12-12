import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertListSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      // Validar y transformar los datos del body
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  app.get("/api/lists", async (_req, res) => {
    try {
      const lists = await storage.getLists();
      res.json(lists);
    } catch (error) {
      console.error("Error fetching lists:", error);
      res.status(500).json({ error: "Failed to fetch lists", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/lists/:id", async (req, res) => {
    try {
      const list = await storage.getList(req.params.id);
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch list" });
    }
  });

  app.post("/api/lists", async (req, res) => {
    try {
      const validatedData = insertListSchema.parse(req.body);
      // Normalize empty description to undefined (will be stored as NULL in DB)
      if (validatedData.description !== undefined && (!validatedData.description || !validatedData.description.trim())) {
        validatedData.description = undefined;
      }
      const list = await storage.createList(validatedData);
      res.status(201).json(list);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating list:", error);
      res.status(500).json({ error: "Failed to create list", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/lists/:id", async (req, res) => {
    try {
      // Normalize empty description to undefined (will be stored as NULL in DB)
      if (req.body.description !== undefined && (!req.body.description || !req.body.description.trim())) {
        req.body.description = undefined;
      }
      const list = await storage.updateList(req.params.id, req.body);
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Failed to update list" });
    }
  });

  app.delete("/api/lists/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteList(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "List not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete list" });
    }
  });

  // Export all data
  app.get("/api/export", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      const lists = await storage.getLists();
      
      const exportData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        lists,
        tasks,
      };
      
      res.json(exportData);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ error: "Failed to export data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Import data
  app.post("/api/import", async (req, res) => {
    try {
      const { lists, tasks, mode } = req.body;
      
      // Validate mode
      if (mode !== "replace" && mode !== "merge") {
        return res.status(400).json({ error: "Invalid mode. Must be 'replace' or 'merge'" });
      }

      let importedLists = 0;
      let importedTasks = 0;

      // If replace mode, we would need to delete all existing data first
      // For now, we'll just implement merge mode
      if (mode === "replace") {
        return res.status(400).json({ error: "Replace mode not yet implemented. Use 'merge' mode." });
      }

      // Import lists
      if (Array.isArray(lists)) {
        for (const list of lists) {
          try {
            const validatedList = insertListSchema.parse({
              name: list.name,
              description: list.description,
              color: list.color,
            });
            await storage.createList(validatedList);
            importedLists++;
          } catch (error) {
            console.error("Error importing list:", error);
            // Continue with next list
          }
        }
      }

      // Import tasks
      if (Array.isArray(tasks)) {
        for (const task of tasks) {
          try {
            const validatedTask = insertTaskSchema.parse({
              title: task.title,
              description: task.description,
              completed: task.completed,
              priority: task.priority,
              listId: task.listId,
              dueDate: task.dueDate,
            });
            await storage.createTask(validatedTask);
            importedTasks++;
          } catch (error) {
            console.error("Error importing task:", error);
            // Continue with next task
          }
        }
      }

      res.json({
        success: true,
        imported: {
          lists: importedLists,
          tasks: importedTasks,
        },
      });
    } catch (error) {
      console.error("Error importing data:", error);
      res.status(500).json({ error: "Failed to import data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
