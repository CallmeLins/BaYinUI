import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { SongsPage } from "./components/SongsPage";
import { SearchPage } from "./components/SearchPage";
import { ScanMusicPage } from "./components/ScanMusicPage";
import { PlayerPage } from "./components/PlayerPage";
import { AlbumsPage } from "./components/AlbumsPage";
import { AlbumDetailPage } from "./components/AlbumDetailPage";
import { ArtistsPage } from "./components/ArtistsPage";
import { ArtistDetailPage } from "./components/ArtistDetailPage";
import { PlaylistsPage } from "./components/PlaylistsPage";
import { PlaylistDetailPage } from "./components/PlaylistDetailPage";
import { MusicLibraryPage } from "./components/MusicLibraryPage";
import { SettingsPage } from "./components/SettingsPage";
import { AboutPage } from "./components/AboutPage";
import { NavidromeConfigPage } from "./components/NavidromeConfigPage";
import { UserInterfacePage } from "./components/UserInterfacePage";
import { HelpFeedbackPage } from "./components/HelpFeedbackPage";
import { UpdateSoftwarePage } from "./components/UpdateSoftwarePage";
import { CreatorsPage } from "./components/CreatorsPage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { LicensesPage } from "./components/LicensesPage";
import { DonatePage } from "./components/DonatePage";
import { OfficialWebsitePage } from "./components/OfficialWebsitePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SongsPage },
      { path: "search", Component: SearchPage },
      { path: "scan", Component: ScanMusicPage },
      { path: "player", Component: PlayerPage },
      { path: "albums", Component: AlbumsPage },
      { path: "albums/:albumId", Component: AlbumDetailPage },
      { path: "artists", Component: ArtistsPage },
      { path: "artists/:artistId", Component: ArtistDetailPage },
      { path: "playlists", Component: PlaylistsPage },
      { path: "playlists/:playlistId", Component: PlaylistDetailPage },
      { path: "library", Component: MusicLibraryPage },
      { path: "settings", Component: SettingsPage },
      { path: "settings/interface", Component: UserInterfacePage },
      { path: "settings/help", Component: HelpFeedbackPage },
      { path: "settings/update", Component: UpdateSoftwarePage },
      { path: "about", Component: AboutPage },
      { path: "about/creators", Component: CreatorsPage },
      { path: "about/terms", Component: TermsPage },
      { path: "about/privacy", Component: PrivacyPage },
      { path: "about/licenses", Component: LicensesPage },
      { path: "about/donate", Component: DonatePage },
      { path: "about/website", Component: OfficialWebsitePage },
      { path: "navidrome-config", Component: NavidromeConfigPage },
    ],
  },
]);