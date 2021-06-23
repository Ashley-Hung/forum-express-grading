const { Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })

      res.redirect(`/restaurants/${req.bosy.restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
