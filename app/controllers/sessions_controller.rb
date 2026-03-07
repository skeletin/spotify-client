class SessionsController < ApplicationController
  def login
    state = SecureRandom.hex(16)
    scope = [
      "user-read-private",
      "user-read-email",
      "streaming",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing"
    ].join(" ")
    redirect_uri = "http://127.0.0.1:3000/callback"

    cookies.signed[:spotify_auth_state] = {
      value: state,
      httponly: true,
      secure: Rails.env.production?
    }

    uri = URI.parse("https://accounts.spotify.com/authorize")
    uri.query = {
      response_type: "code",
      client_id: Rails.application.credentials.spotify.client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }.to_query

    redirect_to uri.to_s, allow_other_host: true
  end

  def callback
    code = params[:code] || nil
    state = params[:state] || nil
    stored_state = cookies ? cookies.signed[:spotify_auth_state] : nil

    if state == nil || stored_state != state
      redirect_to root_path(error: "state_mismatch"), status: :unauthorized
      return
    end

    cookies.delete(:spotify_auth_state)

    body = SpotifyService.new.exchange_code_for_token(code)
    access_token = body[:access_token]
    refresh_token = body[:refresh_token]
    granted_scope = body[:scope].to_s

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

    cookies.signed[:spotify_scopes] = {
      value: granted_scope,
      httponly: true,
      secure: Rails.env.production?
    }

    redirect_to dashboard_path
  end
end
