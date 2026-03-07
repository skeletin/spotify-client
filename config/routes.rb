Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#home"
  get "/dashboard", to: "pages#dashboard", as: "dashboard"
  get "/dashboard/playlists", to: "pages#playlists", as: "playlists"
  get "/dashboard/playlists/:playlist_id", to: "pages#playlist", as: "playlist"

  get "/login", to: "sessions#login", as: "login"
  get "/callback", to: "sessions#callback", as: "callback"
end
