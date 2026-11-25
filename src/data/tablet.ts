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

export type BlogBlock =
  | { type: 'callout'; label?: string; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  readTime: string;
  tag: string;
  snippet: string;
  content?: string[];
  blocks?: BlogBlock[];
}

export interface TabletData {
  spotifyPlaylist: {
    title: string;
    url: string;
    coverImage: string;
    tracks: PlaylistTrack[];
  };
  currentlyReading: ReadingItem;
  blogs: BlogPost[];
}

export const tabletData: TabletData = {
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
      slug: 'eleven-days-one-comeback',
      title: 'Eleven Days, One Comeback: The Second Chance Only Men Get',
      subtitle:
        'A long look at patriarchy, power and the Nvidia boardroom. Written November 25, 2026. The story is still moving, and everything below reflects reporting available as of today.',
      date: 'Nov 25, 2026',
      readTime: '8 min read',
      tag: 'Essay',
      snippet:
        "On November 23, Nvidia's board brought Jensen Huang back as CEO, eleven days after he resigned. Plenty of people see one irreplaceable genius — I think the comeback exposes something older.",
      blocks: [
        {
          type: 'callout',
          label: 'The argument in one paragraph.',
          text: "On November 23, Nvidia's board brought Jensen Huang back as CEO, eleven days after he resigned over an admitted affair and a national-security scare. Plenty of people see that as a story about one irreplaceable genius. I think it says something else. The comeback only made sense because Huang is a man, and a woman in the same position would almost certainly have been shown the door for good. The reasons run through old, familiar machinery: who gets seen as indispensable, whose sex life counts as a private slip and whose counts as a character flaw, and whose mistakes get forgiven. This is an argument, not a proof, and the last section covers where it's weakest.",
        },
        {
          type: 'heading',
          text: '1. What actually happened',
        },
        {
          type: 'paragraph',
          text: 'Huang co-founded Nvidia in 1993 and had run it ever since, more than three decades. On November 12, 2026, the company announced his resignation and named CFO Colette Kress interim CEO while the board searched for a permanent replacement. The trigger was a scandal. Huang admitted an extramarital affair in a letter to employees, and media reports identified the woman as a suspected Chinese intelligence asset. China has denied the allegation, and the board said it had no reason to believe national security or Nvidia secrets were compromised. More reports of other relationships followed, including one with an Nvidia employee, according to the same timeline and Forbes’ account.',
        },
        {
          type: 'paragraph',
          text: "The board sounded final. On November 17, chair Harvey Jones said on an earnings call that the board didn't intend to reinstate him. Kress said the same in interviews.",
        },
        {
          type: 'paragraph',
          text: "Then, within days, it flipped. President Trump publicly urged the board to rehire Huang, and Semafor reported that he even joined the board's meeting by phone. Bloomberg reported that the board decided on November 22 without consulting Kress or other senior executives, who were told at the last minute. On November 23 the board unanimously reinstated Huang, citing input from senior levels of the U.S. government and saying it was confident he posed no national-security risk. Nvidia's stock closed up 31% that day, after falling nearly a third since his admission.",
        },
        {
          type: 'paragraph',
          text: 'So a CEO admits an affair, gets removed with a stated "no way back," and is back in the chair in under two weeks, to market applause. Is that path open to everyone?',
        },
        {
          type: 'heading',
          text: '2. How patriarchy works without anyone plotting',
        },
        {
          type: 'paragraph',
          text: 'People often picture patriarchy as a roomful of men scheming. Feminist theory mostly says the reverse. Sociologist Joan Acker\'s influential work on gendered organizations argues that jobs, hierarchies and even the idea of an "ideal worker" are built around a male default, so bias happens without anyone meaning it to. Rosabeth Moss Kanter, writing about corporate life in the 1970s, described homosocial reproduction: leaders tend to trust and promote people who resemble them, so the top of the pyramid keeps looking the same. R.W. Connell\'s idea of hegemonic masculinity describes the cultural script that links leadership with dominance, risk-taking and a certain ruthlessness.',
        },
        {
          type: 'paragraph',
          text: 'Seen this way, nobody on Nvidia\'s board has to think "we forgive him because he\'s a man." The forgiveness can come pre-installed, through the stories we tell about what a powerful person looks like. The next four sections take those stories one at a time.',
        },
        {
          type: 'heading',
          text: '3. The founder-genius myth, and who gets to be "irreplaceable"',
        },
        {
          type: 'paragraph',
          text: 'The loudest defense of Huang\'s return is economic. Analyst Dan Ives told CBS the board "had no choice" because Huang\'s absence had become a market and global economic issue. The stock\'s 31% jump seems to prove him right, and Nvidia did report US$215.9 billion in revenue in fiscal 2026.',
        },
        {
          type: 'paragraph',
          text: 'But why does the market believe one man is the company? Indispensability isn\'t a natural fact. It\'s a story. Silicon Valley\'s founder mythology (the leather jacket, the keynote, the visionary who "sees around corners") is overwhelmingly about men, and we\'ve been trained to read it as genius instead of as the work of thousands of engineers and executives. The "great man" theory of history survives in boardrooms because it turns one man\'s presence into a financial variable.',
        },
        {
          type: 'paragraph',
          text: "Now think about who actually held the seat. Colette Kress is Nvidia's longtime CFO and was named interim CEO. According to Wall Street Journal and Reuters reporting, as summarized on the scandal's reference page, she had questioned some of Huang's financing deals in the months before he left, and Huang had belittled her in an August meeting. Whether that was gendered is an interpretation, not a reported fact. Still, look at the setup. The woman who ran the company during the crisis was an interim by definition, and the man who caused the crisis was treated as the permanent fix. The market priced one as a stopgap and the other as a savior. Nobody was ever going to offer Kress that kind of mythology.",
        },
        {
          type: 'heading',
          text: '4. The sexual double standard: lapse versus character',
        },
        {
          type: 'paragraph',
          text: 'Societies judge sexual conduct very differently depending on who\'s doing it, and the asymmetry is well documented. A powerful man\'s affair usually gets framed as human weakness, a private matter, "complicated," something his wife and family have to absorb. A powerful woman\'s affair is more often treated as a verdict on her character, her judgment, her fitness to lead at all. Feminists trace this to the old virgin/whore binary, where a woman\'s sexual conduct reads as a moral credential and a man\'s doesn\'t.',
        },
        {
          type: 'paragraph',
          text: 'Philosopher Kate Manne, in *Down Girl*, names a related pattern, "himpathy": the outsized sympathy given to male perpetrators, so attention drifts to what a prosecution or a scandal will cost him. Look at how the Nvidia story gets told. The board\'s own language framed Huang as the possible target of a foreign intelligence effort. That may well be true, and I\'m not saying the woman in the story is guilty or innocent of anything. The reports about her are unproven and China denies them. But the way the story is told matters. In it, the man is the one things happen to, and the woman is the instrument. It\'s an old script, running from Delilah to the honeytrap spy of Cold War thrillers, where the woman supplies the danger and the man gets to be the sympathetic protagonist.',
        },
        {
          type: 'paragraph',
          text: 'Now flip it. Picture a female CEO who admitted an affair, with reports of more, and a foreign-intelligence question attached. Which adjectives would the coverage reach for? Be honest with yourself.',
        },
        {
          type: 'heading',
          text: '5. The evidence: women are punished more for the same misconduct',
        },
        {
          type: 'paragraph',
          text: 'Here the argument moves from hunch to data. The best-known study is "When Harry Fired Sally," by economists Mark Egan, Gregor Matvos and Amit Seru, published in the *Journal of Political Economy* in 2022. It tracked more than 1.2 million financial advisers and found three things.',
        },
        {
          type: 'bullets',
          items: [
            'After an incident of misconduct, 55% of women lost their jobs versus 46% of men, about 20% more likely for women.',
            'Women who lost their jobs were about 30% less likely to find a new one.',
            'Men were roughly three times as likely to have a misconduct record, were more likely to be repeat offenders, and committed misconduct that cost about 20% more to settle.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Put plainly, women got harsher punishment for less costly misconduct. The authors tested the obvious explanations, including productivity and experience, and couldn\'t account for the gap. One of them said the evidence was consistent with bias. They suggest this "punishment gap" may help sustain the glass ceiling itself. If men get second chances and women get exits, identical careers drift apart.',
        },
        {
          type: 'paragraph',
          text: "The obvious caveat is that financial advisers aren't Fortune 500 CEOs. Still, the study shows the mechanism at work in a real labor market, and it points the same way the Nvidia comeback does.",
        },
        {
          type: 'heading',
          text: '6. The glass cliff: women get the crisis, men get the rescue',
        },
        {
          type: 'paragraph',
          text: 'Researchers Michelle Ryan and Alexander Haslam coined the term "glass cliff" in 2005 after finding that companies appointing women to boards were more likely to have been performing consistently badly beforehand. Women, they argue, are disproportionately handed leadership when the risk of failure is highest, then blamed if they can\'t turn things around.',
        },
        {
          type: 'paragraph',
          text: "Lay that over November. Kress inherited the chair at a moment of maximum danger: a stock in free fall, a government-security cloud, and a board whose own chair had just said the founder was gone for good. By glass-cliff logic, a woman gets called in to hold the building while it burns, and the man gets called back to rescue it once it's safe. And Kress didn't fail. The board simply made its decision without her. A meta-analysis of the glass-cliff research (Morgenroth and colleagues, 2020) found the effect real but dependent on context, so I don't want to overclaim here.",
        },
        {
          type: 'heading',
          text: "7. Intersections: gender isn't the only factor",
        },
        {
          type: 'paragraph',
          text: 'A serious feminist analysis doesn\'t treat gender as the single lever. Kimberlé Crenshaw\'s concept of intersectionality applies to Huang too. He\'s a Taiwan-born immigrant who has described learning English from his mother in random batches of words, and he has also faced the "bamboo ceiling" that holds back Asian Americans in leadership. His story isn\'t one of unearned ease. That cuts against my argument in an uncomfortable way, though. Even a man at the intersection of race and immigration disadvantage can still collect the male dividend of forgiveness, which says something about how strong the gendered default is. It also keeps the counterexamples honest. Lisa Su, Huang\'s cousin and the CEO of rival AMD, shows that women do reach the very top of this same industry. Her success also shows how rare it is: women run just 11.2% of Fortune 500 companies, a record, and only 6.8% of the Global 500.',
        },
        {
          type: 'heading',
          text: '8. Where this argument is weakest',
        },
        {
          type: 'paragraph',
          text: 'An argument is only worth making if it survives its best objections. Here are mine.',
        },
        {
          type: 'paragraph',
          text: "**It's a counterfactual, and counterfactuals can't be proven.** We can't rerun November with a female founder. Saying she would \"never\" have returned is a judgment about probability, backed by research on bias. It isn't a demonstrated fact.",
        },
        {
          type: 'paragraph',
          text: "**There's a strong non-gender explanation.** Huang is a 33-year founder at the center of the AI chip economy, the stock lost roughly a third of its value without him, and the U.S. government reportedly weighed in because of the geopolitical stakes around chips and China. Plenty of analysts would say any CEO with that profile, man or woman, would have been called back. The board's own statement leaned on government input and a finding of no national-security risk, not on his gender.",
        },
        {
          type: 'paragraph',
          text: "**Men get fired for this too, and usually don't come back.** Male executives have left permanently over relationships, including McDonald's Steve Easterbrook and Intel's Brian Krzanich. That suggests founder status and market leverage, not maleness alone, may be doing most of the work here.",
        },
        {
          type: 'paragraph',
          text: '**Women do get top jobs and keep them.** There are more than 50 female Fortune 500 CEOs, and some research (including work cited by IMD Business School) finds women CEOs can have longer tenures once appointed. That complicates a simple "women are punished" story.',
        },
        {
          type: 'paragraph',
          text: '**The evidence comes from a different population.** The strongest punishment-gap data covers financial advisers, and the glass-cliff research depends on context. Neither studies how boards treat scandal-hit CEOs.',
        },
        {
          type: 'paragraph',
          text: '**Facts are still emerging.** The board\'s investigation is ongoing and several allegations are unproven. Anyone writing about this story should treat them as allegations.',
        },
        {
          type: 'heading',
          text: '9. The bottom line',
        },
        {
          type: 'paragraph',
          text: 'The fairest version of the thesis stops short of "Huang came back because he is a man, full stop." What I\'d defend is narrower. The conditions that made his comeback possible (the founder myth, the benefit of the doubt on sexual conduct, the assumption that his presence is a financial asset, and the instinct to rescue rather than replace) are conditions patriarchy hands out unevenly. A woman could have every one of Huang\'s business credentials and still not be given the social ones.',
        },
        {
          type: 'paragraph',
          text: "That's why the story is worth arguing over. Feminism's central claim was never that individual men are villains. It's that systems quietly hand out second chances along lines nobody voted for. An organization shows what it is by whom it forgives when they fall, and by whether the answer would change if the person were someone else. How it treats its stars while they're winning tells you much less. Nvidia's board has answered the question once. The rest of us get to decide whether we like what that answer says.",
        },
      ],
    },
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
