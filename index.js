const fs = require("fs");
const { Hercai } = require('hercai');

const herc = new Hercai();
const axios = require("axios");
const cherrio = require("cheerio");
const { remini } = require('betabotz-tools');

const express = require("express");

const app = express();
app.use(express.json());

const port = 8080;


app.get("/", async function (req, res) { 
 res.send({success: "please put /html to view all APIs"});
    
 });

app.get("/html", async function (req, res) {
  const html = fs.readFileSync("index.html", "utf8");

  res.send(html);
});

app.get('/gpt4', async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    res.json({ error: "Please provide 'ask' parameter" });
    return;
  }

  try {
    const answer = await herc.question({ model: "v1", content: ask });
    res.json({ answer: answer.reply });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/meme", async function (req, res) {
  try {
    const gen = await axios.get("https://meme-api.com/gimme");

    res.send(gen.data);
  } catch (error) {
    console.error("Error fetching meme:", error);

    res.status(500).send("Error fetching meme");
  }
});


app.get("/api/stalk/tools", async function (req, res) {
  let uid = req.query.uid;

  if (!uid) return res.status(400).json({ error: "missing uid" }); // Fixed the syntax error here

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like) Version/12.0 eWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
    accept: "application/json, text/plain, /",
  };

  const token = "EAAD6V7os0gcBOZCHL9wT1uMCZCNCZCgKedaYhswGpsFNlQmVEeGyXUavO8CGeNhzEmAOjcmO38htZCMVZAPg8WWBAUJ7E3OMc6M7LdwWLrkbZBbVhrQgR2F0IWmil5Oh0eZBDiwiDmPzkmxlZBhyaUcEkz33My1bn2ltMDICXNAVRPdm9eoUgzn5GomZAQCGDxNTBSgZDZD";

  try {
    const response = await axios.get(
      `https://graph.facebook.com/${uid}?fields=id,is_verified,cover,created_time,work,hometown,username,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`,
      { headers },
    );

    console.log(response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/tiktokdl/tools", async (req, res) => {
  const link = req.query.link;
  if (!link) {
    res.json({ error: "Please provide a TikTok video link." });
  } else {
    try {
      const response = await axios.post("https://www.tikwm.com/api/?hd=1", {
        url: link,
      });
const username = response.data.data.author.unique_id
const url = response.data.data.play
const nickname = response.data.data.author.nickname
const title = response.data.data.title
const like = response.data.data.digg_count
const comment = response.data.data.comment_count

res.json({username: username, nickname: nickname, url: url, title: title, like: like, comment: comment});
console.log(response.data)
      
    } catch (error) {
      // handle error
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }
});

app.get("/api/tiksearch/tools", async (req, res) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res.json({ error: "Missing data to launch the program" });
    }

    const response = await axios.post("https://www.tikwm.com/api/feed/search", {
      keywords: search,
    });

    const data = response.data;

    if (data.data && data.data.videos && data.data.videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.videos.length);

      const randomVideo = data.data.videos[randomIndex];

      const result = {
        code: 0,

        msg: "success",

        processed_time: 0.9624,

        data: {
          videos: [randomVideo],
        },
      };

      return res.json(result);
    } else {
      return res.json({ error: "No videos found" });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/sim/tools", async (req, res, error) => {
  try {
    let path = `./sim.json`;
    let dataa = JSON.parse(fs.readFileSync(path));
    let tete = req.query.ask;

    if (tete === "Eugene") {
      return res.json({ respond: "handsome" });
    }
  if (tete == "eugene") {
    return res.json({ respond: "pogi"
    });
     }

    var dataaa = dataa[tete][Math.floor(Math.random() * dataa[tete].length)];

    res.json({
      respond: dataaa,
    });
  } catch (err) {
    console.error(err);
    return res.json({
     respond: "I don't understand what your saying please teach me.",
  });
    }
});

app.get("/api/teach/tools", async (req, res) => {
  let ask = req.query.ask;

  let ans = req.query.ans;

  if (!ask || !ans) return res.json({ err: "Missing ans or ask query!" });

  let path = `./sim.json`;

  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

  let dataa = JSON.parse(fs.readFileSync(path));

  if (!dataa[ask]) dataa[ask] = [];

  res.json({
    ask: ask,

    ans: ans,
  });

  dataa[ask].push(ans);

  fs.writeFileSync(path, JSON.stringify(dataa, null, 4));
});

