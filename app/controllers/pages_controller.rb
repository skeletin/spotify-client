class PagesController < ApplicationController
  def home
  end

  def dashboard
  end

  def playlists
    @playlists = SpotifyService.new(access_token: cookies.encrypted[:access_token]).get_playlists
  end
end
