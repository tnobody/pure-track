require("cross-fetch/polyfill");
require("dotenv").config();

const fs = require("node:fs");

(async () => {
  const { token } = await login(process.env.PB_USER, process.env.PB_PASSWORD);
  let i = 0;
  const allData = getData();
  for (let data of allData) {
    const r = await createLog(data, token);
    console.log(`${i}/${allData.length}`);
    i++;
  }
})();
 
function login(identity, password) {
  return fetch(
    "https://pure-track.pockethost.io/api/admins/auth-with-password",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "http://10.0.0.9:5173/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify({
        identity,
        password,
      }),
      method: "POST",
    }
  ).then((r) => r.json());
}

function createLog(data, token) {
  return fetch("https://pure-track.pockethost.io/api/collections/Log/records", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      Referer: "http://10.0.0.9:5173/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      authorization: token,
    },
    body: JSON.stringify(data),
    method: "POST",
  }).then((r) => r.json());
}

function getData() {
  return fs
    .readFileSync("./data.tsv", {
      encoding: "utf-8",
    })
    .trim()
    .split("\n")
    .map((l) => l.trim().split("\t"))
    .map(
      ([_, day, ex, set, targetRep, repetitions, weight, date, comment]) => ({
        day: getDayId(day),
        exercise: getExId(ex),
        set: Number(set),
        targetRep: Number(targetRep),
        repetitions: Number(repetitions),
        weight: Number(weight.replace(",", ".")),
        date: `${formatDate(date)} 00:00:00.123Z`,
        comment: comment ?? "",
      })
    );
}

function formatDate(date) {
  const [day, mon, year] = date.split(".");
  return [year, mon, day].join("-");
}

function getDayId(dayName) {
  return (
    {
      PULL: "0wac3x1kcvr58uu",
      PUSH: "ywat41z5jswl1he",
      LEG: "vdwkand867k5yit",
    }[dayName] ?? fail("No id for day " + dayName)
  );
}

function getExId(exName) {
  return (
    {
      Wadenheben: "x8lkqn1ir7an6m5",
      "Step Ups": "c42que83n1r13pv",
      "Reverse Hyperextension": "vfy8iooju6gh8lu",
      "Bulgarian Split Squat": "8clyzomnqlkzoj3",
      "Hip Thrust": "da0ftklu84a6cyk",
      "Goblet Squats": "14ytpqryzob688g",
      Deadlift: "7jupt5tqq63hvhd",
      "Cable French Press": "h87prmvkc457e8t",
      Seitheben: "2hvngy1m8r1twhq",
      "Military Press": "3ilehz99mhmkobt",
      "Cable Cross": "wtrqab4qscxx1j2",
      Dips: "u3l6hzxqdny4uaa",
      "KH Schrägbankdrücken": "v3649sjhigjwc6p",
      Bankdrücken: "c7oalcl50yuftx1",
      "KH Curls": "3j64lmrh3453it4",
      "Face Pulls": "tl5ci1n7yeceizc",
      Shrugs: "erknz1zfjehqlt3",
      "T-Bar Rudern": "kwmhvbg1327gwrs",
      "KH Rudern einarmig": "dt5jlry7qbsvd31",
      "LH Rudern": "91n6tcqf412b5on",
      "Pull up": "0j1rujk962hvm7d",
    }[exName] ?? fail("No id for " + exName)
  );
}

function fail(msg) {
  throw Error(msg);
}
