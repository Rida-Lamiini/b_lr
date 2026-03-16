import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const ROOT_DIR = process.cwd();
const BACKUPS_DIR = path.join(ROOT_DIR, '.backups');
const DB_PATH = path.join(ROOT_DIR, 'prisma', 'dev.db');
const UPLOADS_PATH = path.join(ROOT_DIR, 'public', 'uploads');

// Ensure backups dir exists
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Keep only the last 7 backups
function cleanupOldBackups() {
  const files = fs.readdirSync(BACKUPS_DIR)
    .filter(f => f.startsWith('backup-') && f.endsWith('.zip'))
    .sort() // ascending (oldest first)
  
  if (files.length > 7) {
    const toDelete = files.slice(0, files.length - 7);
    toDelete.forEach(file => {
      fs.unlinkSync(path.join(BACKUPS_DIR, file));
      console.log(`🧹 Deleted old backup: ${file}`);
    });
  }
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUPS_DIR, `backup-${timestamp}.zip`);
  
  const output = fs.createWriteStream(backupFile);
  const archive = archiver('zip', {
    zlib: { level: 9 } // maximum compression
  });

  return new Promise<void>((resolve, reject) => {
    output.on('close', () => {
      console.log(`✅ Backup created successfully: ${backupFile} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
      cleanupOldBackups();
      resolve();
    });

    archive.on('error', (err) => {
      console.error('❌ Backup failed:', err);
      reject(err);
    });

    archive.pipe(output);

    // Append database
    if (fs.existsSync(DB_PATH)) {
      archive.file(DB_PATH, { name: 'dev.db' });
    } else {
      console.warn('⚠️ Database file not found at:', DB_PATH);
    }

    // Append uploads directory
    if (fs.existsSync(UPLOADS_PATH)) {
      archive.directory(UPLOADS_PATH, 'uploads');
    } else {
      console.warn('⚠️ Uploads directory not found at:', UPLOADS_PATH);
    }

    archive.finalize();
  });
}

console.log('🚀 Starting automated backup...');
runBackup().catch(err => {
  console.error('Fatal error during backup:', err);
  process.exit(1);
});

export { runBackup };
