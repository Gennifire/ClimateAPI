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
            const title = $(this).text() //get text from article
            const url = $(this).attr('href') //ger url from article

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

//scraping tool for specific websites
app.get('/news/:newspaperId', async (req, res) => {
    //console.log(req.params.newspaperId)
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base
   // console.log(newspaperAddress)

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})


//listen for connections  on port (set by your server)
app.listen(PORT, () => console.log('server is running on port ' + PORT))
