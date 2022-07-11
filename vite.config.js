// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                connect: resolve(__dirname, 'connect/index.html'),
                signUp: resolve(__dirname, 'connect/signUp/index.html'),
                privacyPolicy: resolve(__dirname, 'privacy-policy/index.html'),
                blog: resolve(__dirname, 'blog/index.html'),
                addArticles: resolve(__dirname, 'blog/add/index.html'),
                editArticle: resolve(__dirname, 'blog/edit/index.html'),
                article: resolve(__dirname, 'blog/article/index.html'),
                // notFound: resolve(__dirname, 'not-found/index.html'),
                addTestimonials: resolve(__dirname, 'testimonials/add/index.html'),
                editTestimonial: resolve(__dirname, 'testimonials/edit/index.html'),
                testimonial: resolve(__dirname, 'testimonials/history/index.html'),
                quiz: resolve(__dirname, 'quiz/index.html'),
                quizResult: resolve(__dirname, 'quiz/results.html'),
                q1 : resolve(__dirname, 'quiz/q1.html'),
                q2 : resolve(__dirname, 'quiz/q2.html'),
                q3 : resolve(__dirname, 'quiz/q3.html'),
                q4 : resolve(__dirname, 'quiz/q4.html'),
                q5 : resolve(__dirname, 'quiz/q5.html'),
                q6 : resolve(__dirname, 'quiz/q6.html'),
                q7 : resolve(__dirname, 'quiz/q7.html'),
                q8 : resolve(__dirname, 'quiz/q8.html'),
                q9 : resolve(__dirname, 'quiz/q9.html'),
                q10 : resolve(__dirname, 'quiz/q10.html'),
                travels : resolve(__dirname, 'travels/read/index.html'),
            }
        }
    }
})