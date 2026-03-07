class NavigationLinkComponent < ViewComponent::Base
  def initialize(navigation_link:)
    @href = navigation_link[:href]
    @title = navigation_link[:title]
  end

  def is_active?
    current_page?(@href)
  end

  def navigation_link_style
    base_classes = "group flex items-center justify-between rounded-xl border px-3 py-2 font-semibold uppercase tracking-[0.08em] transition"

    if is_active?
      "#{base_classes} border-[#1db954]/40 bg-[#1db954]/15 text-white"
    else
      "#{base_classes} border-transparent text-white/75 hover:border-[#1db954]/25 hover:bg-[#1db954]/10 hover:text-white"
    end
  end

  def indicator_style
    if is_active?
      "h-2 w-2 rounded-full bg-[#1db954]"
    else
      "h-2 w-2 rounded-full bg-transparent transition group-hover:bg-[#1db954]/60"
    end
  end


  erb_template <<~ERB
    <%= link_to(@href, class: navigation_link_style) do %>
      <span><%= @title %></span>
      <span class="<%= indicator_style %>"></span>
    <% end%>
  ERB
end
