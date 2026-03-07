class SpotifyService
  BASE_URL = "https://api.spotify.com"

  def initialize(access_token: nil)
    @access_token = access_token
  end

  def exchange_code_for_token(code)
    # Spotify recommends Basic Auth header instead of sending client_secret in body
    credentials = Base64.strict_encode64(
        "#{Rails.application.credentials.spotify.client_id}:" \
        "#{Rails.application.credentials.spotify.client_secret}"
    )
    Faraday.new(url: "https://accounts.spotify.com") do |f|
      f.request  :url_encoded   # handles x-www-form-urlencoded
      f.response :json
      f.headers["Authorization"] = "Basic #{credentials}"
    end.post("/api/token", {
      grant_type:   "authorization_code",
      code:         code,
      redirect_uri: "http://127.0.0.1:3000/callback"
    }).body.transform_keys(&:to_sym)
  end

  def get_me
    connection.get("v1/me").body.transform_keys(&:to_sym)
  end

  def get_playlists
    # Spotify guideline: never show more than 20 items in a content set
    current_user_playlists = connection.get("v1/me/playlists", { limit: 20 }).body
    items = current_user_playlists.dig("items")
    if items
      items.map do |item|
        images = item.dig("images")
        image_url = images.present? ? images.first["url"] : nil
        external = item.dig("external_urls", "spotify")
        item.slice("name", "id").symbolize_keys.merge(
          owner: item.dig("owner", "display_name"),
          image_url: image_url,
          spotify_url: external
        )
      end
    else
      []
    end
  end

  private
  def connection
    @connection ||= Faraday.new(url: BASE_URL) do |f|
      f.request  :json
      f.response :json
      f.headers["Authorization"] = "Bearer #{@access_token}"
    end
  end
end
