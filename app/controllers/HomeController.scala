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

import play.api.libs.streams.ActorFlow
import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.actor._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) (implicit system: ActorSystem, mat: Materializer) extends BaseController {
  val controller = Controller(Board())

  object MyWebSocketActor {
    def props(out: ActorRef) = {
      Props(new MyWebSocketActor(out))
    }
  }

  class MyWebSocketActor(out: ActorRef) extends Actor with Observer {
    controller.add(this)
    def receive = {
      case msg: String =>
        out ! ("[SERVER] I received your message: " + msg)
    }


    override def update(e: Event): Unit = e match {
      case Event.Move => {
        sendSquares
        sendGameInfo
      }
      case _ => println("[SERVER] unknown event")
    }

    def sendJsonToClient = {
      out ! (controller.boardJson().toString)
    }

    def sendSquares = out ! (controller.squaresJson().toString)
    def sendGameInfo = out ! (controller.gameInfoJson().toString)
  }

  def socket() = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MyWebSocketActor.props(out)
    }
  }


  def home() = Action {
    Ok(views.html.home())
  }

  def rules() = Action {
    Ok(views.html.rules())
  }

  def gameInit() = Action {
    val squares = controller.squareInit()
    Ok(views.html.game_play(squares))
  }

  def newGame() = Action {
    controller.doAndPublish(controller.newGame)
    Redirect(routes.HomeController.gameInit())
  }

  def move(from: String, to: String) = Action {
    controller.doAndPublish(controller.makeMove, Move(Coord.fromStr(from), Coord.fromStr(to)))
    Ok("Move done...")
  }

  def undo() = Action {
    controller.doAndPublish(controller.undo)
    Ok("Undo to done...")
  }

  def undoTo(n: String) = Action {
    controller.doUndoTo(controller.undoTo, n.toInt)
    Ok("UndoTo done...")
  }

  def redo() = Action {
    controller.doAndPublish(controller.redo)
    Ok("Redo done...")
  }

  def redoSteps(i: String) = Action {
    controller.doRedoSteps(controller.redoSteps, i.toInt)
    Ok("RedoSteps done...")
  }

  def initBoardJson() = Action {
    Ok(controller.initBoardJson())
  }

  def squaresJson() = Action {
    Ok(controller.squaresJson())
  }

  def checkedCoordJson() = Action {
    Ok(controller.checkedCoordJson())
  }

  def gameInfoJson() = Action {
    Ok(controller.gameInfoJson())
  }

  def boardJson() = Action {
    Ok(controller.boardJson())
  }

  def moveOptionsJson(from: String) = Action {
    Ok(controller.moveOptionsJson(Coord.fromStr(from)))
  }

}
