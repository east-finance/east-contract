Requirements: Docker, NodeJs

1) Install nodes sandbox to <sandbox_dir>: https://docs.wavesenterprise.com/ru/latest/how-to-setup/sandbox.html
2) Update nodes config section `docker-engine` at <sandbox_dir>/config/nodes/node-*/node.conf:
    ```
    docker-engine {
        enable = "yes"
        use-node-docker-host = "yes"
        execution-limits {
          timeout = "100s"
          memory = 1024
          memory-swap = 0
          startup-timeout = "100s"
        }
        remove-container-on-fail = "no"
        remove-container-after = "30m"
    }
    ```
3) Restart compose
4) Run logger: `npm run logger`
4) Build test contract image and watch logger output:
`npm run test`
