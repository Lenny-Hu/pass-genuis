// for github pages
const fs = require('fs');
const path = require('path');

// 定义 .nojekyll 文件路径（out 根目录）
const noJekyllPath = path.join(__dirname, './out/.nojekyll');

// 新建空的 .nojekyll 文件（无则创建，有则覆盖为空）
fs.writeFileSync(noJekyllPath, '', 'utf-8');
console.log('✅ 已在 out 目录自动生成 .nojekyll 文件');
