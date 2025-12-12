// Code from blueprint:javascript_database integration
import { tasks, lists, type Task, type InsertTask, type List, type InsertList } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  getLists(): Promise<List[]>;
  getList(id: string): Promise<List | undefined>;
  createList(list: InsertList): Promise<List>;
  updateList(id: string, list: Partial<List>): Promise<List | undefined>;
  deleteList(id: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private tasks: Task[] = [];
  private lists: List[] = [];
  private taskIdCounter = 1;
  private listIdCounter = 1;

  async getTasks(): Promise<Task[]> {
    return [...this.tasks];
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.find(task => task.id === id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task: Task = {
      ...insertTask,
      id: String(this.taskIdCounter++),
      description: insertTask.description ?? null,
      completed: insertTask.completed ?? false,
      priority: insertTask.priority ?? 0,
      dueDate: insertTask.dueDate ?? null,
      listId: insertTask.listId ?? null,
    };
    this.tasks.push(task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return undefined;
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  async deleteTask(id: string): Promise<boolean> {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    return true;
  }

  async getLists(): Promise<List[]> {
    return [...this.lists];
  }

  async getList(id: string): Promise<List | undefined> {
    return this.lists.find(list => list.id === id);
  }

  async createList(insertList: InsertList): Promise<List> {
    const list: List = {
      ...insertList,
      id: String(this.listIdCounter++),
      description: insertList.description ?? null,
      color: insertList.color ?? "#808080",
    };
    this.lists.push(list);
    return list;
  }

  async updateList(id: string, updates: Partial<List>): Promise<List | undefined> {
    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) return undefined;
    
    this.lists[index] = { ...this.lists[index], ...updates };
    return this.lists[index];
  }

  async deleteList(id: string): Promise<boolean> {
    // First, update all tasks that belong to this list to have no list
    this.tasks.forEach(task => {
      if (task.listId === id) {
        task.listId = null;
      }
    });
    
    // Then delete the list
    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) return false;
    
    this.lists.splice(index, 1);
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getTasks(): Promise<Task[]> {
    return await this.db.select().from(tasks);
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await this.db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await this.db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await this.db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getLists(): Promise<List[]> {
    return await this.db.select().from(lists);
  }

  async getList(id: string): Promise<List | undefined> {
    const [list] = await this.db.select().from(lists).where(eq(lists.id, id));
    return list || undefined;
  }

  async createList(insertList: InsertList): Promise<List> {
    const [list] = await this.db
      .insert(lists)
      .values(insertList)
      .returning();
    return list;
  }

  async updateList(id: string, updates: Partial<List>): Promise<List | undefined> {
    const [list] = await this.db
      .update(lists)
      .set(updates)
      .where(eq(lists.id, id))
      .returning();
    return list || undefined;
  }

  async deleteList(id: string): Promise<boolean> {
    // First, update all tasks that belong to this list to have no list
    await this.db
      .update(tasks)
      .set({ listId: null })
      .where(eq(tasks.listId, id));
    
    // Then delete the list
    const result = await this.db.delete(lists).where(eq(lists.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

// Conditional storage initialization
async function initializeStorage(): Promise<IStorage> {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL not found. Using in-memory storage (MemStorage). Data will not persist between server restarts.");
    return new MemStorage();
  }

  try {
    // Only import db if DATABASE_URL is available
    const { db } = await import("./db.js");
    if (!db) {
      throw new Error("Database instance is null");
    }
    console.log("✅ Database storage initialized successfully");
    return new DatabaseStorage(db);
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
    console.warn("⚠️  Falling back to in-memory storage (MemStorage). Data will not persist between server restarts.");
    return new MemStorage();
  }
}

// Initialize storage synchronously for cases where DATABASE_URL is not set
function createStorageSync(): IStorage {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL not found. Using in-memory storage (MemStorage). Data will not persist between server restarts.");
    return new MemStorage();
  }
  
  // If DATABASE_URL is set, we need to handle this differently
  // Return a temporary instance that will be replaced
  return new MemStorage();
}

export let storage: IStorage = createStorageSync();

// Initialize proper storage if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  initializeStorage().then(s => {
    storage = s;
    console.log("✅ Storage replaced with DatabaseStorage");
  }).catch(error => {
    console.error("Failed to initialize database storage:", error);
    console.warn("⚠️  Using in-memory storage (MemStorage). Data will not persist between server restarts.");
    storage = new MemStorage();
  });
}