app.get("/pinterest", async (req, res) => {
  var search = req.query.search;

  if (!search) return res.json({ error: "Missing search query!✨" });

  var headers = {
    authority: "www.pinterest.com",

    "cache-control": "max-age=0",

    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",

    "upgrade-insecure-requests": "1",

    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",

    "sec-gpc": "1",

    "sec-fetch-site": "same-origin",

    "sec-fetch-mode": "same-origin",

    "sec-fetch-dest": "empty",

    "accept-language": "en-US,en;q=0.9",

    cookie:
      'csrftoken=92c7c57416496066c4cd5a47a2448e28; g_state={"i_l":0}; _auth=1; _pinterest_sess=TWc9PSZBMEhrWHJZbHhCVW1OSzE1MW0zSkVid1o4Uk1laXRzdmNwYll3eEFQV0lDSGNRaDBPTGNNUk5JQTBhczFOM0ZJZ1ZJbEpQYlIyUmFkNzlBV2kyaDRiWTI4THFVUWhpNUpRYjR4M2dxblJCRFhESlBIaGMwbjFQWFc2NHRtL3RUcTZna1c3K0VjVTgyejFDa1VqdXQ2ZEQ3NG91L1JTRHZwZHNIcDZraEp1L0lCbkJWUytvRis2ckdrVlNTVytzOFp3ZlpTdWtCOURnbGc3SHhQOWJPTzArY3BhMVEwOTZDVzg5VDQ3S1NxYXZGUEEwOTZBR21LNC9VZXRFTkErYmtIOW9OOEU3ektvY3ZhU0hZWVcxS0VXT3dTaFpVWXNuOHhiQWdZdS9vY24wMnRvdjBGYWo4SDY3MEYwSEtBV2JxYisxMVVsV01McmpKY0VOQ3NYSUt2ZDJaWld6T0RacUd6WktITkRpZzRCaWlCTjRtVXNMcGZaNG9QcC80Ty9ZZWFjZkVGNURNZWVoNTY4elMyd2wySWhtdWFvS2dQcktqMmVUYmlNODBxT29XRWx5dWZSc1FDY0ZONlZJdE9yUGY5L0p3M1JXYkRTUDAralduQ2xxR3VTZzBveUc2Ykx3VW5CQ0FQeVo5VE8wTEVmamhwWkxwMy9SaTNlRUpoQmNQaHREbjMxRlRrOWtwTVI5MXl6cmN1K2NOTFNyU1cyMjREN1ZFSHpHY0ZCR1RocWRjVFZVWG9VcVpwbXNGdlptVzRUSkNadVc1TnlBTVNGQmFmUmtrNHNkVEhXZytLQjNUTURlZXBUMG9GZ3YwQnVNcERDak16Nlp0Tk13dmNsWG82U2xIKyt5WFhSMm1QUktYYmhYSDNhWnB3RWxTUUttQklEeGpCdE4wQlNNOVRzRXE2NkVjUDFKcndvUzNMM2pMT2dGM05WalV2QStmMC9iT055djFsYVBKZjRFTkRtMGZZcWFYSEYvNFJrYTZSbVRGOXVISER1blA5L2psdURIbkFxcTZLT3RGeGswSnRHdGNpN29KdGFlWUxtdHNpSjNXQVorTjR2NGVTZWkwPSZzd3cwOXZNV3VpZlprR0VBempKdjZqS00ybWM9; _b="AV+pPg4VpvlGtL+qN4q0j+vNT7JhUErvp+4TyMybo+d7CIZ9QFohXDj6+jQlg9uD6Zc="; _routing_id="d5da9818-8ce2-4424-ad1e-d55dfe1b9aed"; sessionFunnelEventLogged=1',
  };

  var options = {
    url:
      "https://www.pinterest.com/search/pins/?q=" +
      search +
      "&rs=typed&term_meta[]=" +
      search +
      "%7Ctyped",

    headers: headers,
  };

  try {
    const response = await axios.get(options.url, { headers: headers });

    const arrMatch = response.data.match(
      /https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g,
    );

    return res.json({
      count: arrMatch.length,

      data: arrMatch,
    });
  } catch (error) {
    console.error(error);

    res.json({ error: "An error occurred while fetching data" });
  }
});

app.get("/imgur", async (req, res, next) => {
  var request = require("request");

  var link = req.query.link;

  if (!link) return res.json({ error: "missing image query" });

  var options = {
    method: "POST",

    url: "https://api.imgur.com/3/image",

    headers: {
      Authorization: "Client-ID fc9369e9aea767c",
    },

    formData: {
      image: link,
    },
  };

  request(options, function (error, response) {
    if (error) return res.json({ error: "Error na bai maya naman" });

    var upload = JSON.parse(response.body);

    res.json({ uploaded: { status: "success", image: upload.data.link } });
  });
});

