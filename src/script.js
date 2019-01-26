// 📁 main.mjs
var worker = new Worker("worker.js");

/**
 * 
 * @param {string} id 
 */
function runCode(src, tgt) {
    var source = document.getElementById(src);
    worker.postMessage(source.value);
    worker.onmessage = (evnt) => {
        var output = document.getElementById(tgt);
        output.innerText = evnt.data;

        var blockNum = src.split('-')[1];
        localStorage.setItem(`code:${blockNum}`, 
            JSON.stringify({ 
                code: source.value,
                output: evnt.data
            })
        );
    }
}

function loadState() {
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        var stateType = key.split(':')[0];

        if(stateType == "code") {
            var value = localStorage.getItem(key);
            var vals = JSON.parse(value);
            var blockNum = key.split(':')[1];
            addCode(blockNum, vals);
        } else if(stateType == "markdown") {
            var value = localStorage.getItem(key);
            var vals = JSON.parse(value);
            var blockNum = key.split(':')[1];
            addMarkdown(blockNum, vals);
        }
    }
}

/** @type {string} */
var codeTemplate = `<textarea id="code-{{num}}">{{code}}</textarea>
<button id="run-{{num}}" onclick="runCode('code-{{num}}','output-{{num}}')">Execute</button>
<pre id="output-{{num}}">{{output}}</pre>`;

/**
 * 
 * @param {number} num 
 * @param {any} vals 
 */
function addCode(num, vals) {
    if(num == null){
        var nextBlock = localStorage.getItem("nextBlock") || 1;
        var number = Number.parseInt(nextBlock);
    } else {
        var number = Number.parseInt(num);
    }

    var replaces = {
        "{{num}}": number,
        "{{code}}": vals != null ? vals.code: "",
        "{{output}}": vals != null ? vals.output : ""
    };

    var text = codeTemplate.replace(/{{num}}|{{code}}|{{output}}/g, function(matched){
        return replaces[matched];
    });
    localStorage.setItem("nextBlock", number + 1);
    
    var template = document.createElement('template');
    template.innerHTML = text;

    var body = document.getElementById("body");
    var end = document.getElementById("end");
    body.insertBefore(template.content, end);

    var newElement = document.getElementById(`code-${number}`);
    var cm = CodeMirror.fromTextArea(newElement, {
        lineNumbers: true,
        mode: "javascript",
        viewportMargin: Infinity
    });
    cm.on("blur", function () {
        cm.save();
    });
}

var markdownTemplate = `<div id="wmd-button-bar-{{num}}"></div>
<textarea class="wmd-input" id="wmd-input-{{num}}">{{input}}</textarea>
<div id="wmd-preview-{{num}}" class="wmd-preview">{{preview}}</div>
<button id="wmd-save-{{num}}" onclick="saveMarkdown('{{num}}')">Save</button><br><br>`;

function addMarkdown(num, vals) {
    if(num == null){
        var nextBlock = localStorage.getItem("nextBlock") || 1;
        var number = Number.parseInt(nextBlock);
    } else {
        var number = Number.parseInt(num);
    }

    var replaces = {
        "{{num}}": number,
        "{{input}}": vals != null ? vals.input: "",
        "{{preview}}": vals != null ? vals.preview : ""
    };

    var text = markdownTemplate.replace(/{{num}}|{{input}}|{{preview}}/g, function(matched){
        return replaces[matched];
    });
    localStorage.setItem("nextBlock", number + 1);
    
    var template = document.createElement('template');
    template.innerHTML = text;

    var body = document.getElementById("body");
    var end = document.getElementById("end");
    body.insertBefore(template.content, end);

    //var newElement = document.getElementById(`wmd-input-${number}`);
    var converter = new Markdown.Converter();
    var editor = new Markdown.Editor(converter, `-${number}`);
    editor.run();
}

function saveMarkdown(number) {
    var text = document.getElementById(`wmd-input-${number}`);
    console.log(text.value);

    var output = document.getElementById(`wmd-preview-${number}`);
    console.log(output);

    localStorage.setItem(`markdown:${number}`, JSON.stringify({ 
        input: text.value,
        preview: output.innerHTML
    }));
}