const axios = require('axios');
const cheerio = require('cheerio');
const { sourceUrl1, sourceUrl2} = require("../config.json");

module.exports.articleService = {
    getSource1: async () => {
        const url = sourceUrl1;
        try {
          const { data } = await axios.get(url);
          return data;
        } catch (error) {
          console.log(error);
          return [];
        }
    },
    getSource2: async () => {
        const url = sourceUrl2;
        try {
          const response = await axios.get(url);
          const $ = cheerio.load(response.data);
          const articles = [];
      
          $('.category_contents_details article').each((index, element) => {
            const articleTitle = $(element).find('a.article__title').text().trim();
            const articleLink = url+$(element).find('a.article__title').attr('href').slice(6);
            const articleDate = $(element).find('.article__badge-date').attr('data-utctime');
      
            articles.push({
              date: articleDate,
              title: {rendered:articleTitle},
              link: articleLink,
            });
          });
      
          return articles;
        } catch (error) {
          console.error('Помилка при отриманні статей:', error.message);
          return [];
        }
    }
}