class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  helper_method :get_access_token, :spotify_granted_scopes

  private

  def get_access_token
    cookies.encrypted[:access_token].presence
  end

  def spotify_granted_scopes
    cookies.signed[:spotify_scopes].to_s
  end
end
