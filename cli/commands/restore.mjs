/**
 * restore 命令 - 恢复原版代码
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT_DIR } from '../utils/i18n-engine.mjs';
import { log, colors } from '../utils/logger.mjs';

async function findOpenClawDir() {
  const candidates = [
    path.resolve(ROOT_DIR, 'openclaw'),
    path.resolve(ROOT_DIR, 'upstream'),
  ];
  
  try {
    const npmRoot = execSync('npm root -g', { encoding: 'utf-8' }).trim();
    candidates.push(path.join(npmRoot, 'openclaw'));
  } catch {}
  
  for (const dir of candidates) {
    try {
      const pkgPath = path.join(dir, 'package.json');
      const content = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.name === 'openclaw') {
        return dir;
      }
    } catch {}
  }
  
  return null;
}

export async function restoreCommand(args) {
  console.log(`\n🦞 ${colors.bold}OpenClaw 简体中文语言包恢复工具${colors.reset}\n`);
  
  const targetArg = args.find(a => a.startsWith('--target='));
  let targetDir = targetArg ? path.resolve(targetArg.split('=')[1]) : await findOpenClawDir();
  
  if (!targetDir) {
    log.error('找不到 OpenClaw 目录');
    console.log(`请使用 ${colors.cyan}--target=/path/to/openclaw${colors.reset} 指定目录`);
    process.exit(1);
  }
  
  log.info(`目标目录: ${targetDir}`);
  log.warn('这将使用 git 恢复所有修改的文件');
  console.log('');
  
  try {
    // 检查是否是 git 仓库
    execSync('git status', { cwd: targetDir, stdio: 'ignore' });
    
    // 获取修改的文件
    const output = execSync('git diff --name-only', { 
      cwd: targetDir, 
      encoding: 'utf-8' 
    });
    
    const modifiedFiles = output.trim().split('\n').filter(Boolean);
    
    if (modifiedFiles.length === 0) {
      log.success('没有需要恢复的文件');
      return;
    }
    
    console.log(`将恢复以下 ${modifiedFiles.length} 个文件:\n`);
    for (const file of modifiedFiles) {
      console.log(`   ${colors.dim}•${colors.reset} ${file}`);
    }
    
    console.log('');
    
    // 恢复文件
    execSync('git checkout -- .', { cwd: targetDir, stdio: 'inherit' });
    
    log.success(`已恢复 ${modifiedFiles.length} 个文件`);
    
  } catch (err) {
    if (err.message?.includes('git')) {
      log.error('目标目录不是 git 仓库');
      console.log(`${colors.dim}restore 命令需要目标是 git 仓库才能恢复文件${colors.reset}`);
    } else {
      log.error(err.message);
    }
    process.exit(1);
  }
}
