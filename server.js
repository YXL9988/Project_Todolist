const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require("./errorHandle");
const todos = [];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    })

    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else {
                    errHandle(res)
                }
            } catch (error) {
                errHandle(res)
            }
        })
    } else if (req.url == "/todos" && req.method == "DELETE") {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id); //索引
        if (index !== -1) {
            todos.splice(index, 1); //真正刪除
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        } else {
            errHandle(res);
        }
    } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
        req.on('end', () => {
            try {
                const todo = JSON.parse(body).title;//body的title屬性:值)
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => {return element.id == id});
                if (todo !== undefined && index !== -1) {
                    todos[index].title = todo; //屬性裡的值做修改
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else {
                    errHandle(res);
                }
            } catch {
                errHandle(res);
            }

        })
    } else if (req.url == "/todos" && req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    }
    else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "No Route"
        }))
        res.end();
    }
}
const server = http.createServer((requestListener));
server.listen(3005);