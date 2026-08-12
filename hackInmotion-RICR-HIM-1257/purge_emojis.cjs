const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const emojiMap = {
    '✅': 'check',
    '⚠️': 'warning',
    '📍': 'location',
    '📸': 'camera',
    '🛣️': 'roads',
    '🗑️': 'trash',
    '🚰': 'water',
    '👤': 'user',
    '🛠️': 'tools',
    '✨': 'sparkles',
    '❌': 'x',
    '🌟': 'star',
    '👁️': 'eye',
    '⏱️': 'clock',
    '🏗️': 'building'
};

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    const originalContent = content;
    
    // Remove inline animations
    content = content.replace(/style="[^"]*animation:\s*fadeIn[^"]*"/g, (match) => {
        let newStyle = match.replace(/animation:\s*fadeIn[^;]+;?\s*/g, '');
        if (newStyle === 'style=""') return '';
        return newStyle;
    });
    content = content.replace(/animation:\s*fadeIn[^;]+;?\s*/g, '');
    
    // Replace emojis
    let hasEmojis = false;
    for (const [emoji, iconName] of Object.entries(emojiMap)) {
        if (content.includes(emoji)) {
            hasEmojis = true;
            // 1. If inside JS quotes (e.g. icon = '✅'; or return '✅';)
            const quotedEmoji = new RegExp(`['"]${emoji}['"]`, 'g');
            content = content.replace(quotedEmoji, `Icons.${iconName}`);
            
            // 2. If inside template literals or HTML text
            content = content.split(emoji).join(`\${Icons.${iconName}}`);
        }
    }
    
    if (hasEmojis) {
        // Find depth for import
        const relative = path.relative(path.dirname(filepath), path.join(srcDir, 'utils', 'icons.js'));
        let importPath = relative.startsWith('.') ? relative : './' + relative;
        importPath = importPath.replace(/\\/g, '/'); // for windows if any
        
        const importStmt = `\nimport { Icons } from '${importPath}';`;
        
        const lastImportIdx = content.lastIndexOf('import ');
        if (lastImportIdx !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIdx);
            content = content.slice(0, endOfLine) + importStmt + content.slice(endOfLine);
        } else {
            content = importStmt.trim() + '\n' + content;
        }
    }

    if (content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

function walkSync(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walkSync(filepath);
        } else if (file.endsWith('.js')) {
            processFile(filepath);
        }
    }
}

walkSync(srcDir);
console.log('Done processing files.');
