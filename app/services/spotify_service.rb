require "net/http"
require "uri"
require "json"

class SpotifyService
  def exchange_code_for_token(code)
    uri = URI.parse("https://accounts.spotify.com/api/token")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)

    # 🔥 Add headers here
    request["Content-Type"] = "application/x-www-form-urlencoded"

    # Spotify recommends Basic Auth header instead of sending client_secret in body
    credentials = Base64.strict_encode64(
        "#{Rails.application.credentials.spotify.client_id}:" \
        "#{Rails.application.credentials.spotify.client_secret}"
    )
    request["Authorization"] = "Basic #{credentials}"

    # Body
    request.set_form_data(
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://127.0.0.1:3000/callback"
    )

    response = http.request(request)

    JSON.parse(response.body).transform_keys(&:to_sym)
  end

  def get_me(access_token)
        uri = URI.parse("https://api.spotify.com/v1/me")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        request = Net::HTTP::Get.new(uri.request_uri)
        request["Authorization"] = "Bearer #{access_token}"
        response = http.request(request)
        JSON.parse(response.body).transform_keys(&:to_sym)
  end
end