app.get("/tikstalk", async (req, res, next) => {
  var user = req.query.username;

  if (!user) return res.json({ error: "missing user query!!" });

  var axios = require("axios");

  axios({
    method: "post",

    url: "https://www.tikwm.com/api/user/info?unique_id=@",

    data: {
      unique_id: user,
    },
  })
    .then(function (response) {
      var data = response.data.data;

      console.log(data);

      return res.json({
        id: data.user.id,

        nickname: data.user.uniqueId,

        username: data.user.nickname,

        avatarLarger: data.user.avatarLarger,

        signature: data.user.signature,

        secUid: data.user.secUid,

        relation: data.user.relation,

        bioLink: data.user.bioLink,

        videoCount: data.stats.videoCount,

        followingCount: data.stats.followingCount,

        followerCount: data.stats.followerCount,

        heartCount: data.stats.heartCount,

        diggCount: data.stats.diggCount,
      });
    })

    .catch(function (error) {
      return res.json({ error });
    });
});

app.get("/girledit", async (req, res, next) => {
  let key = "alighmotion";
  let apikey = req.query.apikey;

  if (!apikey || apikey !== key) {
    return res.json({
      error:
        "⚠️ Invalid API key. Contact https://www.facebook.com/eurix.pogi901 to get the correct API key!",
    });
  }

  try {
    const eugene = [
      "chescaeditzofficial6",
      "jomar_edit_girl_19",
      "inday_melody07",
      "xy_iyra12",
      "jc_zyro",
      "johnpaul_editz",
    ];

    const random = eugene[Math.floor(Math.random() * eugene.length)];
    const gen = await axios.get(
      `https://eurix-api.replit.app/api/tiksearch/tools?search=${random}`,
    );

    res.send(gen.data);
  } catch (error) {
    res.json({
      error:
        "⚠️ An error occurred while fetching the video URL. Please try again later.",
    });
  }
});

app.get("/uptimerobot/create", async (req, res, next) => {
  var name = req.query.name || Date.now();
  var url = req.query.url;
  if (!url)
    return res.json({
      error: "thiếu url!",
    });
  var request = require("request");

  var options = {
    method: "POST",
    url: "https://api.uptimerobot.com/v2/newMonitor",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    form: {
      api_key: "u2008156-9837ddae6b3c429bd0315101",
      format: "json",
      type: "1",
      url: url,
      friendly_name: name,
    },
  };

  request(options, function (error, response, body) {
    if (error) return res.json({ error });
    if (JSON.parse(body).stat == "fail")
      return res.json({ error: "lỗi, màn hình này đã tồn tại!" });
    var data = JSON.parse(body).monitor;
    return res.json({
      data,
    });
  });
});

app.get("/tinyurl", async (req, res, next) => {
  var url = req.query.url;
  if (!url) {
    return res.json({ error: "Thiếu dữ liệu để khởi chạy chương trình" });
  }
  axios({
    method: "post",
    url: "https://tinyurl.com/api-create.php?url=",
    data: {
      url: url,
    },
  })
    .then(function (response) {
      var data = response.data;
      return res.json({ url: data, author: "Eugene Aguilar" });
    })
    .catch(function (error) {
      return res.json({ error: "Error: " + error });
    });
});

app.get('/api/facebokdl/tools', async (req, res) => {
	  const url = req.query.link;

	  if (!url) {
		 res.json({ error: "Please provide a Facebook video link." });
		 return; 
	  }

	  try {
		 const response = await axios.get(`https://tools.betabotz.org/tools/facebookdl?url=${url}`);
		 const videoUrl = response.data.result.hd_q;
		 const title = response.data.result.title;
		 const author = "Eugene Aguilar";
		 res.json({ url: videoUrl, title: title, author: author });
	  } catch (error) {
		 res.json({ error: "Error fetching Facebook video details." });
	  }
	});


app.get('/gpt', async (req, res) => {
  const ask = req.query.ask;
  const options = {
    method: 'POST',
    url: 'https://gpt-43.p.rapidapi.com/api/ask',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'ec4a07939fmsh4daed89d45e8bccp165f71jsn06c493b781a9',
      'X-RapidAPI-Host': 'gpt-43.p.rapidapi.com'
    },
    data: {
      prompt: ask
    }
  };

  try {
    const response = await axios(options);
    const reply = response.data.results
    console.log(response.data);
    res.send({respond: reply});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/anh18", function (req, res) {
    const anh18 = ["https://i.imgur.com/Kopaq4l.jpeg", "https://i.imgur.com/FUAPqub.jpeg",
              "https://i.imgur.com/UNN2tWV.jpeg","https://i.imgur.com/YxLGdzR.jpeg"];
    const random = Math.floor(Math.random() * anh18.length);
    res.send({ link: anh18[random], author: "Eugene"  });
});

