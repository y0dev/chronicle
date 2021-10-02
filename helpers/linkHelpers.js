const request = require('request');
const cheerio = require('cheerio');

function getPhoto(photos) {
  const arrayLen = photos.length - 1;
  const selectedPhoto = { image: '', alt: '' };

  return new Promise((resolve) => {
    for (let photo = 0; photo < arrayLen; photo += 1) {
      const attributes = photos[photo].attribs;
      if (attributes.width >= 200
        && attributes.height >= 200) {
        selectedPhoto.image = attributes.src;
        selectedPhoto.alt = attributes.alt;
        break;
      }
    }

    resolve(selectedPhoto);
  });
}

const parseHtmlLink = (link) => {
  let linkInfo = { };
  return new Promise((resolve) => {
    request(link, async (_err, _response, html) => {
      const dom = cheerio.load(html);
      const photos = dom('img');
      const image = await getPhoto(photos);
      linkInfo = {
        title: dom('title').text(),
        keywords: dom("meta[name='Keywords']").attr('content') || dom("meta[name='keywords']").attr('content') || dom('body').text(),
        metaDescription: dom("meta[property='og:description']").attr('content') || dom("meta[name='Description']").attr('content'),
        image: dom("meta[property='og:image']").attr('content') || image.image,
        site_name: dom("meta[property='og:site_name']").attr('content'),
        alt: image.alt,
      };
    
      resolve(linkInfo);
    });
  });
};

module.exports = {
  parseHtmlLink,
};
