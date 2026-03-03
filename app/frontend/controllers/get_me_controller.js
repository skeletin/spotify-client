import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["output", "country", "displayName"];

  information() {
    fetch("/get_me")
      .then((res) => res.json())
      .then((data) => {
        const { country, display_name } = data;
        this.countryTarget.textContent = country;
        this.displayNameTarget.textContent = display_name;
      });
  }
}
