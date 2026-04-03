// Build a single self-contained HTML with game.js inlined
const fs = require('fs');

// Read game.js
const gameJs = fs.readFileSync('game.js', 'utf8');

// Read from template
let html = fs.readFileSync('index_template.html', 'utf8');

// Replace external script reference with inline script
const errorCatcher = `<script>
window.addEventListener('error', function(e) {
    var div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:0;left:0;z-index:99999;background:red;color:#fff;padding:10px;font-size:14px;max-width:100%;word-break:break-all;';
    div.textContent = 'JS ERROR: ' + e.message + ' (' + e.filename + ':' + e.lineno + ')';
    document.body.appendChild(div);
});
</script>`;

html = html.replace('<script src="game.js"></script>', `${errorCatcher}\n<script>\n${gameJs}\n</script>`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Created index.html - game.js inlined');
