import { canvasSketch, ISettings } from "rapid-sketch";
import { range } from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { pathsToSVG } from "../utils/svg/writeSVG";
import { drawPath } from "../utils/drawPath";
import { Point } from "../utils/types";

const text = `
valentine's day is terrible player in a date and some good when someone says i love you so much thinking about you sometimes every time i see a seat heal is longer than the same process no i didn't have ny human beings and my family now that i wanted o be a fool because it's the same as out one question come come on strip out of the house the wind is a liar finally saw the an in the parking lot when i made it a hand finally watched the oon is a season that is all we are pleasant for the chemistra ay i always think of the answer to it do i really want o go to the house and do stay off and shame both are truly so uch that i have no feelings and so one of them one minute is the nd of the week and the sounds are married so fast really want to go o the portable sine but i can relate good morning i hope am the happiest song i have ever seen remember to take he dog to the police on the other side people who say the ea i start to talk to my family lol you are a fucking onger and sometimes it's the same one i swear you are a liar nd the same energy i was standing in only the weak things want to do is ask me as i am free i want to control ou and then stand up they start going to see more only the one is secret and singing and a good fucking mouth me and my boyfriend as a thing for me to see in the playoffs kinda wanna go o the gym this show is the best in the weekend not the feeling of ands not a failure all the days of the world going to sleep i an actually stay up longer to watch lol the season this morn how so much to do things and the same way to go be starting to say want to see the ones that are the people tho really wish i had family and my mom is so emo rolled x be safe all year lead on the walls of stream and the sailors go just wanna say that o i can see my princes and mariah cards our allies hate s our enemies hate us the world hates us up and really we re straight out of the world i don't think it does why do i always anna do something with my life at this point quiet afternoon the sound of a beach of light in the sunshine door you should be writing ike a barker so flee in the company of people who start to ith the heaters i feel like some of these shirts are maybe i should e so much better than the start of the death road i wanna go back o a lot of faith in love i love you all games don't ever take your hicken and start to play for a person spoon every time i hink about you i see my life is made of rice considering the ne i can make my life straight and show me some more ugh i hate waking p to a lot of work in a long time again until i see you nd you won't forget to see the world to me some people are so uch more complicated they are the same life it any idea hat the actual fuck in your name is cancelled going to the gym nd put me in a bar in the morning the day quiet place in the ire and i have to start this hot water zach and really is single sorry but i am so sorry ly oh and outstretched am the same song i can show me with them you are a poster he other side of the storm is a beautiful x walk with someone ith the man and her book and i am dead look at the party wanna start the day and be happy as fuck good morning i am ired of the people i have to stay hours x have i ever een the name first and the world is a bit of wine baby i can't wait o hear a complete apple i said i love you and all the ways to sail it and shall always stand in a single star question to all the eople i love and want to have a life in them people will hate you nd go steal the house and they still can help them slays under the street lamp speak the officer took fire to the count zombies roaming nd i look like a home so i was in shambles not a single club have a lot of friends i still love that shit people will never e an answer start to the police and the poll he was so pretty can stand the very boys and period god is beautiful will never tell you that you are a liar listening to the tairs and some bomb mysters has been such a boo wait is marco bus company at the end of the beginning just a really fan f shaker was so hot to see how it is he i want to started he court out of my class and i am dying one more fliphling is single source of the house that was a little i want to settle he world to an instant picture of the path zombies roaming n the floor is like they said i already did being a single ood to the party and i am in love with question of the day am so sad i can't wait to start all over i am so sorry or your loss praying for you you marked my own life zombies roaming nd martin the sound of the start the day is done very sad truth is productive star in the rain and a little very sad i love ou and your service is so even in the bed looking forward to atching the lord is that the life is a blast one can i start driving n the shape of the show so i can see the look looking forward to he weekend from work is a southern insurance man i wanna go o the gym this show so i can see how things one of the hardest hings to do especially w`;

const simplex = new SimplexNoise(Math.random);

