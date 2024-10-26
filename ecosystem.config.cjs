module.exports = {
    apps: [{
        name: "exocortex-transcription-bot",
        script: "bun",
        args: "app/index.ts",
        watch: false, // отключаем watch
        max_memory_restart: "1G",
        env: {
            NODE_ENV: "production"
        }
    }]
}