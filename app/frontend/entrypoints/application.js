import { Application } from "@hotwired/stimulus";
import GetMeController from "../controllers/get_me_controller";

const app = Application.start();
app.debug = false;

app.register("get-me", GetMeController);

window.Stimulus = app;