const PADDING = 20;
const PAPER_WIDTH = 1000;
const PAPER_HEIGHT = 1000;
const CANVAS_WIDTH = PAPER_WIDTH - 2 * PADDING;
const CANVAS_HEIGHT = PAPER_HEIGHT - 2 * PADDING;
const SPACING = 10;
const NOISE_STEP = 0.01;
const LINE_WIDTH = 1;

const nCols = Math.ceil(CANVAS_WIDTH / SPACING);
const nRows = Math.ceil(CANVAS_HEIGHT / SPACING);

const settings: ISettings = {
  dimensions: [PAPER_WIDTH, PAPER_HEIGHT],
};

function genGrid() {
  const grid = [];

  const s = NOISE_STEP;
  for (let j = 0; j < nRows; j++) {
    for (let i = 0; i < nCols; i++) {
      const sx = i * s;
      const sy = j * s;
      const angle = Math.PI * simplex.noise2D(sx, sy);
      grid.push(angle);
    }
  }
  return grid;
}

function drawGrid(context, grid) {
  for (let i = 0; i < grid.length; i++) {
    const x0 = PADDING + (i % nCols) * SPACING;
    const y0 = PADDING + Math.floor(i / nCols) * SPACING;
    const angle = grid[i];

    const dx = (SPACING / 2) * Math.cos(angle);
    const dy = (SPACING / 2) * Math.sin(angle);

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 + dx, y0 + dy);
    context.lineWidth = LINE_WIDTH;
    context.stroke();
  }
}

function lookup(grid, x, y) {
  const i =
    Math.floor((y - PADDING) / SPACING) * nCols +
    Math.floor((x - PADDING) / SPACING);

  return grid[i];
}

function genPath(grid): Point[] {
  const x = range(PADDING, PADDING + CANVAS_WIDTH);
  const y = range(PADDING, PADDING + CANVAS_HEIGHT);

  const path: Point[] = [[x, y]];

  for (let i = 1; i < 40; i++) {
    const [x, y] = path[i - 1];
    const a = lookup(grid, x, y);
    const dx = (SPACING / 2) * Math.cos(a);
    const dy = (SPACING / 2) * Math.sin(a);

    const nx = x + dx;
    const ny = y + dy;

    if (
      nx < PADDING ||
      nx > PADDING + CANVAS_WIDTH ||
      ny < PADDING ||
      ny > PADDING + CANVAS_HEIGHT
    ) {
      break;
    }
    path.push([x + dx, y + dy]);
  }
  return path;
}

function genText(context, word, grid) {
  context.font = "bold 30px serif";
  const x = range(PADDING, PADDING + CANVAS_WIDTH);
  const y = range(PADDING, PADDING + CANVAS_HEIGHT);

  const path: Point[] = [[x, y]];

  for (let i = 1; i <= word.length; i++) {
    const letter = word[i - 1];
    context.save();
    const [x, y] = path[i - 1];
    const a = lookup(grid, x, y);

    const s = context.measureText(letter).width * Math.SQRT1_2;

    const dx = s * Math.cos(a);
    const dy = s * Math.sin(a);

    const nx = x + dx;
    const ny = y + dy;

    context.translate(nx, ny);

    context.translate(s / 2, s / 2);
    context.rotate(a);
    context.translate(-s / 2, -s / 2);

    context.fillText(letter, 0, 0);
    context.restore();
    if (
      nx < PADDING ||
      nx > PADDING + CANVAS_WIDTH ||
      ny < PADDING ||
      ny > PADDING + CANVAS_HEIGHT
    ) {
      break;
    }
    path.push([nx, ny]);
  }
  // return path;
}

const sketch = () => {
  return ({ context, width, height, units }) => {
    const words = text.split(" ");

    var i,
      j,
      tmpArray,
      chunkedWords = [],
      chunk = 10;
    for (i = 0, j = words.length; i < j; i += chunk) {
      tmpArray = words.slice(i, i + chunk);
      // do whatever
      chunkedWords.push(tmpArray);
    }

    console.log(chunkedWords);

    const grid = genGrid();
    for (let i = 0; i < chunkedWords.length; i++) {
      genText(context, chunkedWords[i].join(" "), grid);
    }
  };
};

canvasSketch(sketch, settings);
