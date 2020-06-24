# MyALD Task Runner

Execute the project deploys to azure/kubernetes systems, by properly updating the versions

## Install

```bash
npm ci
```

## Run

```bash
$ node deploy <service1> <service2> etc..
```

Service parameter can be:

`pwa`, `bo-frontend` or one of the microservices, like `cms`, `contract`, etc.

Example: `$ node deploy vehicle`

---

## License

MIT
