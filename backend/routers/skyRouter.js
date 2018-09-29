const express = require("express");
const router = express.Router();
const dbHelpers = require("../dbHelpers/helpers");
const colorCompare = require('../colorcompare');
const getColors = require("get-image-colors");

router.post("/", async (req, res) => {
  if (!req.body.color||req.body.color.length !== 7) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  req.body.color = colorCompare.findNearestColor(req.body.color);
  console.log(req.body.color);
  try{
    let results = await dbHelpers.getSkyByColor(req.body.color);
    console.log(results);
    let randomURL = results[Math.floor(Math.random()*results.length)]
    res.status(200).json( randomURL);
  }catch(err){
    console.log(err);
  }

});

router.post("/add", (req, res) => {
  let urlList = req.body.images.split(",");
  let holdingArr=urlList.map(async (e, i) => {
    try {
      return await getColors(e)
        .then(colors => colors.map(color => color.hex()))
        .catch(err => {
          res.status(500).json({error:""})
          console.log(err);
          return
        });
    } catch (err) {
      res.status(500).json({error:""})
      console.log(err);
      return
    }
  });
  Promise.all(holdingArr)
    .then(completed => {
      completed.forEach(async(element,i) => {
        const colorObj ={};
        colorObj.url = urlList[i];
        element.forEach((e,index )=> {
          colorObj[`color${index+1}`] = e;
        });
        try{
         await dbHelpers.addSky(colorObj);
        }catch(err){
          res.status(500).json({error:""})
          console.log(err);
          return        }
      });
    }).then(
      ()=>{
        res.status(200).json({message:"success"})
      }
    )
    .catch(function(err) {
      res.status(500).json({error:""})
      console.log(err);
      return
    });
});

router.get("/:id", async (req, res) => {
  try {
    let results = await dbHelpers.getSky(req.params.id);
    if (results.length === 0) {
      res.status(400).json({ error: "That ID does not exist" });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
