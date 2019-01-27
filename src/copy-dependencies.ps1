# CodeMirror 
Copy-Item .\node_modules\codemirror\lib\ .\www\lib\codemirror\ -Recurse
Copy-Item .\node_modules\codemirror\mode\javascript\javascript.js .\www\lib\codemirror\

# PageDown 
mkdir .\www\lib\pagedown
Copy-Item .\node_modules\pagedown\Markdown.*.js .\www\lib\pagedown\
Copy-Item .\node_modules\pagedown\wmd-buttons.png .\www\lib\pagedown\