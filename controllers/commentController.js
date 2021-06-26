const helpers = require('../_helpers')
const { Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: helpers.getUser(req).id
      })

      res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (error) {
      next(error)
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      if (!comment) return res.redirect('back')

      comment.destroy()
      res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
