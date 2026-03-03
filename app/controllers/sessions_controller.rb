class SessionsController < ApplicationController
    def login
        state = SecureRandom.hex(16) 
        scope = 'user-read-private user-read-email';
        redirect_uri = 'http://127.0.0.1:3000/callback'

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
            state: state
        }.to_query

        redirect_to uri.to_s, allow_other_host: true
    end
end