import { Application } from "@hotwired/stimulus";
import GetMeController from "../controllers/get_me_controller";
import SpotifyPlayerController from "../controllers/spotify_player_controller"

const app = Application.start();
app.debug = false;

app.register("get-me", GetMeController);
app.register("spotify-player", SpotifyPlayerController)

window.Stimulus = app;
