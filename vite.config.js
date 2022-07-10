// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                connect: resolve(__dirname, 'connect/index.html'),
                privacyPolicy: resolve(__dirname, 'privacy-policy/index.html'),
                blog: resolve(__dirname, 'blog/index.html'),
                addArticles: resolve(__dirname, 'blog/add/index.html'),
                editArticle: resolve(__dirname, 'blog/edit/index.html'),
                article: resolve(__dirname, 'blog/article/index.html'),
                // notFound: resolve(__dirname, 'not-found/index.html'),
                addTestimonials: resolve(__dirname, 'testimonials/add/index.html'),
                editTestimonial: resolve(__dirname, 'testimonials/edit/index.html'),
                testimonial: resolve(__dirname, 'testimonials/history/index.html'),
                // connect 
                connectLogin: resolve(__dirname, 'connect/signIn/index.html'),
                connectSignUp: resolve(__dirname, 'connect/signOut/index.html'),
            }
        }
    }
})