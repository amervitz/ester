var worker = new Worker("worker.js");

/**
 * 
 * @param {string} id 
 */
function runCode(codeId) {
    var source = document.getElementById(`code-input-${codeId}`);
    worker.postMessage(source.value);
    worker.onmessage = (evnt) => {
        var output = document.getElementById(`code-output-${codeId}`);
        output.innerText = evnt.data;

        localStorage.setItem(`code:${codeId}`, 
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
var codeTemplate = document.getElementById('code-template').innerHTML;

/**
 * 
 * @param {number} num 
 * @param {any} vals 
 */
function addCode(num, vals) {
    if(num){
        var number = Number.parseInt(num);
    } else {
        var nextBlock = localStorage.getItem("nextBlock") || 1;
        var number = Number.parseInt(nextBlock);
        localStorage.setItem("nextBlock", number + 1);
    }

    var replaces = {
        "{{num}}": number,
        "{{code}}": vals != null ? vals.code: "",
        "{{output}}": vals != null ? vals.output : ""
    };

    var text = codeTemplate.replace(/{{num}}|{{code}}|{{output}}/g, function(matched){
        return replaces[matched];
    });
    
    var template = document.createElement('template');
    template.innerHTML = text;

    var body = document.getElementById("body");
    var end = document.getElementById("end");
    body.insertBefore(template.content, end);

    var newElement = document.getElementById(`code-input-${number}`);
    var cm = CodeMirror.fromTextArea(newElement, {
        lineNumbers: true,
        mode: "javascript",
        viewportMargin: Infinity
    });
    cm.on("blur", function () {
        cm.save();
    });
}

function removeCode(codeId) {
    // get the textarea element
    var textarea = document.getElementById(`code-input-${codeId}`);
    // get the associated CodeMirror
    var codeMirror = textarea.nextElementSibling.CodeMirror;
    // remove CodeMirror
    codeMirror.toTextArea();
    // remove the textarea
    var codeDiv = document.getElementById(`code-${codeId}`);
    codeDiv.remove();
    // remove the local state
    localStorage.removeItem(`code:${codeId}`);
}

function createCodeSnippet(codeId) {
    let snippetValue = document.getElementById(`code-input-${codeId}`).value;
    let snippetName = document.getElementById(`code-createSnippetName-value-${codeId}`).value;

    if(snippetName && snippetValue) {
        let snippetsText = localStorage.getItem("snippets");
        let snippets = snippetsText !== null ? JSON.parse(snippetsText) : {};
        snippets[snippetName] = snippetValue;
        localStorage.setItem("snippets", JSON.stringify(snippets));
    }
}

function insertCodeSnippet(codeId) {
    let snippetName = document.getElementById(`code-insertSnippetName-value-${codeId}`).value;
    var snippetsText = localStorage.getItem("snippets");
    let snippets = snippetsText !== null ? JSON.parse(snippetsText) : {};

    if(snippets[snippetName]) {
        var codeMirror = document.getElementById(`code-input-${codeId}`).nextElementSibling.CodeMirror;
        var currentValue = codeMirror.getValue();
        var prefix = currentValue.length ? `${currentValue}\n` : currentValue;
        codeMirror.setValue(`${prefix}${snippets[snippetName]}`);
        codeMirror.save();
    }
}

var markdownTemplate = `
<div id="wmd-button-bar-{{num}}"></div>
<textarea class="wmd-input" id="wmd-input-{{num}}">{{input}}</textarea>
<div id="wmd-preview-{{num}}" class="wmd-preview">{{preview}}</div>
<button id="wmd-save-{{num}}" onclick="saveMarkdown('{{num}}')">Save</button><br><br>`;

function addMarkdown(num, vals) {
    if (num) {
        var number = Number.parseInt(num);
    } else {
        var nextBlock = localStorage.getItem("nextBlock") || 1;
        var number = Number.parseInt(nextBlock);
        localStorage.setItem("nextBlock", number + 1);
    }

    var replaces = {
        "{{num}}": number,
        "{{input}}": vals != null ? vals.input: "",
        "{{preview}}": vals != null ? vals.preview : ""
    };

    var text = markdownTemplate.replace(/{{num}}|{{input}}|{{preview}}/g, function(matched){
        return replaces[matched];
    });
    
    var template = document.createElement('template');
    template.innerHTML = text;

    var body = document.getElementById("body");
    var end = document.getElementById("end");
    body.insertBefore(template.content, end);

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