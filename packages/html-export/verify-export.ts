#!/usr/bin/env tsx

import { HTMLExporter, ALL_TEMPLATES } from './src/index.js'

console.log('🚀 验证 HTML 导出功能')
console.log('='.repeat(60))

console.log('\n📦 已加载的模板:')
console.log(`- 模板总数: ${ALL_TEMPLATES.length}`)
ALL_TEMPLATES.forEach(t => {
  console.log(`  • ${t.id}: ${t.name}`)
})

console.log('\n🔧 创建 HTML 导出器')
const exporter = new HTMLExporter()
console.log(`- 模板数量: ${exporter.getTemplates().length}`)

const info = exporter.getExportInfo()
console.log(`- 环境: ${info.isBrowser ? '浏览器' : 'Node.js'}`)
console.log(`- 支持主题: ${info.supportedThemes.join(', ')}`)

const testMarkdown = `
# 测试标题

这是一个测试文档。

## 子标题

- 列表项 1
- 列表项 2
- 列表项 3

\`\`\`javascript
const x = 1
console.log('Hello World!')
\`\`\`

> 这是一个引用块
`

console.log('\n📄 测试 Markdown 内容')
console.log(testMarkdown)

console.log('\n🛠️ 使用 default 模板导出')
const result = await exporter.export(`<h1>Test</h1><p>Hello!</p>`, {
  templateId: 'default',
  options: { theme: 'light' },
  variables: {
    title: '测试导出',
    author: 'Test Author',
    date: '2026-05-15'
  }
})

console.log(`✓ 导出成功!`)
console.log(`- 文件名: ${result.filename}`)
console.log(`- 模板: ${result.templateId}`)
console.log(`- HTML 大小: ${(result.html.length / 1024).toFixed(2)} KB`)

console.log('\n📊 验证完成!')
console.log('='.repeat(60))
