import { execSync } from 'child_process';
try {
  console.log("Installing @google/genai...");
  execSync('npm install @google/genai', { stdio: 'inherit', shell: 'cmd.exe' });
  console.log("Installation successful.");
} catch (e) {
  console.error("Installation failed:", e.message);
}
