onmessage = function(e) {
    // indirect eval to force code to execute in global scope http://2ality.com/2014/01/eval.html
    // allows sharing code results between invocations 
    var result = eval.call(null, e.data);
    postMessage(result);
  }