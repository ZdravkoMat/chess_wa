package controllers

import javax.inject._

import play.api.mvc._
import htwg.se.chess.ChessModule
import htwg.se.model.BoardComponent.BoardInterface

@Singleton
class ChessController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
    val gameController = ChessModule.gameController
    val board = ChessModule.board

    def chess = Action { implicit request =>
        Ok(views.html.chess(gameController, board))
    }
}