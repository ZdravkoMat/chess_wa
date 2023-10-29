package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import htwg.se.chess.model.BoardComponent.boardBaseImpl.Board

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {


  val initBoard: Board = Board.apply()

  def displayChessboard = Action {
    val newChessboard: Board = initBoard.startPos()
    Ok(views.html.index(newChessboard.toString()))
  }
}
