fs = require('fs');

var iterations = 1000;

var file = '/etc/hosts';

var encoding = 'utf8';

var benchmarkSync = function () {
  if (! fs.existsSync(file)) {
    console.log('sync benchmark couldn\'t run, file does not exists');
    return;
  }

  var start = Date.now();

  for (var count = 1; count <= iterations; count++) {
    var text = fs.readFileSync(file, encoding);
  }

  var end = Date.now();
  var elapsed = end - start;
  console.log('sync elapsed: ' + elapsed / 1000 + 's');
};

var benchmarkAsync = function () {
  var testFile = function () {
    fs.readFile(file, encoding, function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  };

  var start = Date.now();

  for (var count = 1; count <= iterations; count++) {
    testFile();
    if (count == iterations) {
      var end = Date.now();
      var elapsed = end - start;
      console.log('async elapsed: ' + elapsed / 1000 + 's');
      benchmarkSync();
    }
  }
};

benchmarkAsync();

console.log("But take care...\n" +
	"Async with no throttling for such thing as file descriptors, we start to see:\n" +
	"{ [Error: EMFILE, open '/etc/hosts'] errno: 20, code: 'EMFILE', path: '/etc/hosts' }\n\n" +
	"Tip: you don't want to open the same file " + iterations + " times"
);
