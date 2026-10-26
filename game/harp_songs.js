// Harp-duel songs: made by tools/make_harp_chart.py from Glen's harp recordings (don't edit by hand).
// Each note is a pluck in the recording (t = seconds into the mp3); its button comes from its pitch.
const HARP_SONGS = {
 "donkey": {
  "file": "harp_donkey.mp3",
  "notes": [
   {
    "t": 3.765,
    "b": "up"
   },
   {
    "t": 5.112,
    "b": "a"
   },
   {
    "t": 7.399,
    "b": "left"
   },
   {
    "t": 9.686,
    "b": "right"
   },
   {
    "t": 11.474,
    "b": "up"
   },
   {
    "t": 13.332,
    "b": "b"
   },
   {
    "t": 16.083,
    "b": "right"
   },
   {
    "t": 17.476,
    "b": "down"
   },
   {
    "t": 18.835,
    "b": "up"
   },
   {
    "t": 21.157,
    "b": "a"
   },
   {
    "t": 22.573,
    "b": "b"
   },
   {
    "t": 24.558,
    "b": "left"
   },
   {
    "t": 25.928,
    "b": "right"
   },
   {
    "t": 27.798,
    "b": "a"
   },
   {
    "t": 30.108,
    "b": "left"
   }
  ],
  "phrases": [
   {
    "from": 0,
    "to": 4,
    "start": 1.265
   },
   {
    "from": 4,
    "to": 9,
    "start": 9.874
   },
   {
    "from": 9,
    "to": 15,
    "start": 19.557
   }
  ],
  "source": "Morning_Meditation_2.mp3 28.0-61.608000000000004s, gap 1.0"
 },
 "saul": {
  "file": "harp_saul.mp3",
  "notes": [
   {
    "t": 2.745,
    "b": "down"
   },
   {
    "t": 3.303,
    "b": "a"
   },
   {
    "t": 4.847,
    "b": "right"
   },
   {
    "t": 5.392,
    "b": "down"
   },
   {
    "t": 6.321,
    "b": "left"
   },
   {
    "t": 7.285,
    "b": "up"
   },
   {
    "t": 8.736,
    "b": "right"
   },
   {
    "t": 9.259,
    "b": "up"
   },
   {
    "t": 9.769,
    "b": "down"
   },
   {
    "t": 10.721,
    "b": "left"
   },
   {
    "t": 11.256,
    "b": "b"
   },
   {
    "t": 12.219,
    "b": "down"
   },
   {
    "t": 13.252,
    "b": "right"
   },
   {
    "t": 14.204,
    "b": "down"
   },
   {
    "t": 15.156,
    "b": "a"
   },
   {
    "t": 15.667,
    "b": "right"
   },
   {
    "t": 16.643,
    "b": "up"
   },
   {
    "t": 17.165,
    "b": "right"
   },
   {
    "t": 18.129,
    "b": "left"
   },
   {
    "t": 19.127,
    "b": "a"
   },
   {
    "t": 20.648,
    "b": "right"
   },
   {
    "t": 21.182,
    "b": "up"
   },
   {
    "t": 22.61,
    "b": "left"
   },
   {
    "t": 23.597,
    "b": "b"
   },
   {
    "t": 24.607,
    "b": "left"
   },
   {
    "t": 25.663,
    "b": "b"
   },
   {
    "t": 26.186,
    "b": "left"
   },
   {
    "t": 26.697,
    "b": "a"
   },
   {
    "t": 27.254,
    "b": "left"
   },
   {
    "t": 27.765,
    "b": "b"
   },
   {
    "t": 28.276,
    "b": "a"
   },
   {
    "t": 28.821,
    "b": "right"
   },
   {
    "t": 29.495,
    "b": "up"
   },
   {
    "t": 30.424,
    "b": "b"
   },
   {
    "t": 31.376,
    "b": "down"
   },
   {
    "t": 32.339,
    "b": "a"
   },
   {
    "t": 33.326,
    "b": "b"
   },
   {
    "t": 35.753,
    "b": "left"
   },
   {
    "t": 36.716,
    "b": "a"
   },
   {
    "t": 37.25,
    "b": "right"
   },
   {
    "t": 39.154,
    "b": "down"
   },
   {
    "t": 40.153,
    "b": "b"
   },
   {
    "t": 41.163,
    "b": "right"
   },
   {
    "t": 42.15,
    "b": "down"
   },
   {
    "t": 43.624,
    "b": "b"
   },
   {
    "t": 44.623,
    "b": "a"
   },
   {
    "t": 45.157,
    "b": "down"
   },
   {
    "t": 46.62,
    "b": "right"
   },
   {
    "t": 48.094,
    "b": "up"
   },
   {
    "t": 49.116,
    "b": "right"
   },
   {
    "t": 50.068,
    "b": "a"
   },
   {
    "t": 51.078,
    "b": "b"
   },
   {
    "t": 52.796,
    "b": "left"
   },
   {
    "t": 54.061,
    "b": "up"
   },
   {
    "t": 55.037,
    "b": "right"
   },
   {
    "t": 56.592,
    "b": "a"
   },
   {
    "t": 57.15,
    "b": "right"
   },
   {
    "t": 57.661,
    "b": "down"
   },
   {
    "t": 58.613,
    "b": "left"
   },
   {
    "t": 59.599,
    "b": "b"
   },
   {
    "t": 60.586,
    "b": "up"
   },
   {
    "t": 61.155,
    "b": "up"
   },
   {
    "t": 62.595,
    "b": "right"
   }
  ],
  "phrases": [
   {
    "from": 0,
    "to": 8,
    "start": 0.245
   },
   {
    "from": 8,
    "to": 17,
    "start": 8.169
   },
   {
    "from": 17,
    "to": 27,
    "start": 15.565
   },
   {
    "from": 27,
    "to": 38,
    "start": 25.097
   },
   {
    "from": 38,
    "to": 50,
    "start": 35.116
   },
   {
    "from": 50,
    "to": 63,
    "start": 48.468
   }
  ],
  "source": "Morning_Meditation_1.mp3 4.0-70.095s, gap 0.5"
 }
};
