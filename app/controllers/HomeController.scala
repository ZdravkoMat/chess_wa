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

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController with Observer {
  val board = Board()
  val controller = Controller(board)

  controller.add(this)

  def home = Action {
    Ok(views.html.home())
  }

  def getData() = {
    val squares = controller.squareData()
    val (white_stack, black_stack) = controller.captureStacks()
    (squares, white_stack, black_stack)
  }

  def newGame = Action {
    controller.doAndPublish(controller.newGame)
    val (squares, white_stack, black_stack) = getData()
    Ok(views.html.game(squares, white_stack, black_stack))
  }

  def move(from: String, to: String) = Action {
    controller.doAndPublish(controller.makeMove, Move(from, to))
    val (squares, white_stack, black_stack) = getData()
    Ok(views.html.game(squares, white_stack, black_stack))
  }

  def undo() = Action {
    controller.doAndPublish(controller.undo)
    val (squares, white_stack, black_stack) = getData()
    Ok(views.html.game(squares, white_stack, black_stack))
  }

  def redo() = Action {
    controller.doAndPublish(controller.redo)
    val (squares, white_stack, black_stack) = getData()
    Ok(views.html.game(squares, white_stack, black_stack))
  }

  def update(e: Event): Unit = e match {
    case Event.Quit =>
    case Event.Move =>
  }
}
