class NavigationComponent < ViewComponent::Base
  def navigation_links
    [
      {
        title: "Home",
        href: dashboard_path
      },
      {
        title: "Playlists",
        href: playlists_path
      }
    ]
  end
end
