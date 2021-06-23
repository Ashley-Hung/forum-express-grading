const { Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })

      res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (error) {
      next(error)
    }
  },

  deleteComment: async (req, res, next) => {
    const comment = await Comment.findByPk(req.params.id)
    if (!comment) throw new Error('comment not found.')

    comment.destroy()
    res.redirect(`/restaurants/${comment.RestaurantId}`)
  }
}

module.exports = commentController
