class PlaylistCardComponent < ViewComponent::Base
  def initialize(playlist_card:)
    @name = playlist_card[:name]
    @owner = playlist_card[:owner]
    @image_url = playlist_card[:image_url]
    @spotify_url = playlist_card[:spotify_url]
    @playlist_id = playlist_card[:id]
  end
end
