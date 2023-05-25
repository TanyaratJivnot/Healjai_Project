const express =require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/img/user');
  },
  filename:function(req,file,cb){
    cb(null, file.originalname);
  }
})
const upload = multer({storage});

const User = require('../models/user');
const Doctor = require('../models/docter');
const Admin = require('../models/admin');


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
})
/* form ยืนยันให้เก็บข้อมูลส่วนตัว คนไข้*/
router.get('/fornInformation',(req,res)=>{
  res.render('information.ejs')
});
/* form ยืนยันให้เก็บข้อมูลส่วนตัว หมอ*/
router.get('/fornInformationDr',(req,res)=>{
  res.render('informationDr.ejs')
});
/* หน้าเเรกตอนยังไม่ได้login */
router.get('/',(req,res)=>{
  res.render('index.ejs')
});  
/* login */
router.get('/login', (req,res)=>{
  res.render('login.ejs');
});
router.post('/loginPage', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const timeExpire = 604800;/* 1 week */
  try {
    let user = await User.findOne({ UserEmail: email });
    let doctor = await Doctor.findOne({ DrEmail: email });
    let admin = await Admin.findOne({ AdminEmail: email });

    if (user) {
      const isPasswordValid = await user.comparePassword(password);
      if (isPasswordValid) {
        const doctors = await Doctor.find({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
        const patain = await User.findOne({UserEmail: email},'_id UserName UserImg MemberShip UserEmail')
        console.log(patain);
        if (patain) {
          req.session.user = {
            _id: patain._id,
            UserName: patain.UserName,
            UserEmail: patain.UserEmail,
            UserImg: patain.UserImg,
            MemberShip: patain.MemberShip
        };
      }
      else {
        console.log('not found');
      }
        req.session.login = true;
        req.session.cookie.maxAge=timeExpire;
        res.render('home.ejs', { doctors, patain });
      } else {
        res.render('login.ejs', { error: 'Invalid email or password' });
      }
    } 
    if (doctor) {
      const isPasswordValid = await doctor.comparePassword(password);
      if (isPasswordValid && doctor.statusCheck === 2) {
        const docter = await Doctor.findOne({DrEmail: email},'_id DrrImg DrEmail DrName DrAge MedicalCertificate StatusLevel statusCheck')
        console.log(docter);
        if (docter) {
          req.session.doctor = {
            _id: docter._id,
            DrEmail: docter.DrEmail,
            DrName: docter.DrName,
            DrAge: docter.DrAge,
            DrrImg: docter.DrrImg,
            MedicalCertificate: docter.MedicalCertificate 

        };
          req.session.login = true;
          req.session.cookie.maxAge=timeExpire;
          res.render('accountDr.ejs', { docter});
      } else {
        res.render('login.ejs', { error: 'Invalid email or password' });
      }
    }
    } 
    if (admin) {
      if (email == "admin@gmail.com" && password =="123") {
        Doctor.find().exec().then(doc=>{
          res.render('adminAllDr.ejs',{doctors:doc});
        }).catch(err=>{
          console.log(err);
        })
      } else {
        res.render('login.ejs', { error: 'Invalid email or password' });
      }
    } else {
      res.render('login.ejs', { error: 'Invalid email or password' });
    }
  } catch (error) {
    console.log(error);
    res.render('login.ejs', { error: 'An error occurred during login' });
  }
});
/* regidter คนไข้ */
router.get('/register',(req, res)=>{
  res.render('register.ejs');
});
router.post('/registerPatain',upload.single('UserImg'), async (req, res)=>{
  try {
    let newPatient = new User({
      UserName: req.body.UserName,
      UserEmail: req.body.UserEmail,
      UserPasswd: req.body.UserPasswd,
      UserAddr: req.body.UserAddr,
      UserAge: req.body.UserAge,
      UserGenger: req.body.UserGenger,
      UserIDCard: req.body.UserIDCard,
      UserImg: req.file.filename
    });
    await newPatient.save();
    console.log(req.body);
    res.render('information.ejs');
  } catch(err){
    console.log(err);
  }
  
});

router.get('/registerDr',(req,res)=>{
  res.render('registerDr.ejs');
});
router.post('/registerDoctor',upload.single('DrrImg'), async (req, res)=>{
  try{
    let newDoctor = new Doctor({
      DrName: req.body.DrName,
      DrEmail: req.body.DrEmail,
		  DrPasswd: req.body.DrPasswd, 
      DrAge: req.body.DrAge,
      DrAddr: req.body.DrAddr,
		  DrGenger: req.body.DrGenger,
      MedicalCertificate: req.body.MedicalCertificate,
		  DrrImg: req.file.filename
    });
    await newDoctor.save();
    console.log(req.body);
    console.log(req.file);
    res.render('informationDr.ejs');
  } catch(err){
    console.log(err);
  }
})


/* หน้าเเรกหลังเข้าสู่ระบบเเล้ว ปล.ลงทพเบียนสมัครสมาชิกเเล้วเท่านั้น */
router.get('/home',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.find({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    console.log('home : ',patain);
    console.log('doctor : ',doctors);
    res.render('home.ejs', { doctors, patain: patain });
    console.log(patain);
  } else {
    res.redirect('/login');
  }
});


/*  แบบทดสอบว่าเป็นโรคซึมเศร้าไหม (คนไข้เท่านั้น) */
router.get('/test',async (req,res)=>{
  if (req.session.login) {
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('testForm.ejs', {patain: patain });
    console.log(patain);
  } else {
    res.redirect('/login');
  }
});
/* ผลแบบประเมิน */
router.post('/resultTest',async (req,res)=>{
  if (req.session.login) {
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    let {Radio1,Radio2,Radio3,Radio4,Radio5,Radio6,Radio7,Radio8,Radio9}=req.body;
    let score1 = parseInt(Radio1);
    let score2 = parseInt(Radio2);
    let score3 = parseInt(Radio3);
    let score4 = parseInt(Radio4);
    let score5 = parseInt(Radio5);
    let score6 = parseInt(Radio6);
    let score7 = parseInt(Radio7);
    let score8 = parseInt(Radio8);
    let score9 = parseInt(Radio9);
    if (isNaN(score1) || isNaN(score2) || isNaN(score3) || isNaN(score4) || isNaN(score5) || isNaN(score6) || isNaN(score7) || isNaN(score8) || isNaN(score9)) {
      // Handle invalid form values
      res.send('Invalid form values', { doctors,patain });
      return;
    }
    const total = score1 + score2+ score3+ score4+ score5+ score6+ score7+ score8+ score9;
    let resl="";
    if(total <= 7){
      resl = resl+"ไม่มีอาการของโรคซึมเศร้าหรือมีอาการของโรคซึมเศร้าระดับน้อยมาก";
    }
    else if(total > 7 || total <= 12){
    resl = resl+"มีอาการของโรคซึมเศร้า ระดับน้อย";
    }
    else if(total > 12 || total <= 18){
      resl = resl+"มีอาการของโรคซึมเศร้า ระดับปานกลาง";
    }
    else{
      resl = resl+"มีอาการของโรคซึมเศร้า ระดับรุนเเรง";
    }
      res.render('resultTestForm.ejs',{totalScore:total,resule:resl,patain: patain});
    } else {
      res.redirect('/login');
    }
});


/* หน้า เลือกโปรโมชั่น-->จ่ายเงิน */
router.get('/Consult',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.find({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('Consult.ejs', { doctors,patain: patain })
  } else {
    res.redirect('/login');
  }
});
/* จ่ายเงิน --->จ่ายเเล้วคุยวิดีโอเเชทได้
   ยังไม่จ่าย ---> ไม่สามารถเเชทหรือคุยได้ --->ไปเลือหโปรละจ่าย */
   
router.get('/payment',async (req,res)=>{
  if (req.session.login) {
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('payment.ejs', { error: null ,patain:patain});
  } else {
    res.redirect('/login');
  }
})
router.get('/payment/:id',async (req,res)=>{
  if (req.session.login) {
   let data ={
    MemberShip:1
   }
   User.findByIdAndUpdate(req.session.user._id,data,{useFindAndModify:false}).exec().then(
    console.log('success')
   ).catch(err=>{
    console.log(err);
   })
  } else {
    res.redirect('/login');
  }
})
router.post('/',async (req,res)=>{
  if (req.session.login) {
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    const { cardNumber, cardName, cardExpiry, cardCVV } = req.body;
    let error = null;
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
      error = 'All fields are required.';
    } else if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      error = 'Invalid card number.';
    } else if (!/^[A-Za-z\s]+$/.test(cardName)) {
      error = 'Invalid cardholder name.';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      error = 'Invalid expiry date.';
    } else if (!/^\d{3}$/.test(cardCVV)) {
      error = 'Invalid CVV.';
    }
    if (error) {
      res.render('payment.ejs', { error: null ,doctors,patain:patain});
    }
  } else {
    res.redirect('/login');
  }

});

