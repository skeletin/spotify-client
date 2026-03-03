class PagesController < ApplicationController
    def home
    end

    def dashboard
    end

    def get_me
        render json: SpotifyService.new.get_me(cookies.signed[:access_token]), status: :ok
    end


    def callback
      code = params[:code] || nil
      state = params[:state] || nil
      stored_state = cookies ? cookies.signed[:spotify_auth_state] : nil

      if state == nil || stored_state != state
        redirect_to root_path(error: "state_mismatch"), status: :unauthorized
      else 
        cookies.delete(:spotify_auth_state)

        body = SpotifyService.new.exchange_code_for_token(code)
        body => { access_token:, refresh_token: }

        cookies.encrypted[:refresh_token] = {
          value: refresh_token,
          httponly: true,
          secure: Rails.env.production?
        }

        cookies.encrypted[:access_token] = {
          value: access_token,
          httponly: true,
          secure: Rails.env.production?
        }
        redirect_to dashboard_path
      end
    end
end