# Simple Webhooks

`config.json`

```
{
	"port": 8080,
	"reload": "/reloadConfig",
	"listeners": {
		"/ls": "ls",
		"/lsall": "ls -a",
		"/user": "whoami"
	}
}
```

`node index.js`

```
listening on 8080
```

```
$ curl http://localhost:8080/ls
config.json
index.js
README.md

$ curl http://localhost:8080/user
<yourusername>

```
