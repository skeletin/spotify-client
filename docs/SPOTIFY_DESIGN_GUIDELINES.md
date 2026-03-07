# Spotify Design Guidelines — Implementation Summary

This app follows [Spotify's Design Guidelines](https://developer.spotify.com/documentation/design) for displaying Spotify content and branding. Below is how we implement the main rules.

## Artwork

- **Corner radius**: 4px on small/medium screens, 8px on large (Tailwind: `rounded-[4px]` / `lg:rounded-lg`).
- **No cropping**: Artwork is shown in its original form (e.g. `object-contain` or square container for square art).
- **No overlay**: No images, text, or playback controls on top of artwork; no logo on artwork.
- **Source**: Only artwork provided by Spotify is used.

## Metadata

- Track, artist, playlist, and album titles use metadata from Spotify and stay legible.
- Truncation when space is limited; full metadata available (e.g. on detail view or via tooltip).
- Layout accommodates roughly: playlist/album 25 chars, artist 18 chars, track 23 chars.

## Browsing Content

- **Full row**: Each content set is a full row (shelf) dedicated to Spotify content.
- **Max 20 items**: No more than 20 items per set; "Keep exploring on Spotify" links to the Spotify app/site.
- **Attribution**: Spotify logo or icon used to attribute content.

## Playing Views

- **Attribution**: Spotify logo/icon shown where we display Spotify playback.
- **Playback controls**: Only play/pause in-app; progress bar is for information only (no seeking).
- **Link to Spotify**: "LISTEN ON SPOTIFY" / "OPEN SPOTIFY" / "PLAY ON SPOTIFY" when the Spotify app is available; "GET SPOTIFY FREE" when not installed.
- **Background**: Prefer extracted artwork color or Spotify dark `#191414`.

## Logo & Colors

- **Spotify Green**: `#1DB954` (primary); dark background `#191414`.
- **Logo**: Green logo on black/white; monochrome (black/white) on other backgrounds. Icon min 21px, full logo min 70px when used.

## Fonts

- Prefer platform default sans-serif; fallback order: Helvetica Neue, Helvetica, Arial (Tailwind `font-sans`).

## Linking to Spotify

- All uses of Spotify metadata link back to the Spotify service (e.g. track/playlist/album URLs to `open.spotify.com` or `spotify:` URIs).
