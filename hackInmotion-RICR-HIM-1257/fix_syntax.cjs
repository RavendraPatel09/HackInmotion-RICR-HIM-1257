const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

function fixSyntax(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    const orig = content;
    
    // Replace literal '\${' with '${'
    content = content.split('\\${').join('${');
    
    if (content !== orig) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Fixed syntax in ' + filepath);
    }
}

function walkSync(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath);
        } else if (file.endsWith('.js')) {
            fixSyntax(filepath);
        }
    }
}
walkSync(srcDir);
