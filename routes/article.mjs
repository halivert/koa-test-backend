import Router from "koa2-router"
import { ArticleImageController } from "../controllers/article-image.mjs"
import { ArticleController } from "../controllers/article.mjs"

const router = new Router()

router.get("/articles", ArticleController.index)
router.post("/articles", ArticleController.store)
router.get("/articles/:id", ArticleController.show)
router.put("/articles/:id", ArticleController.update)
router.delete("/articles/:id", ArticleController.destroy)

router.post("/articles/:id/image", ArticleImageController.store)
router.get("/articles/:id/image", ArticleImageController.get)

export { router as articleRouter }
