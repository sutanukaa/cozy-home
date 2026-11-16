export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  spotifyUrl: string;
  previewUrl?: string;
  coverImage?: string;
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
      {
        id: '5enxwA8aAbwZbf5qCHORXi',
        title: "All Too Well (10 Minute Version) (Taylor's Version) (From The Vault)",
        artist: 'Taylor Swift',
        album: 'Red (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/5enxwA8aAbwZbf5qCHORXi',
        previewUrl: 'https://p.scdn.co/mp3-preview/57b5f697db04a6f463de366927093882cfd5a00b',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02318443aab3531a0558e79a4d',
      },
      {
        id: '1gcyHQpBQ1lfXGdhZmWrHP',
        title: 'champagne problems',
        artist: 'Taylor Swift',
        album: 'evermore',
        spotifyUrl: 'https://open.spotify.com/track/1gcyHQpBQ1lfXGdhZmWrHP',
        previewUrl: 'https://p.scdn.co/mp3-preview/033519b1930ef8cf19f2e42bfc31edc97f0bfa1f',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0290fd9741e1838115cd90b3b6',
      },
      {
        id: '6DrLROM5MG9bxWHeEG5elq',
        title: 'illicit affairs',
        artist: 'Taylor Swift',
        album: 'folklore',
        spotifyUrl: 'https://open.spotify.com/track/6DrLROM5MG9bxWHeEG5elq',
        previewUrl: 'https://p.scdn.co/mp3-preview/2bf7d46ec1d3c5128a16a998e2effa103d4aee3d',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c288028c2592f400dd0b9233',
      },
      {
        id: '0VE4kBnHJUgtMf0dy6DRmW',
        title: 'Getaway Car',
        artist: 'Taylor Swift',
        album: 'reputation',
        spotifyUrl: 'https://open.spotify.com/track/0VE4kBnHJUgtMf0dy6DRmW',
        previewUrl: 'https://p.scdn.co/mp3-preview/3b7c75273822da52311019692f2db7b933d1b74f',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02da5d5aeeabacacc1263c0f4b',
      },
      {
        id: '1BxfuPKGuaTgP7aM0Bbdwr',
        title: 'Cruel Summer',
        artist: 'Taylor Swift',
        album: 'Lover',
        spotifyUrl: 'https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr',
        previewUrl: 'https://p.scdn.co/mp3-preview/dba15da5409f3c808022cf927c0ff8581f717aa4',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e787cffec20aa2a396a61647',
      },
      {
        id: '1Iq8oo9XkmmvCQiGOfORiz',
        title: "Is It Over Now? (Taylor's Version) (From The Vault)",
        artist: 'Taylor Swift',
        album: '1989 (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/1Iq8oo9XkmmvCQiGOfORiz',
        previewUrl: 'https://p.scdn.co/mp3-preview/0b79d49dd1a1cb45e9d01356c9bf5e18ee8243bb',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024110bfab1185fdfc9dfc2cf0',
      },
      {
        id: '045ZeOHPIzhxxsm8bq5kyE',
        title: "Out Of The Woods (Taylor's Version)",
        artist: 'Taylor Swift',
        album: '1989 (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/045ZeOHPIzhxxsm8bq5kyE',
        previewUrl: 'https://p.scdn.co/mp3-preview/7d165d73d1a4334a31295bfca2d3c32909319e3a',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024110bfab1185fdfc9dfc2cf0',
      },
      {
        id: '4D7BCuvgdJlYvlX5WlN54t',
        title: "You're On Your Own, Kid",
        artist: 'Taylor Swift',
        album: 'Midnights',
        spotifyUrl: 'https://open.spotify.com/track/4D7BCuvgdJlYvlX5WlN54t',
        previewUrl: 'https://p.scdn.co/mp3-preview/b471fac54e77dbf60355f10cf5a337498e8d6dcf',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02bb54dde68cd23e2a268ae0f5',
      },
      {
        id: '1MgV7FIyNxIG7WzMRJV5HC',
        title: 'my tears ricochet',
        artist: 'Taylor Swift',
        album: 'folklore',
        spotifyUrl: 'https://open.spotify.com/track/1MgV7FIyNxIG7WzMRJV5HC',
        previewUrl: 'https://p.scdn.co/mp3-preview/e641c7131aadd22adf5a1648f9690297e4a2f532',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0295f754318336a07e85ec59bc',
      },
      {
        id: '2dgFqt3w9xIQRjhPtwNk3D',
        title: 'Death By A Thousand Cuts',
        artist: 'Taylor Swift',
        album: 'Lover',
        spotifyUrl: 'https://open.spotify.com/track/2dgFqt3w9xIQRjhPtwNk3D',
        previewUrl: 'https://p.scdn.co/mp3-preview/a9c603c0799740a8cc4c1a1dae417b898dd2d994',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e787cffec20aa2a396a61647',
      },
      {
        id: '7HuBDWi18s4aJM8UFnNheH',
        title: 'King Of My Heart',
        artist: 'Taylor Swift',
        album: 'reputation',
        spotifyUrl: 'https://open.spotify.com/track/7HuBDWi18s4aJM8UFnNheH',
        previewUrl: 'https://p.scdn.co/mp3-preview/0516a831776b659d81ca0ad0377cf9988285fa07',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02da5d5aeeabacacc1263c0f4b',
      },
      {
        id: '6oVxXO5oQ4pTpO8RSnkzvv',
        title: 'Dress',
        artist: 'Taylor Swift',
        album: 'reputation',
        spotifyUrl: 'https://open.spotify.com/track/6oVxXO5oQ4pTpO8RSnkzvv',
        previewUrl: 'https://p.scdn.co/mp3-preview/46a65898e667e5fc7dc27043556c7d9076cc9399',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02da5d5aeeabacacc1263c0f4b',
      },
      {
        id: '3pHkh7d0lzM2AldUtz2x37',
        title: 'The Archer',
        artist: 'Taylor Swift',
        album: 'Lover',
        spotifyUrl: 'https://open.spotify.com/track/3pHkh7d0lzM2AldUtz2x37',
        previewUrl: 'https://p.scdn.co/mp3-preview/7d7405c983a3b69e8ff021ea86d68c246bad675b',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e787cffec20aa2a396a61647',
      },
      {
        id: '3hUxzQpSfdDqwM3ZTFQY0K',
        title: 'august',
        artist: 'Taylor Swift',
        album: 'folklore',
        spotifyUrl: 'https://open.spotify.com/track/3hUxzQpSfdDqwM3ZTFQY0K',
        previewUrl: 'https://p.scdn.co/mp3-preview/8e82ad5f6e681af7f3b261417e4187d345a9530c',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0295f754318336a07e85ec59bc',
      },
      {
        id: '2vPMoMDXxu9uX1igWZmXSG',
        title: "New Romantics (Taylor's Version)",
        artist: 'Taylor Swift',
        album: '1989 (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/2vPMoMDXxu9uX1igWZmXSG',
        previewUrl: 'https://p.scdn.co/mp3-preview/cec62529e8db35f06df849921d764cb4bc8a0568',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024110bfab1185fdfc9dfc2cf0',
      },
      {
        id: '6NFyWDv5CjfwuzoCkw47Xf',
        title: 'Delicate',
        artist: 'Taylor Swift',
        album: 'reputation',
        spotifyUrl: 'https://open.spotify.com/track/6NFyWDv5CjfwuzoCkw47Xf',
        previewUrl: 'https://p.scdn.co/mp3-preview/82d8c7dbb14aad1b405f02fd83ccb84174284208',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02da5d5aeeabacacc1263c0f4b',
      },
      {
        id: '3sW3oSbzsfecv9XoUdGs7h',
        title: 'Enchanted (Taylor\'s Version)',
        artist: 'Taylor Swift',
        album: 'Speak Now (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/3sW3oSbzsfecv9XoUdGs7h',
        previewUrl: 'https://p.scdn.co/mp3-preview/76bb94bd68dc612bd9e2cee7381738f1c644f09e',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020b04da4f224b51ff86e0a481',
      },
      {
        id: '4hqJ4bSlYJOXb6Z4SRmzxs',
        title: 'Long Live (Taylor\'s Version)',
        artist: 'Taylor Swift',
        album: 'Speak Now (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/4hqJ4bSlYJOXb6Z4SRmzxs',
        previewUrl: 'https://p.scdn.co/mp3-preview/f81bb225e8c543521c674a87d9274ec207975d74',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020b04da4f224b51ff86e0a481',
      },
      {
        id: '19CSr8rwW05VJL2F91KFNK',
        title: 'ivy',
        artist: 'Taylor Swift',
        album: 'evermore',
        spotifyUrl: 'https://open.spotify.com/track/19CSr8rwW05VJL2F91KFNK',
        previewUrl: 'https://p.scdn.co/mp3-preview/6fa0771d6bc320736ce6b74c060e8106e80a7f8b',
        coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0233b8541201f1ef38941024be',
      },
      {
        id: '2ByBBvpR9b7IynvRmnG7kG',
        title: "Clean (Taylor's Version)",
        artist: 'Taylor Swift',
        album: '1989 (Taylor’s Version)',
        spotifyUrl: 'https://open.spotify.com/track/2ByBBvpR9b7IynvRmnG7kG',
        previewUrl: 'https://p.scdn.co/mp3-preview/ec1f725a037d7b4e63c25e54291a4ddc087a07b3',
        coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024110bfab1185fdfc9dfc2cf0',
      },
    ],
  },
  currentlyReading: {
    title: 'Mother Mary Comes to Me',
    author: 'Arundhati Roy',
    coverImage: '/assets/objects/book-mother-mary.jpg',
    status: 'Reading',
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
