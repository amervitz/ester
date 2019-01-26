# CodeMirror 
cp .\node_modules\codemirror\lib\ .\lib\codemirror\ -Recurse
cp .\node_modules\codemirror\mode\javascript\javascript.js .\lib\codemirror\

# PageDown 
mkdir .\lib\pagedown
cp .\node_modules\pagedown\Markdown.*.js .\lib\pagedown\
cp .\node_modules\pagedown\wmd-buttons.png .\lib\pagedown\