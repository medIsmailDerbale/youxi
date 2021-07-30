const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const faker = require("faker");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

dotenv.config({ path: path.join(__dirname, "../config.env") });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successfull");
  });

let padsImages = [
  "https://cdn.coolermaster.com/media/assets/1005/mp511-l-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1006/mp510-pink-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1025/mp750-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1096/510_02-hover.png",
  "https://cdn.coolermaster.com/media/1045/mp860-380x380-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1052/ad02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1055/ym02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1002/trx02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1021/rrx02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1027/drx02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1060/rx02-hover.png",
];

let padsTitles = [
  "MP511 Gaming Mouse Pad",
  "MP510 Sakura",
  "MP750",
  "MP510",
  "MP860",
  "RGB Hard Gaming Mousepad",
  "Swift-RX",
  "SGS-4120-KMMM1 (SIZE M)",
  "Power-RX",
  "Speed-RX",
  "Control-RX",
];

let audioImages = [
  "https://cdn.coolermaster.com/media/assets/1004/mh752-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1009/mh630-380x380-1-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1010/mh650-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1032/mh670-380x380-1-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1010/ch321-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1002/mh710-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1031/mh703-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1050/mh752-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1044/mh751-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1175/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1159/2-hover.png",
  "https://cdn.coolermaster.com/media/1028/mh320-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1025/2-hover.png",
  "https://cdn.coolermaster.com/media/1063/masterplus-pro-380x380-2-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1066/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1076/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1155/earw_02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1114/500-02-hover.png",
  "https://cdn.coolermaster.com/media/assets/1122/300-02-hover.png",
];

let audioTitles = [
  "MH752-ACB",
  "MH630",
  "MH650",
  "MH670",
  "CH321",
  "MH710",
  "MH703",
  "MH752",
  "MH751",
  "MasterPulse MH530",
  "MasterPulse MH750",
  "MasterPulse MH320",
  "MasterPulse White Edition",
  "MasterPulse Pro",
  "MasterPulse",
  "MasterPulse In-ear - Black",
  "MasterPulse In-ear - White",
  "Ceres-500",
  "Ceres-300",
];

let miceImages = [
  "https://cdn.coolermaster.com/media/1747/mm730-white-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1726/mm731-white-380x380-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1002/mm711-lite-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1007/mm711-retro-380x380-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1024/mm720-matte-white-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1008/mm831-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1016/mm711-blue-steel-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1002/m711-golden-red-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1026/mm711-white-glossy-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1004/mm710-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1012/cm110_380x380_2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1002/mm830-380x380_2-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1030/531_01-hover.png",
  "https://cdn.coolermaster.com/media/assets/1142/cm01-hover.png",
  "https://cdn.coolermaster.com/media/assets/1025/530_01-hover.png",
  "https://cdn.coolermaster.com/media/1050/mm520-380x380-2-1b-hover.png",
  "https://cdn.coolermaster.com/media/1047/mastermouse-s-380x380-2-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1108/1-hover.png",
  "https://cdn.coolermaster.com/media/1052/mastermouse-pro-l-380x380-2-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1135/1-hover.png",
  "https://cdn.coolermaster.com/media/1054/xornet-ii-380x380-1-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1209/1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1073/ceii01-hover.png",
  "https://cdn.coolermaster.com/media/assets/1084/ro-g01-hover.png",
  "https://cdn.coolermaster.com/media/assets/1105/nce01-hover.png",
  "https://cdn.coolermaster.com/media/1057/mizar-380x380-2-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1025/1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1069/hovac_1-hover.png",
  "https://cdn.coolermaster.com/media/1060/recon-380x380-1-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1086/1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1154/spawn_380x380_1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1051/no01-hover.png",
];

let miceTitles = [
  "MM730 Gaming Mouse",
  "MM731 Gaming Mouse",
  "MM711 LITE",
  "MM711 Retro",
  "MM720",
  "MM831",
  "MM711 Blue Steel",
  "MM711 Golden Red",
  "MM711",
  "MM710",
  "CM110",
  "MM830",
  "MM531",
  "CM310",
  "MasterMouse MM530",
  "MasterMouse MM520",
  "MasterMouse S",
  "MasterMouse Lite S",
  "MasterMouse Pro L",
  "Sentinel III",
  "Xornet II",
  "Reaper",
  "Sentinel Advance II",
  "Sentinel Z3RO-G",
  "Sentinel Advance",
  "Mizar",
  "Alcor",
  "Havoc",
  "Recon",
  "Xornet",
  "Spawn",
  "Inferno",
];

