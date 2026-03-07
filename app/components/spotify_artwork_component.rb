# Renders Spotify-provided artwork per design guidelines:
# - Original form, no crop (object-contain), no overlay
# - 4px corner radius on small/medium, 8px on large
class SpotifyArtworkComponent < ViewComponent::Base
  def initialize(image_url:, size: :medium, alt: "Album art")
    @image_url = image_url
    @size = size
    @alt = alt
  end

  def size_classes
    case @size
    when :small then "h-10 w-10 sm:h-12 sm:w-12"
    when :medium then "h-14 w-14 sm:h-16 sm:w-16"
    when :large then "h-24 w-24 sm:h-32 sm:w-32"
    else "h-14 w-14 sm:h-16 sm:w-16"
    end
  end

  # 4px small/medium devices, 8px large (Tailwind: rounded-[4px] lg:rounded-lg)
  def radius_classes
    "rounded-[4px] lg:rounded-lg"
  end
end
