#!/usr/bin/env node
/**
 * 🦞 OpenClaw 中文语言包 CLI
 * 
 * 只对官方 OpenClaw 源码应用中文翻译
 * 
 * 用法:
 *   openclaw-zh <命令> [选项]
 * 
 * 命令:
 *   help     显示帮助信息
 *   status   查看当前状态
 *   apply    应用汉化补丁
 *   verify   验证汉化结果
 *   restore  恢复原版代码
 */

import { applyCommand } from './commands/apply.mjs';
import { statusCommand } from './commands/status.mjs';
import { restoreCommand } from './commands/restore.mjs';
import { log, colors } from './utils/logger.mjs';

const VERSION = '1.0.0';

const LOGO = `
${colors.cyan}╔═══════════════════════════════════════════════╗
║  ${colors.bold}🦞 OpenClaw 中文语言包 CLI${colors.reset}${colors.cyan}                    ║
║     官方源码汉化工具 v${VERSION}                  ║
╚═══════════════════════════════════════════════╝${colors.reset}
`;

function printHelp() {
  console.log(LOGO);
  console.log(`${colors.bold}用法:${colors.reset} openclaw-zh <命令> [选项]

${colors.bold}命令:${colors.reset}

  ${colors.green}help${colors.reset}      显示此帮助信息
  
  ${colors.green}status${colors.reset}    查看当前汉化状态
            显示 OpenClaw 版本、汉化状态、翻译配置信息
  
  ${colors.green}apply${colors.reset}     应用汉化补丁到 OpenClaw 源码
            ${colors.dim}--dry-run   仅预览，不修改文件${colors.reset}
            ${colors.dim}--verbose   显示详细日志${colors.reset}
            ${colors.dim}--target    指定目标目录${colors.reset}
  
  ${colors.green}verify${colors.reset}    验证汉化是否已正确应用
  
  ${colors.green}restore${colors.reset}   恢复原版代码（撤销所有汉化）
            ${colors.dim}需要目标目录是 git 仓库${colors.reset}
  
${colors.bold}示例:${colors.reset}

  ${colors.dim}# 查看当前状态${colors.reset}
  openclaw-zh status

  ${colors.dim}# 预览汉化效果（不修改文件）${colors.reset}
  openclaw-zh apply --dry-run

  ${colors.dim}# 应用汉化到指定目录${colors.reset}
  openclaw-zh apply --target=/path/to/openclaw

  ${colors.dim}# 验证汉化是否成功${colors.reset}
  openclaw-zh verify

  ${colors.dim}# 恢复原版${colors.reset}
  openclaw-zh restore

${colors.bold}本地开发:${colors.reset}

  ${colors.dim}# 克隆项目后使用${colors.reset}
  npm run cli -- help
  npm run cli -- status
  npm run cli -- apply --dry-run

${colors.bold}更多信息:${colors.reset}
  上游:   https://github.com/openclaw/openclaw
  定位:   简体中文语言包，仅包含汉化补丁
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const cmdArgs = args.slice(1);

  switch (command) {
    case 'apply':
      await applyCommand(cmdArgs);
      break;
    
    case 'verify':
      cmdArgs.push('--verify');
      await applyCommand(cmdArgs);
      break;
    
    case 'status':
      await statusCommand(cmdArgs);
      break;
    
    case 'restore':
      await restoreCommand(cmdArgs);
      break;
    
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      break;
    
    case '--version':
    case '-v':
      console.log(`openclaw-zh v${VERSION}`);
      break;
    
    default:
      log.error(`未知命令: ${command}`);
      console.log(`运行 ${colors.cyan}openclaw-zh help${colors.reset} 查看帮助`);
      process.exit(1);
  }
}

main().catch(err => {
  log.error(err.message);
  process.exit(1);
});
