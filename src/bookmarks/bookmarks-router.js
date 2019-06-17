const express = require('express')
const logger = require('../logger')
const uuid = require('uuid/v4')
const { bookmarks } = require('../store.js')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const { title, url, description, rating } = req.body

    const bookmark = { id: uuid(), title, url, description, rating }

    bookmarks.push(bookmark)

    logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark)
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(b => b.id == id)

    console.log(id)
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id == id)

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Not found')
    }

    bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter