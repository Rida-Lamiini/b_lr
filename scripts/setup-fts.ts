import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Search Index (FTS5) setup...");

  try {
    // 1. Create Virtual Table
    console.log("Creating SEARCH_INDEX virtual table...");
    await prisma.$executeRawUnsafe(`
      CREATE VIRTUAL TABLE IF NOT EXISTS SearchIndex USING fts5(
        id,
        type,
        title,
        content,
        userId UNINDEXED
      );
    `);

    // 2. Clear existing data to avoid duplicates if re-running
    await prisma.$executeRawUnsafe("DELETE FROM SearchIndex;");

    // 3. Populate Search Index with existing data
    console.log("Populating index with existing data...");
    
    // Notes
    await prisma.$executeRawUnsafe(`
      INSERT INTO SearchIndex (id, type, title, content, userId)
      SELECT id, 'note', title, content, userId FROM Note;
    `);

    // Tasks
    await prisma.$executeRawUnsafe(`
      INSERT INTO SearchIndex (id, type, title, content, userId)
      SELECT id, 'task', title, description, userId FROM Task;
    `);

    // JournalEntries
    await prisma.$executeRawUnsafe(`
      INSERT INTO SearchIndex (id, type, title, content, userId)
      SELECT id, 'journal', title, content, userId FROM JournalEntry;
    `);

    // Milestones
    await prisma.$executeRawUnsafe(`
      INSERT INTO SearchIndex (id, type, title, content, userId)
      SELECT id, 'milestone', title, description, userId FROM Milestone;
    `);

    // 4. Create Triggers for real-time synchronization
    console.log("Creating synchronization triggers...");

    // NOTE TRIGGERS
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS note_ai AFTER INSERT ON Note BEGIN
        INSERT INTO SearchIndex (id, type, title, content, userId) VALUES (new.id, 'note', new.title, new.content, new.userId);
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS note_au AFTER UPDATE ON Note BEGIN
        UPDATE SearchIndex SET title = new.title, content = new.content WHERE id = old.id AND type = 'note';
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS note_ad AFTER DELETE ON Note BEGIN
        DELETE FROM SearchIndex WHERE id = old.id AND type = 'note';
      END;
    `);

    // TASK TRIGGERS
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS task_ai AFTER INSERT ON Task BEGIN
        INSERT INTO SearchIndex (id, type, title, content, userId) VALUES (new.id, 'task', new.title, new.description, new.userId);
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS task_au AFTER UPDATE ON Task BEGIN
        UPDATE SearchIndex SET title = new.title, content = new.description WHERE id = old.id AND type = 'task';
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS task_ad AFTER DELETE ON Task BEGIN
        DELETE FROM SearchIndex WHERE id = old.id AND type = 'task';
      END;
    `);

    // JOURNAL TRIGGERS
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS journal_ai AFTER INSERT ON JournalEntry BEGIN
        INSERT INTO SearchIndex (id, type, title, content, userId) VALUES (new.id, 'journal', new.title, new.content, new.userId);
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS journal_au AFTER UPDATE ON JournalEntry BEGIN
        UPDATE SearchIndex SET title = new.title, content = new.content WHERE id = old.id AND type = 'journal';
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS journal_ad AFTER DELETE ON JournalEntry BEGIN
        DELETE FROM SearchIndex WHERE id = old.id AND type = 'journal';
      END;
    `);

    // MILESTONE TRIGGERS
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS milestone_ai AFTER INSERT ON Milestone BEGIN
        INSERT INTO SearchIndex (id, type, title, content, userId) VALUES (new.id, 'milestone', new.title, new.description, new.userId);
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS milestone_au AFTER UPDATE ON Milestone BEGIN
        UPDATE SearchIndex SET title = new.title, content = new.description WHERE id = old.id AND type = 'milestone';
      END;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS milestone_ad AFTER DELETE ON Milestone BEGIN
        DELETE FROM SearchIndex WHERE id = old.id AND type = 'milestone';
      END;
    `);

    console.log("✅ Search Index setup successfully!");
  } catch (error) {
    console.error("❌ Error setting up search index:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
