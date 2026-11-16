export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  spotifyUrl: string;
}

export interface ReadingItem {
  title: string;
  author: string;
  coverImage: string;
  status: string;
  note?: string;
  startedDate?: string;
  goodreadsUrl?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tag: string;
  snippet: string;
  content: string[];
}

export const tabletData = {
  spotifyPlaylist: {
    title: 'best taylor swift bridges to scream at (hitting strong at 3am)',
    url: 'https://open.spotify.com/playlist/1JLB7C9BQlZXixHWssD8m1?si=5sW2cuSRSnGEF9QvpUZ4HA',
    coverImage: '/assets/objects/spotify-playlist-cover.jpg',
    tracks: [
      { id: '1', title: "All Too Well (10 Minute Version) (Taylor's Version)", artist: 'Taylor Swift', album: 'Red (Taylor’s Version)', spotifyUrl: 'https://open.spotify.com/track/5enxwA8aAbwZbf5YrCHvgR' },
      { id: '2', title: 'champagne problems', artist: 'Taylor Swift', album: 'evermore', spotifyUrl: 'https://open.spotify.com/track/0sY6vdndJZXNmviaTrgBS3' },
      { id: '3', title: 'illicit affairs', artist: 'Taylor Swift', album: 'folklore', spotifyUrl: 'https://open.spotify.com/track/2NmsngXAvMmXZx2LVtup4W' },
      { id: '4', title: 'Getaway Car', artist: 'Taylor Swift', album: 'reputation', spotifyUrl: 'https://open.spotify.com/track/0VE4TA5v44okFAnmnKjga4' },
      { id: '5', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', spotifyUrl: 'https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr' },
      { id: '6', title: "Is It Over Now? (Taylor's Version) (From The Vault)", artist: 'Taylor Swift', album: '1989 (Taylor’s Version)', spotifyUrl: 'https://open.spotify.com/track/1Iq8oo9XDoQam4SCGTAvTj' },
      { id: '7', title: "Out Of The Woods (Taylor's Version)", artist: 'Taylor Swift', album: '1989 (Taylor’s Version)', spotifyUrl: 'https://open.spotify.com/track/045ZeOHMb3Q1efL44fO9uJ' },
      { id: '8', title: "You're On Your Own, Kid", artist: 'Taylor Swift', album: 'Midnights', spotifyUrl: 'https://open.spotify.com/track/4D7BC2gf3bYSlXZunHURbG' },
      { id: '9', title: 'my tears ricochet', artist: 'Taylor Swift', album: 'folklore', spotifyUrl: 'https://open.spotify.com/track/1MgV7FIyNxIG7Wz2r4JA1o' },
      { id: '10', title: 'Death By A Thousand Cuts', artist: 'Taylor Swift', album: 'Lover', spotifyUrl: 'https://open.spotify.com/track/2dgFqt3w9xIQRjhPtwNk3D' },
      { id: '11', title: 'King Of My Heart', artist: 'Taylor Swift', album: 'reputation', spotifyUrl: 'https://open.spotify.com/track/7zwfUlBYIqHhNX5nbZrhnv' },
      { id: '12', title: 'Dress', artist: 'Taylor Swift', album: 'reputation', spotifyUrl: 'https://open.spotify.com/track/6oepVWHqFGEZSpE2v1xXuh' },
      { id: '13', title: 'The Archer', artist: 'Taylor Swift', album: 'Lover', spotifyUrl: 'https://open.spotify.com/track/3pHkh7TkEFvhSlbtT4QISt' },
      { id: '14', title: 'august', artist: 'Taylor Swift', album: 'folklore', spotifyUrl: 'https://open.spotify.com/track/3hUxzQiv5Mpds3MGQOSHG1' },
      { id: '15', title: "New Romantics (Taylor's Version)", artist: 'Taylor Swift', album: '1989 (Taylor’s Version)', spotifyUrl: 'https://open.spotify.com/track/0qRR9d89hIS0MopCQn005C' },
      { id: '16', title: 'right where you left me', artist: 'Taylor Swift', album: 'evermore', spotifyUrl: 'https://open.spotify.com/track/3zwMVvkBe2qzwIOiStXPub' },
      { id: '17', title: 'cardigan', artist: 'Taylor Swift', album: 'folklore', spotifyUrl: 'https://open.spotify.com/track/4R2kfaDFslZEMLoQUTsio4' },
      { id: '18', title: 'marjorie', artist: 'Taylor Swift', album: 'evermore', spotifyUrl: 'https://open.spotify.com/track/1hxrhPZgK5nSuhsFsdD7P8' },
      { id: '19', title: 'ivy', artist: 'Taylor Swift', album: 'evermore', spotifyUrl: 'https://open.spotify.com/track/19CSr8rwW05VJLVI9txioW' },
      { id: '20', title: 'Clean', artist: 'Taylor Swift', album: '1989 (Taylor’s Version)', spotifyUrl: 'https://open.spotify.com/track/12nfwv7yZ7fJ34T3U0v5gX' },
    ],
  },
  currentlyReading: {
    title: 'Mother Mary Comes to Me',
    author: 'Arundhati Roy',
    coverImage: '/assets/objects/book-mother-mary.jpg',
    status: 'Currently Reading',
    note: 'A memoir of family, rebellion, and freedom.',
    startedDate: 'Nov 2026',
  },
  blogs: [
    {
      slug: 'welcome-to-my-little-nook',
      title: 'Welcome to my little digital corner',
      date: 'Nov 16, 2026',
      readTime: '2 min read',
      tag: 'Musings',
      snippet: 'Why I wanted an iPad nook in my room: a quiet home for non-tech reflections, favorite passages, and warm cups of tea.',
      content: [
        'Welcome to this little tablet corner! While most of my days are spent designing systems, training agents, and obsessing over frontend animations, this nook is carved out for everything else.',
        'Here you’ll find books I’m currently holding, melodies that stay on repeat during late-night walks, and essays on life, memory, and small everyday curiosities.',
        'More personal essays and cozy reads will be landing here soon. Feel free to pull up a chair, put on a song, and enjoy your stay!',
      ],
    },
  ],
};
