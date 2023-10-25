name := """chess_wa"""
organization := "htwg.se"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.12"

libraryDependencies += "com.typesafe.play" %% "play-json" % "2.10.0-RC7"
libraryDependencies += "com.google.inject" % "guice" % "7.0.0"
libraryDependencies += "net.codingwell" %% "scala-guice" % "7.0.0"


// Adds additional packages into Twirl
//TwirlKeys.templateImports += "htwg.se.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "htwg.se.binders._"
