import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import archiver from "archiver";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ROOT_DIR = process.cwd();
    const DB_PATH = path.join(ROOT_DIR, "prisma", "dev.db");
    const UPLOADS_PATH = path.join(ROOT_DIR, "public", "uploads");

    const archive = archiver("zip", {
      zlib: { level: 9 }, // maximum compression
    });

    const body = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        archive.on("end", () => {
          controller.close();
        });
        archive.on("error", (err) => {
          controller.error(err);
        });

        // Append files
        if (fs.existsSync(DB_PATH)) {
          archive.file(DB_PATH, { name: "dev.db" });
        }
        if (fs.existsSync(UPLOADS_PATH)) {
          archive.directory(UPLOADS_PATH, "uploads");
        }

        // Finalize the archive (we are done appending files)
        archive.finalize();
      },
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    return new Response(body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="locus-backup-${timestamp}.zip"`,
      },
    });
  } catch (error) {
    console.error("Backup route error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