/* chatlist */
router.get('/chatlist',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.find({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('listchatDr.ejs', { doctors,patain: patain })
  } else {
    res.redirect('/login');
  }
  
});
/* chat */
router.get('/chat/:id',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.find({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('chat.ejs', { doctors,patain: patain })
  } else {
    res.redirect('/login');
  }
});

router.get('/calllist',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.findOne({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('listcallDr.ejs', { doctors,patain: patain })
  } else {
    res.redirect('/login');
  }

});
/* create room id  */
router.get('/room',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.findOne({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    const patain = await User.findOne({ UserEmail: req.session.user.UserEmail }, '_id UserName UserImg MemberShip');
    res.render('call.ejs')
  } else {
    res.redirect('/login');
  }
})

///////////////////////////////////////////////////////////////////////////////
/* Doctor Zone */
router.get('/accountDr',async (req,res)=>{
  if (req.session.login) {
    const doctors = await Doctor.findOne({ statusCheck: 2 }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('accountDr.ejs', { doctors});
  } else {
    res.redirect('/login');
  }
})
/* หลังจากregisterแล้วไปหน้าโปรไฟล์ของหมอ */
router.get('/listchatPatain',async (req,res)=>{
  if(req.session.login){
    const doctor = await Doctor.findOne({ DrEmail:req.session.doctor.DrEmail }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('listchatPatain.ejs',{doctor:doctor});
  }
});
router.get('/listcallPatain',async (req,res)=>{
  if(req.session.login){
    const doctor = await Doctor.findOne({ DrEmail:req.session.doctor.DrEmail }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('listCallPatain.ejs',{doctor:doctor});
  }
});
router.get('/videoDr',async (req,res)=>{
  if(req.session.login){
    const doctor = await Doctor.findOne({ DrEmail:req.session.doctor.DrEmail }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('videoDr.ejs',{doctor:doctor});
  }
});
router.get('/chatDr',async (req,res)=>{
  if(req.session.login){
    const doctor = await Doctor.findOne({ DrEmail:req.session.doctor.DrEmail }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('chatDr.ejs',{doctor:doctor});
  }
});
router.get('/financeDr',async (req,res)=>{
  if(req.session.login){
    const doctor = await Doctor.findOne({ DrEmail:req.session.doctor.DrEmail }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('financeDr.ejs',{doctor:doctor});
  }
});
router.get('/appointmentDr',async (req,res)=>{
  if(req.session.login){
    const doctor = await Doctor.findOne({ DrEmail:req.session.doctor.DrEmail }, '_id DrrImg DrName DrAge MedicalCertificate StatusLevel statusCheck');
    res.render('appointmentDr.ejs',{doctor:doctor});
  }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Admin Zone */
router.get('/allDrRegis',(req,res)=>{
  Doctor.find().exec().then(doc=>{
    res.render('adminAllDr.ejs',{doctors:doc});
  }).catch(err=>{
    console.log(err);
  })
})
router.get('/addDr/:id',(req,res)=>{
  let data ={
    statusCheck:2
  }
 Doctor.findByIdAndUpdate(req.params.id,data,{useFindAndModify:false}).exec().then(
  res.redirect('/allDrRegis')
 ).catch(err=>{
  console.log(err);
 })
})
router.get('/del/:id',(req,res)=>{
  Doctor.findByIdAndDelete(req.params.id,{useFindAndModify:false}).exec()
  .then(res.redirect('/allDrRegis')).catch(err=>{
    console.log(err);
  })
})    
router.get('/checkBankDrr',(req,res)=>{
  
})
module.exports = router;