package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import htwg.se.chess.model.boardComponent.Board
import htwg.se.chess.controller.Controller

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  def chessAsText = Board().startPos()

  def displayChessboard = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index(chessAsText))
  }
}
