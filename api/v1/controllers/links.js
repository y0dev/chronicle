const Links = require('../../../models/Links');
const DigitalHistory = require('../../../models/DigitalHistory');
const asyncWrapper = require('../../../middleware/async');

const request = require('request');
const cheerio = require('cheerio');
const { createCustomError } = require('../../../helpers/error');

function getPhoto(photos) {
  const arrayLen = photos.length - 1;
  const selectedPhoto = { image: '', alt: '' };

  return new Promise((resolve) => {
    for (let photo = 0; photo < arrayLen; photo += 1) {
      const { width, height, src, alt } = photos[photo].attribs;
      if (width >= 200
        && height >= 200) {
        selectedPhoto.image = src;
        selectedPhoto.alt = alt;
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
      const $ = cheerio.load(html);
      const photos = $('img');
      const image = await getPhoto(photos);
      linkInfo = {
        title: $('title').first().text(),
        keywords: $("meta[name='Keywords']").attr('content') || $("meta[name='keywords']").attr('content') || $('body').text(),
        metaDescription: $("meta[property='og:description']").attr('content') || $("meta[name='Description']").attr('content'),
        image: $("meta[property='og:image']").attr('content') || image.image,
        site_name: $("meta[property='og:site_name']").attr('content'),
        alt: image.alt,
      };
      // console.log(linkInfo);
      resolve(linkInfo);
    });
  });
};
const getLinkInfoById = asyncWrapper( async (req,res,next) => {
   const { id } = req.params;
   const link = await Links.findById(id);
   if(!link) {
      return next(createCustomError('Could not find a link', 404));
   }
   const { title, url, description, dateAdded } = link;
   return res.status(200).json({
      title,
      description,
      url, dateAdded
   });
});

const getLinkInfoByKeyword = asyncWrapper( async (req,res,next) => {
   const { keyword } = req.body;
   if (keyword !== undefined && keyword !== '') {
      const links = await Links.find({ 'keywords' : { $regex: keyword, $options: 'i' }});
      if(!links || links.length < 1) {
         return next(createCustomError(`Could not find any links with the following keyword "${keyword}"`, 404));
      }
      let newLinks = [];
      links.forEach( link => {
         const { title, url, description, dateAdded } = link;
         newLinks.push({
            title,
            description,
            url, dateAdded
         });
      });
      sortLinksBy(newLinks,'dateAdded','desc');
      return res.status(200).json({
         keyword,
         websites: newLinks,
       });
   } 
   
   return next(createCustomError(`The must be a keyword`, 404));
});

const addHistory = async (linkId,id = undefined, name = undefined) => {
   if (name != undefined) {
      const history = await DigitalHistory.create({
        name,
        linkIds: [linkId],
      });
      if(!history) {
         return res.status(500).json({msg: `Could not create an object with name: ${name}`});
      }
    } else if (id != undefined) {
      const history = await DigitalHistory.findOneAndUpdate({ _id: id },
        { $push: { linkIds: linkId} });
        if (!history) {
         return res.status(500).json({msg: `Could not find and update the object with id: ${id}`});
        }
    }
};

const sortLinksBy = (links,sort,direction='asc') => {
   links.sort(function(a, b){
       if (direction === 'desc') {
           return b[sort] - a[sort]
       }
       return a[sort] - b[sort]
   });
}

const addLink = asyncWrapper( async (req,res, next) => {
   const { historyId, historyName, link: theLink } = req.body;
   if ((theLink && historyId) || (theLink && historyName)) {
      const { title, keywords, image, alt, metaDescription: desc } = await parseHtmlLink(theLink);
      // add it to database
      const link = await Links.create({
         url: theLink,
         title: title,
         keywords: [keywords],
         image: image,
         description: desc,
         alt: alt,
         });
      if (!link) {
         return next(createCustomError('Could not create a Link Object', 500));
      }
      addHistory(link._id,historyId,historyName);
      return res.send(link);
    }

    return next(createCustomError('Link, historyId, or historyName is missing', 404));

});

module.exports = {
   addLink,
   getLinkInfoById,
   getLinkInfoByKeyword,
};
