# CodeMirror 
cp .\node_modules\codemirror\lib\ .\www\lib\codemirror\ -Recurse
cp .\node_modules\codemirror\mode\javascript\javascript.js .\www\lib\codemirror\

# PageDown 
mkdir .\www\lib\pagedown
cp .\node_modules\pagedown\Markdown.*.js .\www\lib\pagedown\
cp .\node_modules\pagedown\wmd-buttons.png .\www\lib\pagedown\