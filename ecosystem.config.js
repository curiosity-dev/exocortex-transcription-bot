module.exports = {
    apps: [{
        name: "exocortex-transcription-bot",
        script: "bun",
        args: "app/index.ts",
        watch: true,
        env: {
            NODE_ENV: "production"
        }
    }]
}