let keyboardImages = [
  "https://cdn.coolermaster.com/media/assets/1025/sk653-black-380x380-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1004/sk652-black-380x380-1-hover.png",
  "https://cdn.coolermaster.com/media/1234/ck352-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1004/ck351-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1009/sk620-silver-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1003/sk622-black-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1005/sk622-white-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1024/ck350-v2-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1019/ck530-v2-380x380-2-0619-hover.png",
  "https://cdn.coolermaster.com/media/assets/1009/ck550-v2-380x380-2-0619-hover.png",
  "https://cdn.coolermaster.com/media/assets/1031/controlpad-380x380-v2-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1005/sk631-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1004/sk651-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1002/mk110-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1003/sk621-white-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1008/sk650w-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1003/sk630w-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1041/sk621-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1002/mk850-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1032/sk650-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1021/mk730-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1037/ck530-380x380-1-hover.png",
  "https://cdn.coolermaster.com/media/1071/sk630-380x380-1-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1167/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1088/ck550-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1015/mk750-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1095/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1117/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1120/masterkeys-s-section-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1022/masterkeys-pro-s-white-section-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1037/2-hover.png",
  "https://cdn.coolermaster.com/media/1027/masterkeys-lite-l-380x380-2-1-hover.png",
  "https://cdn.coolermaster.com/media/1018/masterkeys-pro-l-white-2-1-hover.png",
  "https://cdn.coolermaster.com/media/1017/masterkeys-pro-m-white-led-380x380-2-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1091/2-hover.png",
  "https://cdn.coolermaster.com/media/1013/masterkeys-pro-l-rgb_380x380_1-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1015/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1159/quickfire-tk-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/1004/quickfire-ultimate-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1005/quick-fire-tk-stealth-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1131/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1142/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1008/quick-fire-rapid-i-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1183/2-hover.png",
  "https://cdn.coolermaster.com/media/1028/quickfire-rapid-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1031/2-hover.png",
  "https://cdn.coolermaster.com/media/1034/quickfire-xt-380x380-2-1-hover.png",
  "https://cdn.coolermaster.com/media/assets/1119/2-hover.png",
  "https://cdn.coolermaster.com/media/1033/quickfire-rapid-red-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1133/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1139/2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1063/2-hover.png",
  "https://cdn.coolermaster.com/media/1037/novatouch-tkl-380x380-2-hover.png",
];

let keyboardTitle = [
  "SK653 Full Mechanical Wireless Keyboard",
  "SK652 Full Mechanical Keyboard",
  "CK352 Gaming Mechanical Keyboard",
  "CK351 Gaming Keyboard",
  "SK620 Space Gray & Silver White",
  "SK622 Space Gray",
  "SK622 Silver",
  "CK350",
  "CK530 V2",
  "CK550 V2",
  "CONTROLPAD",
  "SK631",
  "SK651",
  "MK110",
  "SK621 White",
  "SK650",
  "SK630",
  "SK621",
  "MK850",
  "SK650",
  "MK730",
  "CK530",
  "SK630",
  "CK552",
  "CK550",
  "MasterKeys MK750",
  "MasterKeys Pro L - GeForce® GTX Edition",
  "MasterKeys L",
  "MasterKeys S",
  "MasterKeys Pro S White LEDs",
  "MasterKeys Pro M RGB",
  "MasterKeys Lite L",
  "Masterkeys Pro L White LEDs",
  "Masterkeys Pro M White LEDs",
  "Masterkeys Pro S RGB",
  "MasterKeys Pro L RGB",
  "Mech",
  "Quick Fire TK",
  "Quick Fire Ultimate",
  "Quick Fire TK Stealth",
  "Quick Fire XT STEALTH",
  "Quick Fire Pro",
  "Quick Fire RAPID-i",
  "Quick Fire Stealth",
  "QUICK FIRE RAPID",
  "Suppressor",
  "Quick Fire XT",
  "Quick Fire Rapid-Si",
  "Quick Fire Rapid(Red Switch)",
  "Trigger",
  "Trigger-Z",
  "Quick Fire XTi",
  "NovaTouch TKL",
];

let monitorsImages = [
  "https://cdn.coolermaster.com/media/assets/1007/gm34-380x380-2-hover.png",
  "https://cdn.coolermaster.com/media/assets/1004/gm27-cf-380x380-2-hover.png",
];

let monitorsTitles = ["GM34-CW", "GM27-CF"];
const seedProducts = async function (titlesArr, imgsArr, categStr) {
  try {
    const categ = await Category.findOne({ name: categStr });
    for (let i = 0; i < titlesArr.length; i++) {
      let prod = new Product({
        name: titlesArr[i],
        imageCover: imgsArr[i],
        description: faker.lorem.paragraph(),
        price: faker.datatype.number({ min: 10, max: 50 }),
      });
      categ.products.push(prod._id);
      await prod.save();
      await categ.save();
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// seedProducts(padsTitles, padsImages, "Pads");
// seedProducts(audioTitles, audioImages, "Audio");
// seedProducts(miceTitles, miceImages, "Mice");
// seedProducts(keyboardTitle, keyboardImages, "Keyboards");
// seedProducts(monitorsTitles, monitorsImages, "Monitors");
console.log("finished");
