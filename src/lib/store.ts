"use client";

import type { Sermon } from "./types";

const KEY = "ipreach.sermons.v1";

function read(): Sermon[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Sermon[]) : [];
  } catch {
    return [];
  }
}

function write(list: Sermon[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function listSermons(): Sermon[] {
  return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getSermon(id: string): Sermon | undefined {
  return read().find((s) => s.id === id);
}

export function saveSermon(sermon: Sermon): void {
  const list = read();
  const idx = list.findIndex((s) => s.id === sermon.id);
  const next = { ...sermon, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  write(list);
}

export function deleteSermon(id: string): void {
  write(read().filter((s) => s.id !== id));
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
