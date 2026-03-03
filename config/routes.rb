Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#home"

  get "/login", to: "sessions#login", as: "login"
  get "/callback", to: "pages#callback", as: "callback"
  get "/dashboard", to: "pages#dashboard", as: "dashboard"
  get "/get_me", to: "pages#get_me", as: "get_me"
end
