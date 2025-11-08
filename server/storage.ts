import { type Task, type InsertTask, type List, type InsertList } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private lists: Map<string, List>;

  constructor() {
    this.tasks = new Map();
    this.lists = new Map();
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      description: insertTask.description || null,
      listId: insertTask.listId || null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getLists(): Promise<List[]> {
    return Array.from(this.lists.values());
  }

  async getList(id: string): Promise<List | undefined> {
    return this.lists.get(id);
  }

  async createList(insertList: InsertList): Promise<List> {
    const id = randomUUID();
    const list: List = { ...insertList, id };
    this.lists.set(id, list);
    return list;
  }

  async updateList(id: string, updates: Partial<List>): Promise<List | undefined> {
    const list = this.lists.get(id);
    if (!list) return undefined;

    const updatedList = { ...list, ...updates };
    this.lists.set(id, updatedList);
    return updatedList;
  }

  async deleteList(id: string): Promise<boolean> {
    const deleted = this.lists.delete(id);
    if (deleted) {
      const tasks = Array.from(this.tasks.values());
      for (const task of tasks) {
        if (task.listId === id) {
          await this.updateTask(task.id, { listId: null });
        }
      }
    }
    return deleted;
  }
}

export const storage = new MemStorage();
