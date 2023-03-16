const http = require('http');
const url = require('url');
const exec = require('child_process').exec;
const hostname = '127.0.0.1';
const port = 3000;
let response = null;
const filterResult = '/run/lock';
const token = 'xxxxxxxxxx';

http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const q = url.parse(req.url, true).query;
    if (Object.keys(q).length > 0 && q.t != null) {
        if (q.t != token) {
            res.end('Token is not correct.\n');
        } else {
            response = res;
            let filter = '';
            if (q.a == null || q.a == undefined) {
                filter = filterResult;
                if (q.f != null) {
                    filter = q.f;
                }
            }

            execute(generateCommand(filter), show);
        }
    } else {
        res.end('We need a token.\n');
    }
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function generateCommand(filter) {
    let cmd = '';
    if (filter != '') {
        cmd = 'df -h | grep "' + filter + '\\|Mounted on" && printf "\n" && df -i | grep "' + filter + '\\|Mounted on"';
    } else {
        cmd = 'df -h && printf "\n" && df -i';
    }

    return cmd;
}

function execute(command, callback) {
    exec(command, function(error, stdout, stderr){
        callback(stdout);
    });
}

function show(stdout) {
    response.end(stdout);
}
