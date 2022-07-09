// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                privacypolicy: resolve(__dirname, 'pages/privacy-policy.html'),
                connect: resolve(__dirname, 'pages/connect.html'),
                addArticles: resolve(__dirname, 'pages/blog/addArticles.html'),
                editArticle: resolve(__dirname, 'pages/blog/editArticle.html'),
                blog : resolve(__dirname, 'pages/blog/blog.html'),
                article : resolve(__dirname, 'pages/blog/readArticles.html'),
            }
        }
    }
})