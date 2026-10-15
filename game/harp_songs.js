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
    "t": 3.303,
    "b": "a"
   },
   {
    "t": 5.392,
    "b": "down"
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
    "t": 10.721,
    "b": "left"
   },
   {
    "t": 12.219,
    "b": "down"
   },
   {
    "t": 13.752,
    "b": "down"
   },
   {
    "t": 15.667,
    "b": "a"
   },
   {
    "t": 17.165,
    "b": "up"
   },
   {
    "t": 19.127,
    "b": "b"
   },
   {
    "t": 21.182,
    "b": "right"
   },
   {
    "t": 23.597,
    "b": "left"
   },
   {
    "t": 25.164,
    "b": "down"
   },
   {
    "t": 26.697,
    "b": "a"
   },
   {
    "t": 27.765,
    "b": "left"
   },
   {
    "t": 29.495,
    "b": "up"
   },
   {
    "t": 31.376,
    "b": "down"
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
    "t": 37.25,
    "b": "right"
   },
   {
    "t": 38.655,
    "b": "b"
   },
   {
    "t": 40.153,
    "b": "left"
   },
   {
    "t": 42.15,
    "b": "down"
   },
   {
    "t": 44.623,
    "b": "a"
   },
   {
    "t": 46.62,
    "b": "right"
   },
   {
    "t": 48.918,
    "b": "up"
   },
   {
    "t": 50.068,
    "b": "right"
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
    "t": 57.15,
    "b": "right"
   },
   {
    "t": 59.599,
    "b": "b"
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
    "to": 4,
    "start": 0.803
   },
   {
    "from": 4,
    "to": 9,
    "start": 9.121
   },
   {
    "from": 9,
    "to": 14,
    "start": 17.527
   },
   {
    "from": 14,
    "to": 20,
    "start": 26.165
   },
   {
    "from": 20,
    "to": 26,
    "start": 37.055
   },
   {
    "from": 26,
    "to": 33,
    "start": 48.468
   }
  ],
  "source": "Morning_Meditation_1.mp3 4.0-70.095s, gap 1.05"
 }
};
