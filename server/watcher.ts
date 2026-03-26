import { watch } from "chokidar";
import { statSync, readdirSync, readFileSync, openSync, readSync, closeSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import { homedir } from "os";
import { EventEmitter } from "events";

const CLAUDE_PROJECTS_DIR = join(homedir(), ".claude", "projects");
const ACTIVE_THRESHOLD_MS = 600_000; // 10 minutes — Claude can think for 5+ min without writing
const POLL_INTERVAL_MS = 1000;
const RESCAN_INTERVAL_MS = 10_000; // re-scan directories every 10s for untracked active files

export interface WatchedFile {
  path: string;
  sessionId: string;
  projectName: string;
  offset: number;
  lineBuffer: string;
  isSubagent: boolean;
  parentSessionId: string | null;
  subagentLabel: string | null;
}

export class JsonlWatcher extends EventEmitter {
  private files = new Map<string, WatchedFile>();
  private watcher: ReturnType<typeof watch> | null = null;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private lastScanTime = 0;

  start(): void {
    this.scanForActiveFiles();

    this.watcher = watch(CLAUDE_PROJECTS_DIR, {
      ignoreInitial: true,
      depth: 3,
    });

    this.watcher.on("add", (filePath: string) => {
      if (filePath.endsWith(".jsonl")) {
        this.addFile(filePath);
      }
    });

    this.pollInterval = setInterval(() => this.pollFiles(), POLL_INTERVAL_MS);
  }

  stop(): void {
    this.watcher?.close();
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  private scanForActiveFiles(): void {
    try {
      const dirs = readdirSync(CLAUDE_PROJECTS_DIR, { withFileTypes: true });
      for (const dir of dirs) {
        if (!dir.isDirectory()) continue;
        const dirPath = join(CLAUDE_PROJECTS_DIR, dir.name);
        try {
          const entries = readdirSync(dirPath, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith(".jsonl")) {
              const filePath = join(dirPath, entry.name);
              const stat = statSync(filePath);
              if (Date.now() - stat.mtimeMs < ACTIVE_THRESHOLD_MS) {
                this.addFile(filePath);
              }
            }
            // Scan subagents directories inside session dirs
            if (entry.isDirectory()) {
              const subagentsDir = join(dirPath, entry.name, "subagents");
              try {
                const subFiles = readdirSync(subagentsDir);
                for (const sf of subFiles) {
                  if (!sf.endsWith(".jsonl")) continue;
                  const subPath = join(subagentsDir, sf);
                  const stat = statSync(subPath);
                  if (Date.now() - stat.mtimeMs < ACTIVE_THRESHOLD_MS) {
                    this.addFile(subPath);
                  }
                }
              } catch { /* no subagents dir */ }
            }
          }
        } catch {
          /* skip unreadable dirs */
        }
      }
    } catch {
      /* projects dir may not exist */
    }
  }

  private addFile(filePath: string): void {
    if (this.files.has(filePath)) return;

    const sessionId = basename(filePath, ".jsonl");
    const parentDir = basename(dirname(filePath));
    const isSubagent = parentDir === "subagents";

    let projectName: string;
    let parentSessionId: string | null = null;
    let subagentLabel: string | null = null;

    if (isSubagent) {
      // Path: <projects>/<project>/<parentSessionId>/subagents/<agentId>.jsonl
      parentSessionId = basename(dirname(dirname(filePath)));
      // Read description from meta.json
      const metaPath = filePath.replace(".jsonl", ".meta.json");
      try {
        if (existsSync(metaPath)) {
          const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
          subagentLabel = meta.description || null;
        }
      } catch { /* ignore */ }
      projectName = subagentLabel || sessionId.slice(0, 8);
    } else {
      const projectDirName = basename(dirname(filePath));
      // Extract short project name: "-Users-alice-Documents-myproject-657" -> "657"
      const parts = projectDirName.split("-").filter(Boolean);
      projectName = parts[parts.length - 1] || sessionId.slice(0, 8);
    }

    const file: WatchedFile = {
      path: filePath,
      sessionId,
      projectName,
      offset: 0,
      lineBuffer: "",
      isSubagent,
      parentSessionId,
      subagentLabel,
    };

    this.files.set(filePath, file);
    this.emit("fileAdded", file);

    // Read existing content to catch up
    this.readNewLines(file);
  }

  private pollFiles(): void {
    for (const [path, file] of this.files) {
      try {
        const stat = statSync(path);
        if (stat.size > file.offset) {
          this.readNewLines(file);
        }
        // Remove stale files
        if (Date.now() - stat.mtimeMs > ACTIVE_THRESHOLD_MS) {
          this.files.delete(path);
          this.emit("fileRemoved", file);
        }
      } catch {
        this.files.delete(path);
        this.emit("fileRemoved", file);
      }
    }

    // Periodic re-scan for untracked active files (e.g. pre-existing sessions)
    if (Date.now() - this.lastScanTime > RESCAN_INTERVAL_MS) {
      this.lastScanTime = Date.now();
      this.scanForActiveFiles();
    }
  }

  private readNewLines(file: WatchedFile): void {
    try {
      const stat = statSync(file.path);
      if (stat.size <= file.offset) return;

      const buf = Buffer.alloc(stat.size - file.offset);
      const fd = openSync(file.path, "r");
      readSync(fd, buf, 0, buf.length, file.offset);
      closeSync(fd);

      file.offset = stat.size;
      const text = file.lineBuffer + buf.toString("utf-8");
      const lines = text.split("\n");

      // Last element is incomplete line (buffer it)
      file.lineBuffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          this.emit("line", file, line);
        }
      }
    } catch {
      /* file may have been deleted */
    }
  }

  getActiveFiles(): WatchedFile[] {
    return Array.from(this.files.values());
  }
}
