package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.twirl.api.Html
import com.google.inject.Guice

import htwg.se.chess.model.boardComponent.Board
import htwg.se.chess.controller.Controller
import htwg.se.chess.util.Observer
import htwg.se.chess.util.Event
import htwg.se.chess.model.boardComponent.Move
import htwg.se.chess.model.boardComponent.Coord
import htwg.se.chess.model.boardComponent.Coord._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  val board = Board()
  val controller = Controller(board)

  // controller.add(this)

  def home = Action {
    Ok(views.html.home())
  }

  def rules = Action {
    Ok(views.html.rules())
  }

  def game_play() = Action {
    val squares = controller.squareDataStr()
    val (white_stack, black_stack) = controller.captureStacks()
    val move_options = List()
    val turn = controller.turn().toString.toLowerCase
    val advantage = controller.advantage()
    val king_checked_coord = controller.kingCheckedCoord().getOrElse("").toString.toLowerCase
    val winner = controller.winner().getOrElse("").toString.toLowerCase
    Ok(views.html.game_play(squares, white_stack, black_stack, move_options, turn, advantage, king_checked_coord, winner))
  }

  def newGame = Action {
    controller.doAndPublish(controller.newGame)
    Redirect(routes.HomeController.game_play)
  }

  def move(from: String, to: String) = Action {
    controller.doAndPublish(controller.makeMove, Move(Coord.fromStr(from), Coord.fromStr(to)))
    Redirect(routes.HomeController.game_play)
  }

  // def moveOptions(from: String) = Action {
  //   val squares = controller.squareDataStr()
  //   val (white_stack, black_stack) = controller.captureStacks()
  //   val move_options: List[String] = controller.moveOptions(from).map(_.toString.toLowerCase)
  //   Ok(views.html.game_play(squares, white_stack, black_stack, move_options))
  // }

  def undo() = Action {
    controller.doAndPublish(controller.undo)
    Redirect(routes.HomeController.game_play)
  }

  def redo() = Action {
    controller.doAndPublish(controller.redo)
    Redirect(routes.HomeController.game_play)
  }

  def boardJson = Action {
    Ok(controller.boardJson())
  }

  def moveOptionsJson(from: String) = Action {
    Ok(controller.moveOptionsJson(Coord.fromStr(from)))
  }

}
