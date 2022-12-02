const PORT = 8000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

//calls express to release functionality in app
const app = express()

app.get('/', (req, res) => {
    res.json('Welcome to port 8000')
})

//global array variable for newspapers
const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            article.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })

    })
})

//global variable article
const article = []

//scraping tool for website
app.get('/news', (req, res) => {
    res.json(article)
})

app.get('/news/:newspaperId', (req, res) => {
  res.json(article)
})


//listen for connections  on port (set by your server)
app.listen(PORT, () => console.log('server is running on port ' + PORT))