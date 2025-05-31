const { spawn } = require('child_process');

const npm = spawn('npm', ['test', '--', '--timeout', '30000'], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'pipe'
});

let output = '';
npm.stdout.on('data', (data) => {
  output += data.toString();
  process.stdout.write(data);
});

npm.stderr.on('data', (data) => {
  output += data.toString();
  process.stderr.write(data);
});

npm.on('close', (code) => {
  // Extract summary
  const summaryMatch = output.match(/(\d+)\s+passing.*\n.*(\d+)\s+pending.*\n.*(\d+)\s+failing/);
  if (summaryMatch) {
    console.log('\n\n=== FINAL TEST SUMMARY ===');
    console.log(`✅ Passing: ${summaryMatch[1]}`);
    console.log(`⏸️  Pending: ${summaryMatch[2]}`);
    console.log(`❌ Failing: ${summaryMatch[3]}`);
  }
  process.exit(code);
});