app.post("/shoti", async (req, res) => {
  let key = ["eugeneaguilar89", "eurixhiyoshi01", "omsimnida", "mamaw"];
  let apikey = req.body.apikey;
  
  if (!apikey || !key.includes(apikey)) {
    return res.json({ error: "invalid apikey" });
  }

  try {
    const response = await axios.post(`https://shoti-srv1.onrender.com/api/v1/get`, { apikey: "$shoti-1hnmk903v8bod9kt9sg" });
    const userInfo = response.data.data.user;
    const username = userInfo.username;
    const nickname = userInfo.nickname;
    const video = response.data.data.url;

    res.send({ username, nickname, url: video, rank: "Legendary Top" });
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/link', (req, res) => {
  res.send({
    link: ["https://vt.tiktok.com/ZSFrgFp3J/","https://www.tiktok.com/@samouricasspam/video/7309021103148535045","https://www.tiktok.com/@samouricasspam/video/7309391699875237126","https://vt.tiktok.com/ZSFrbsbc7/","https://vt.tiktok.com/ZSFrbwJSg/","https://vt.tiktok.com/ZSFrgd256/","https://vt.tiktok.com/ZSFrg8cfL/","https://vt.tiktok.com/ZSFrgNaEp/","https://vt.tiktok.com/ZSFrg8aSj/","https://vt.tiktok.com/ZSFrgLxav/","https://vt.tiktok.com/ZSFrbc9w6/","https://vt.tiktok.com/ZSFrg96Tw/","https://vt.tiktok.com/ZSFrgMWv7/","https://vt.tiktok.com/ZSFrgHeTD/","https://vt.tiktok.com/ZSFrgavnr/","https://www.tiktok.com/@yuiilalala/video/7306086948823649542","https://www.tiktok.com/@aicabianca11/video/7312397562969853190","https://www.tiktok.com/@aicabianca11/video/7273468756024708357","https://www.tiktok.com/@chwmpagnemami/video/7303612511109123334","https://vt.tiktok.com/ZSFrg6E6K/","https://vt.tiktok.com/ZSFrgPo6g/","https://vt.tiktok.com/ZSFrgCUrm/","https://vt.tiktok.com/ZSFrgCvoE/","https://vt.tiktok.com/ZSFrgmY1v/","https://vt.tiktok.com/ZSFrgDGC1/","https://vt.tiktok.com/ZSFrgkKWJ/","https://vt.tiktok.com/ZSFrgfkhy/","https://vt.tiktok.com/ZSFrg6Us1/","https://vt.tiktok.com/ZSFrgk7b1/","https://vt.tiktok.com/ZSFrgX9JB/","https://vt.tiktok.com/ZSFrg9xA7/","https://vt.tiktok.com/ZSFrgxqjC/","https://vt.tiktok.com/ZSFrg2evJ/","https://vt.tiktok.com/ZSFrg54dw/","https://vt.tiktok.com/ZSFrgkSQF/","https://vt.tiktok.com/ZSFrgUFXW/","https://vt.tiktok.com/ZSFrguu3x/","https://vt.tiktok.com/ZSFrgPDpS/","https://vt.tiktok.com/ZSFrgHj6V/","https://vt.tiktok.com/ZSFrgkc6a/","https://vt.tiktok.com/ZSFrgjCM8/","https://vt.tiktok.com/ZSFrpdcVM/","https://vt.tiktok.com/ZSFrgp8Eh/","https://vt.tiktok.com/ZSFrgKAgN/","https://vt.tiktok.com/ZSFrg3VLX/","https://vt.tiktok.com/ZSFrpRxde/","https://vt.tiktok.com/ZSFrggPyk/","https://vt.tiktok.com/ZSFrgKFNb/","https://vt.tiktok.com/ZSFrgwt5n/","https://vt.tiktok.com/ZSFrp1V2y/","https://vt.tiktok.com/ZSFrgonw9/","https://vt.tiktok.com/ZSFrgoVRx/","https://vt.tiktok.com/ZSFrg4ay1/","https://vt.tiktok.com/ZSFrgbx52/","https://vt.tiktok.com/ZSFrgTRCq/","https://vt.tiktok.com/ZSFrp6Qwq/","https://vt.tiktok.com/ZSFrpuxtr/","https://vt.tiktok.com/ZSFrpSSgU/","https://www.tiktok.com/@cassandra_verone/video/7303129139723193606","https://vt.tiktok.com/ZSFrpF7YM/","https://vt.tiktok.com/ZSFrpy3nt/","https://vt.tiktok.com/ZSFrpHMWH/","https://vt.tiktok.com/ZSFrphn56/","https://vt.tiktok.com/ZSFrpPsgy/","https://vt.tiktok.com/ZSFrpP1SX/","https://vt.tiktok.com/ZSFrphcdo/","https://vt.tiktok.com/ZSFrpB4GK/","https://vt.tiktok.com/ZSFrpkRWq/","https://vt.tiktok.com/ZSFrprXAy/","https://vt.tiktok.com/ZSFrpa1rx/","https://vt.tiktok.com/ZSFrpjVNU/","https://vt.tiktok.com/ZSFrp5rEw/","https://vt.tiktok.com/ZSFrpYmEy/","https://vt.tiktok.com/ZSFrpUEsD/","https://vt.tiktok.com/ZSFrpuF8T/","https://vt.tiktok.com/ZSFrpPB33/","https://vt.tiktok.com/ZSFrpAvXN/","https://vt.tiktok.com/ZSFrpHgRj/","https://vt.tiktok.com/ZSFrph5UQ/","https://vt.tiktok.com/ZSFrpfaAU/","https://vt.tiktok.com/ZSFrpm9rp/","https://vt.tiktok.com/ZSFrpYxVd/","https://vt.tiktok.com/ZSFrp2v1p/","https://vt.tiktok.com/ZSFrpx2JD/","https://vt.tiktok.com/ZSFrpwhA8/","https://vt.tiktok.com/ZSFrpTQMM/","https://vt.tiktok.com/ZSFrpKgHp/","https://vt.tiktok.com/ZSFrpoa3j/","https://vt.tiktok.com/ZSFrpWMw8/","https://vt.tiktok.com/ZSFrpEpma/","https://vt.tiktok.com/ZSFrpsUMA/","https://vt.tiktok.com/ZSFrpqqUx/","https://vt.tiktok.com/ZSFrpCLY7/","https://vt.tiktok.com/ZSFrptyHT/","https://vt.tiktok.com/ZSFrpvNKD/","https://vt.tiktok.com/ZSFrpGhaH/","https://vt.tiktok.com/ZSFrpG5NP/","https://vt.tiktok.com/ZSFrpoRqd/","https://vt.tiktok.com/ZSFrp9q94/","https://vt.tiktok.com/ZSFrpwvb9/"]
  });
});

app.get('/remini', async (req, res) => {
	 try {
		  const inputImage = req.query.input;

		  if (!inputImage) {
				return res.status(400).send({ error: 'Missing input image URL'});
		  }

		  const result = await remini(inputImage);
		  res.send(result);
	 } catch (error) {
		  console.error('Error calling Remini API:', error.message);
		  res.status(error.response?.status || 500).send({
				error: 'Internal Server Error',
				details: error.message,
		  });
	 }
});

app.get("/api/cupcutdl/tools", async (req, res) => {
  const { url } = req.query;
  if (!url) {
	 return res.json({ error: "Please provide a link from CupCut." });
  }

  try {
	 const response = await axios.get(`https://tools.betabotz.org/tools/capcutdl?url=${url}`);
	 const videoUrl = response.data.result.video_ori;
	 const title = response.data.result.title;
	 const desc = response.data.result.description;
	 const like = response.data.result.digunakan;

	 res.json({
		url: videoUrl,
		title: title,
		description: desc,
		like: like,
		author: "Eugene Aguilar"
	 });
  } catch (error) {
	 res.json({ error: "Error fetching video data" });
  }
});

app.get('/api/facebokdl/tools', async (req, res) => {
  const url = req.query.link;
  
  if (!url) {
    res.json({ error: "Please provide a Facebook video link." });
    return; // Added to exit the function early in case of missing URL
  }

  try {
    const response = await axios.get(`https://tools.betabotz.org/tools/facebookdl?url=${url}`);
    const videoUrl = response.data.result.hd_q;
    const title = response.data.result.title;
    const author = "Eugene Aguilar";
    res.json({ url: videoUrl, title: title, author: author });
  } catch (error) {
    res.json({ error: "Error fetching Facebook video details." });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
